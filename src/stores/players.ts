import { defineStore } from 'pinia'
import type {
  DreamTeam,
  DreamTeamPlayer,
  BasePlayer,
  Season,
  Seasons,
  BaseTeam,
  Team,
  RatingsStats,
  StatModifiers,
  FullPlayer,
  PlayerURL,
  TeamName, Position,
} from '@/types.ts'
import { computed, inject, type Ref, ref } from 'vue'
import { ACCOLADE_VALUES, INITIAL_STAT_MODIFIERS, INJECTABLES } from '@/constants.ts'
import { accoladesPlayerHas, getAverageStatsForPlayers, isForward } from '@/util.ts'
import useAncillaryData from '@/composables/useAncillaryData.ts'
import useStatisticalMethods from '@/composables/useStatisticalMethods.ts'

export const usePlayersStore = defineStore(
  'players', () => {
    const statModifiers = inject<Ref<StatModifiers>>(INJECTABLES.STAT_MODIFIERS, ref(INITIAL_STAT_MODIFIERS))

    const rawPlayers: Ref<Seasons> = ref<Seasons>({});
    const loading: Ref<boolean> = ref(false)
    const {dreamTeams, challengeCups, youngPlayersOfTheYear } = useAncillaryData();
    const { quantile, calculatePercentile } = useStatisticalMethods()

    const _initSeasons = computed<Record<Season, Team[]>>(() => {
      // Create a value to return
      const returnVal: Record<Season, Team[]> = {}

      // Take the players we get from JSON
      Object.entries(rawPlayers.value).forEach(function ([season, teams]) {
        const seasonNumber = parseInt(season) as Season
        const dreamTeamOfSeason: DreamTeam = dreamTeams[seasonNumber as Season] ?? {}

        const challengeCup = challengeCups[seasonNumber];
        const _lanceTodd = challengeCup?.lance_todd ?? [];
        const lanceTodd = Array.isArray(_lanceTodd) ? _lanceTodd : [_lanceTodd];
        const youngPlayerOfTheYear: PlayerURL | undefined = youngPlayersOfTheYear[seasonNumber as Season];

        // Convert the players into the accoladed, rated versions
        // By cross-referencing the dream teams JSON file
        returnVal[seasonNumber] = teams.map(
          (team: BaseTeam): Team => {
            const teamChallengeCup = challengeCup?.team === team.name;
            return {
            ...team,
            challengeCup: teamChallengeCup,
            players: team.players.map(function (player: BasePlayer): FullPlayer {
              const dreamTeamPlayer: DreamTeamPlayer | undefined = dreamTeamOfSeason[player.url]
              const isYoungPlayerOfTheYear: boolean = youngPlayerOfTheYear === player.url;
              const isDreamTeam = !!dreamTeamPlayer
              const isMoS = dreamTeamPlayer?.mos ?? false
              const isLanceTodd = lanceTodd.includes(player.url);
              const proportionDownTable = team.finish / teams.length
              const benches = player.stats.appearances - player.stats.starts;
              const seasonAverage = getAverageStatsForPlayers(teams.flatMap(({ players }) => players).filter((p) => p.positions[0] === player.positions[0]))
              const downTableModifier = Math.pow(1 + proportionDownTable, statModifiers.value.downTable)
                const accolades = {
                dreamTeam: isDreamTeam,
                  mos: isMoS,
                  lanceTodd: isLanceTodd,
                  youngPlayerOfTheYear: isYoungPlayerOfTheYear,
              }
              const ratings: RatingsStats = {
                baseRate: (1 - proportionDownTable) * (player.stats.appearances / seasonAverage.appearances),
                finish: team.finish === 1 ? 15 : 0,
                champions: team.champions ? 25 : 0,
                challengeCup: teamChallengeCup ? 20 : 0,
                starts: player.stats.starts / seasonAverage.starts,
                benches: benches / 20,
                adjustedTries: 1 + proportionDownTable * (
                  (player.stats.tries / seasonAverage.tries) /
                  (player.stats.starts / seasonAverage.starts)
                ),
                adjustedDownTable: accoladesPlayerHas(accolades)
                  .map((a) => ACCOLADE_VALUES[a])
                  .reduce((a, b) => a + b, 0) * downTableModifier,
              }

              const ratingsSum = Object.values(ratings).reduce((a, b) => a + b, 0);

              return {
                ...player,
                positions: player
                  .positions
                  .reduce((acc: Record<Position, number>, curr: Position): Record<Position, number> => {
                  acc[curr as Position] = (acc[curr as Position] ?? 0) + 1
                  return acc
                }, {} as Record<Position, number>),
                accolades: accolades,
                rating: ratingsSum,
                ratings,
                season: parseInt(season) as Season,
                team: team.name
              }
            }),
          }})
      })
      return returnVal
    })

    const seasons = computed<Record<Season, Team[]>>(() => {
      const returnVal: Record<Season, Team[]> = {}
      const allRatings = Object.values(_initSeasons.value)
        .flatMap((teams: Team[]) => Object.values(teams).flatMap((team) => team.players))
        .flatMap((player: FullPlayer) => player.rating)
        .sort((a, b) => a - b)
      if (allRatings.length === 0) {
        return returnVal;
      }
      const topCutoff = quantile(allRatings, 99)
      const worstRating = allRatings.reduce((prev, curr) => Math.min(prev, curr), Number.MAX_SAFE_INTEGER)
      const ratingDiff: number = topCutoff - worstRating
      const startingScore = 60
      const multiplier: number = 100 - startingScore
      Object.entries(_initSeasons.value).forEach(([season, teams]: [string, Team[]]) => {
        let seasonTeams = teams.map((team: Team) => ({
          ...team,
          players: team.players.map(
            (player: FullPlayer): FullPlayer => {
              const boundedPlayerRating = Math.min(topCutoff, player.rating)
              const overWorst = boundedPlayerRating - worstRating
              const proportion = overWorst / ratingDiff
              return {
                ...player,
                rating: startingScore + (Math.pow(proportion, 1/5) * multiplier)
              }
            },
          ),
        }))
        const appearancesPerTeam: Record<PlayerURL, Record<TeamName, number>> = {};
        seasonTeams.forEach(({ name, players }) => {
          players.forEach((p) => {
            const appearancesForTeam = { [name]: Object.values(p.positions).reduce((acc, curr) => acc + curr, 0)}
            appearancesPerTeam[p.url] = appearancesPerTeam[p.url] ? { ...appearancesPerTeam[p.url], ...appearancesForTeam} : appearancesForTeam;
          })
        })
        // Removing players that appear in more than one team
        Object
          .entries(appearancesPerTeam)
          .filter(([_, appsPerTeam]) => Object.values(appsPerTeam).length > 1)
          .forEach(([playerURL, appsPerTeam]) => {
            const [mostAppsFor,] = Object
              .entries(appsPerTeam)
              .reduce(([accTeam, accApps], [currTeam, currApps]) => currApps > accApps ? [currTeam, currApps] : [accTeam, accApps], ['', 0])
            seasonTeams = seasonTeams.map((t) => ({
              ...t,
              players: t.name === mostAppsFor ? t.players : t.players.filter(({ url }) => url !== playerURL)
            }))
          })
        returnVal[parseInt(season) as Season] = seasonTeams
      })
      return returnVal;
    })


    const allPlayers = computed<FullPlayer[]>(() => {
      return Object.entries(seasons.value)
        .flatMap(([season, teams]) =>
          Object.values(teams).flatMap((team) =>
            team.players.map((player) => ({
              ...player,
              season: parseInt(season) as Season,
              team: team.name,
            })),
          ),
        )
        .sort((b, a) => a.rating - b.rating)
    })

    const bestAndWorst = computed<{best: FullPlayer | null, worst: FullPlayer | null}>(() => {
      return {
        best: allPlayers.value.reduce(
          (prev: FullPlayer | null, curr: FullPlayer) =>
            prev === null ? curr : prev.rating < curr.rating ? curr : prev,
          null,
        ),
        worst: allPlayers.value.reduce(
          (prev: FullPlayer | null, curr: FullPlayer) =>
            prev === null ? curr : prev.rating > curr.rating ? curr : prev,
          null,
        ),
      }
    })

    const allTeams = computed(() => {
      const ret: Record<TeamName, Record<Season, Team>> = {}
      for (const season in seasons.value) {
        for (const team of seasons.value[season] ?? []) {
          const teamSeason = { [parseInt(season) as Season]: team }
            ret[team.name] =
              ret[team.name] === undefined
                ? teamSeason
                : {...ret[team.name], ...teamSeason}
        }
      }
      return ret;
    })


    fetch('./data.json')
      .then(response => response.json())
      .then(data => rawPlayers.value = data)

    return {
      seasons,
      allTeams,
      allPlayers,
      bestAndWorst,
      dreamTeams,
      challengeCups,
      loading,
    }
});
