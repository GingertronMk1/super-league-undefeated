import { defineStore } from 'pinia';
import type {
  DreamTeam,
  DreamTeamPlayer,
  BasePlayer,
  Season,
  Seasons,
  BaseTeam,
  Team,
  RatingsStats,
  FullPlayer,
  PlayerURL,
  TeamName, Position, Statistics,
} from '@/types.ts';
import { computed, type Ref, ref } from 'vue';
import { ACCOLADE_VALUES, POSITION_ENUM } from '@/constants.ts';
import { accoladesPlayerHas, getAverageStatsForPlayers} from '@/util.ts';
import useAncillaryData from '@/composables/useAncillaryData.ts';
import useStatisticalMethods from '@/composables/useStatisticalMethods.ts';

export const usePlayersStore = defineStore(
  'players',
  () => {
    const rawPlayers: Ref<Seasons> = ref<Seasons>({});
    const loading = computed(() => Object.keys(seasons.value).length === 0);
    const { dreamTeams, challengeCups, youngPlayersOfTheYear } = useAncillaryData();
    const { quantile } = useStatisticalMethods();

    const _initSeasons = computed<Record<Season, Team[]>>(() => {
      // Create a value to return
      const returnVal: Record<Season, Team[]> = {};

      // Take the players we get from JSON
      Object.entries(rawPlayers.value).forEach(function ([
        season,
        teams,
      ]) {
        const seasonNumber = parseInt(season) as Season;
        const dreamTeamOfSeason: DreamTeam = dreamTeams[seasonNumber as Season] ?? {};

        const challengeCup = challengeCups[seasonNumber];
        const _lanceTodd = challengeCup?.lance_todd ?? [];
        const lanceTodd = Array.isArray(_lanceTodd)
          ? _lanceTodd
          : [_lanceTodd];
        const youngPlayerOfTheYear: PlayerURL | undefined = youngPlayersOfTheYear[seasonNumber as Season];

        /*
         * Convert the players into the accoladed, rated versions
         * By cross-referencing the dream teams JSON file
         */
        returnVal[seasonNumber] = teams.map((team: BaseTeam): Team => {
          const teamChallengeCup = challengeCup?.team === team.name;
          const allBasePlayers = teams.flatMap(({ players }) => players);
          const averageStatsPerPosition: Record<Position, Statistics|undefined> = {
            "2R": undefined,
            C: undefined,
            FB: undefined,
            FE: undefined,
            FR: undefined,
            H: undefined,
            HB: undefined,
            L: undefined,
            W: undefined

          };
          Object.keys(POSITION_ENUM).forEach((position: string) => {
            const positionAsPosition = position as Position;
            averageStatsPerPosition[positionAsPosition] = getAverageStatsForPlayers(allBasePlayers.filter(p => p.positions[0] === positionAsPosition));
          }
        );
          const seasonAsSeason = parseInt(season) as Season;
          return {
            ...team,
            challengeCup: teamChallengeCup,
            season: seasonAsSeason,
            players: team.players.map(function (player: BasePlayer): FullPlayer|false {
              const [firstPosition] = player.positions;
              if (!firstPosition) {
                return false;
              }
              const dreamTeamPlayer: DreamTeamPlayer | undefined = dreamTeamOfSeason[player.url];
              const isYoungPlayerOfTheYear: boolean = youngPlayerOfTheYear === player.url;
              const isDreamTeam = !!dreamTeamPlayer;
              const isMoS = dreamTeamPlayer?.mos ?? false;
              const isLanceTodd = lanceTodd.includes(player.url);
              const proportionDownTable = Math.pow(1 + (team.finish / teams.length), 3);
              const benches = player.stats.appearances - player.stats.starts;
              const seasonAverage = averageStatsPerPosition[firstPosition];
              if (!seasonAverage) {
                return false;
              }
              const accolades = {
                dreamTeam: isDreamTeam,
                mos: isMoS,
                lanceTodd: isLanceTodd,
                youngPlayerOfTheYear: isYoungPlayerOfTheYear,
              };
              const startsAverage = player.stats.starts / seasonAverage.starts;
              const ratings: RatingsStats = {
                baseRate: (1 - proportionDownTable) * (player.stats.appearances / seasonAverage.appearances),
                finish: team.finish === 1
                  ? 15
                  : 0,
                champions: team.champions
                  ? 25
                  : 0,
                challengeCup: teamChallengeCup
                  ? 20
                  : 0,
                starts: startsAverage,
                benches: benches / 20,
                adjustedPoints: proportionDownTable * startsAverage * (
                  player.stats.points / seasonAverage.points
                ),
                adjustedDownTable: accoladesPlayerHas(accolades)
                  .map(a => ACCOLADE_VALUES[a])
                  .reduce(
                    (a, b) => a + b,
                    0,
                  ) * proportionDownTable,
              };

              const ratingsSum = Object.values(ratings).reduce(
                (a, b) => a + b,
                0,
              );

              return {
                ...player,
                positions: player
                  .positions
                  .reduce(
                    (acc: Record<Position, number>, curr: Position): Record<Position, number> => {
                      acc[curr as Position] = (acc[curr as Position] ?? 0) + 1;
                      return acc;
                    },
                    {} as Record<Position, number>,
                  ),
                accolades: accolades,
                rating: ratingsSum,
                ratings,
                season: seasonAsSeason,
                team: team.name,
                team_finish: team.finish,
              };
            }).filter((p) => p !== false),
          };
        });
      });
      return returnVal;
    });

    const seasons = computed<Record<Season, Team[]>>(() => {
      const returnVal: Record<Season, Team[]> = {};
      const allRatings = Object.values(_initSeasons.value)
        .flatMap((teams: Team[]) => Object.values(teams).flatMap(team => team.players))
        .flatMap((player: FullPlayer) => player.rating)
        .sort((a, b) => a - b);
      if (allRatings.length === 0) {
        return returnVal;
      }
      const topCutoff = quantile(
        allRatings,
        99,
      );
      const bottomCutoff = quantile(
        allRatings,
        5
      );

      const worstRating = allRatings
        .reduce((curr, acc) => acc < curr ? acc : curr,
          Number.MAX_SAFE_INTEGER
        );
      const ratingDiff: number = topCutoff - bottomCutoff;
      const startingScore = 60;
      const multiplier: number = 100 - startingScore;
      Object.entries(_initSeasons.value).forEach(([
        season,
        teams]: [string, Team[],
      ]) => {
        let seasonTeams = teams.map((team: Team) => {
          const mostAppearancesForTeam = team.players.reduce((acc, curr) => curr.stats.appearances > acc ? curr.stats.appearances : acc, 0);
          return {
            ...team,
            players: team.players.map((player: FullPlayer): FullPlayer => {
              const boundedPlayerRating = Math.max(Math.min(topCutoff, player.rating), bottomCutoff);
              const appearanceModifier = Math.pow(player.stats.appearances / mostAppearancesForTeam, 1/4);
              const overWorst = boundedPlayerRating - bottomCutoff;
              const proportion = overWorst / ratingDiff;
              return {
                ...player,
                rating: (startingScore * appearanceModifier) + Math.pow(proportion, 1 / 2) * multiplier,
              };
            }),
          };
        });
        const appearancesPerTeam: Record<PlayerURL, Record<TeamName, number>> = {};
        seasonTeams.forEach(({ name, players }) => {
          players.forEach((p) => {
            const appearancesForTeam = { [name]: Object.values(p.positions).reduce(
              (acc, curr) => acc + curr,
              0,
            ) };
            appearancesPerTeam[p.url] = appearancesPerTeam[p.url]
              ? { ...appearancesPerTeam[p.url],
                  ...appearancesForTeam }
              : appearancesForTeam;
          });
        });
        // Removing players that appear in more than one team
        Object
          .entries(appearancesPerTeam)
          .filter(([
            _,
            appsPerTeam,
          ]) => Object.values(appsPerTeam).length > 1)
          .forEach(([
            playerURL,
            appsPerTeam,
          ]) => {
            const [mostAppsFor] = Object
              .entries(appsPerTeam)
              .reduce(
                ([
                  accTeam,
                  accApps,
                ], [
                  currTeam,
                  currApps,
                ]) => (currApps > accApps ? [currTeam, currApps] : [accTeam, accApps]),
                [
                  '',
                  0,
                ],
              );
            seasonTeams = seasonTeams.map(t => ({
              ...t,
              players: t.name === mostAppsFor
                ? t.players
                : t.players.filter(({ url }) => url !== playerURL),
            }));
          });
        returnVal[parseInt(season) as Season] = seasonTeams;
      });
      return returnVal;
    });

    const allPlayers = computed<FullPlayer[]>(() => {
      return Object.entries(seasons.value)
        .flatMap(([
          season,
          teams,
        ]) => Object.values(teams).flatMap(team => team.players.map(player => ({
          ...player,
          season: parseInt(season) as Season,
          team: team.name,
        }))))
        .sort((a: FullPlayer, b: FullPlayer) => {
          const ratingCompare = b.rating - a.rating;
          return ratingCompare === 0 ? b.team_finish - a.team_finish : ratingCompare;
        });
    });

    const bestAndWorst = computed<{ best: FullPlayer | null
      worst: FullPlayer | null }>(() => {
      return {
        best: allPlayers.value.reduce(
          (prev: FullPlayer | null, curr: FullPlayer) => prev === null
            ? curr
            : prev.rating < curr.rating
              ? curr
              : prev,
          null,
        ),
        worst: allPlayers.value.reduce(
          (prev: FullPlayer | null, curr: FullPlayer) => prev === null
            ? curr
            : prev.rating > curr.rating
              ? curr
              : prev,
          null,
        ),
      };
    });

    const allTeams = computed(() => {
      const ret: Record<TeamName, Record<Season, Team>> = {};
      for (const season in seasons.value) {
        for (const team of seasons.value[season] ?? []) {
          const teamSeason = { [parseInt(season) as Season]: team };
          ret[team.name]
            = ret[team.name] === undefined
              ? teamSeason
              : { ...ret[team.name],
                  ...teamSeason };
        }
      }
      return ret;
    });

    fetch('./data.json')
      .then(response => response.json())
      .then(data => rawPlayers.value = data);

    return {
      seasons,
      allTeams,
      allPlayers,
      bestAndWorst,
      dreamTeams,
      challengeCups,
      loading,
    };
  },
);
