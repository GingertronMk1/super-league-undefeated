import { type BasePlayer, type Position, type BaseTeam, type BasePlayerWithAccolades, type Season, type Team,
  type DreamTeam, type Statistics
} from '@/types.ts'
import { POSITION_ENUM } from '@/constants.ts'
import { computed, inject, ref, type Ref } from 'vue'

const downTableModifier = inject<Ref<number>>('downTableModifier') ?? ref(1)

export const isForward = (player: BasePlayer) => ['FR', '2R', 'H', 'L'].includes(player.positions[0] ?? '');

export function getPlayerRating(player: BasePlayerWithAccolades, team: BaseTeam, teamsInSeason: number) {
  const BASE_RATE: number = 50;
  const proportionDownTable = team.finish / teamsInSeason;
  const teamSuccessStats = [
    BASE_RATE - proportionDownTable * BASE_RATE,
    team.finish === 1 ? 15 : 0,
    team.champions ? 25 : 0,
  ]
  const individualSuccessStats = [
    player.stats.starts / 10,
    isForward(player) ? player.stats.tries : player.stats.tries / 3,
    isForward(player) ? player.stats.points / 2.5 : player.stats.points / 5,
    (player.mos ? 50 : player.dreamTeam ? 25 : 0) * (1 + proportionDownTable)^(downTableModifier.value)
  ]
  return [
    ...teamSuccessStats,
    ...individualSuccessStats,
    ].reduce((a, b) => a + b, 0)
}


export function getAverageStatsForPlayers(players: { stats: Statistics }[]): Statistics {
  const averageStat = (statistic: keyof Statistics) =>
    players.map(({ stats }) => stats[statistic]).reduce((prev: number, curr: number) => prev + curr, 0) /
    players.length
  return {
    appearances: averageStat('appearances'),
    field_goals: averageStat('field_goals'),
    goals: averageStat('goals'),
    interchanges: averageStat('interchanges'),
    points: averageStat('points'),
    send_offs: averageStat('send_offs'),
    sin_bins: averageStat('sin_bins'),
    starts: averageStat('starts'),
    tries: averageStat('tries'),
  }
}




export function prettyPrintPositions(positions: Position[]): string {
 return positions.map((pos: Position): string => POSITION_ENUM[pos]).join(', ')
}
