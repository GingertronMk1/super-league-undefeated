import { defineStore } from 'pinia'
import type {
  DreamTeam,
  DreamTeamPlayer,
  BasePlayer,
  Player,
  Season,
  Seasons,
  BaseTeam,
  Team,
  RatingsStats,
  StatModifiers,
  FullPlayer,
  TeamName,
  PlayerURL,
} from '@/types.ts'
import { computed, inject, type Ref, ref } from 'vue'
import { INITIAL_STAT_MODIFIERS } from '@/constants.ts'
import { getAverageStatsForPlayers, isForward } from '@/util.ts'

export const usePlayersStore = defineStore(
  'players', () => {
    const statModifiers: Ref<StatModifiers> = inject('statModifiers') ?? ref(INITIAL_STAT_MODIFIERS)

    const rawPlayers: Ref<Seasons> = ref<Seasons>({});
    const loading: Ref<boolean> = ref(false)
    const dreamTeams: Ref<{[key: Season]: DreamTeam}> = ref<{ [key: Season]: DreamTeam }>({})
    const challengeCups = ref<{ [key: Season]: {team: TeamName, lance_todd: PlayerURL|PlayerURL[]}}>({})

    const adjustedTries = (player: BasePlayer, proportionDownTable: number) =>
      Math.pow(
        Math.max(player.stats.tries / 10, 1),
        (1 + proportionDownTable) * (isForward(player) ? statModifiers.value.forwardTries : 1),
      )

    const _initSeasons = computed<{ [key: Season]: Team[]}>(() => {
      // Create a value to return
      const returnVal: Record<Season, Team[]> = {}

      // Take the players we get from JSON
      Object.entries(rawPlayers.value).forEach(function ([season, teams]) {
        const seasonNumber = parseInt(season) as Season
        const dreamTeamOfSeason: DreamTeam = dreamTeams.value[seasonNumber] ?? {}

        const challengeCup = challengeCups.value[seasonNumber];
        const _lanceTodd = challengeCup?.lance_todd ?? [];
        const lanceTodd = Array.isArray(_lanceTodd) ? _lanceTodd : [_lanceTodd];

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
              const isDreamTeam = !!dreamTeamPlayer
              const isMoS = dreamTeamPlayer?.mos ?? false
              const isLanceTodd = lanceTodd.includes(player.url);
              const proportionDownTable = team.finish / teams.length
              const benches = player.stats.appearances - player.stats.starts;
              const seasonAverage = getAverageStatsForPlayers(teams.flatMap(({ players }) => players).filter((p) => p.positions[0] === player.positions[0]))
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
                adjustedDownTable: ((isMoS ? 100 : isDreamTeam ? 25 : 0) + (isLanceTodd ? 25 : 0)) * Math.pow(1 + proportionDownTable, statModifiers.value.downTable),
              }

              const ratingsSum = Object.values(ratings).reduce((a, b) => a + b, 0);

              return {
                ...player,
                dreamTeam: isDreamTeam,
                mos: isMoS,
                lanceTodd: isLanceTodd,
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

    const seasons = computed<{ [key: Season]: Team[] }>(() => {
      const returnVal: { [key: Season]: Team[] } = {}
      const bestRating = Object.values(_initSeasons.value).flatMap((teams: Team[]) => Object.values(teams).flatMap((team) => team.players)).reduce((prev, curr) => Math.max(prev, curr.rating), 0);
      const worstRating = Object.values(_initSeasons.value)
        .flatMap((teams: Team[]) => Object.values(teams).flatMap((team) => team.players))
        .reduce((prev, curr) => Math.min(prev, curr.rating), Number.MAX_SAFE_INTEGER)
      Object.entries(_initSeasons.value).forEach(([season, teams]: [string, Team[]]) => {
        const startingScore: number = 50;
        const multiplier: number = 100 - startingScore;
        const ratingDiff: number = bestRating - worstRating;
        returnVal[parseInt(season) as Season] = teams.map((team: Team) => ({
          ...team,
          players: team.players.map(
            (player: FullPlayer): FullPlayer => {
              const overWorst = player.rating - worstRating
              const proportion = overWorst / ratingDiff
              return {
                ...player,
                rating: startingScore + (Math.pow(proportion, 1/10) * multiplier)
              }
            },
          ),
        }))
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


    fetch('./data.json')
      .then(response => response.json())
      .then(data => rawPlayers.value = data)

    fetch('./dream-teams.json')
      .then(response => response.json())
      .then(data => dreamTeams.value = data)

    fetch('./challenge-cups.json')
      .then(response => response.json())
      .then(data => challengeCups.value = data)


    return {
      seasons,
      allPlayers,
      bestAndWorst,
      dreamTeams,
      challengeCups,
      loading,
    }
});
