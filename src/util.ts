import  type {  BasePlayer,  Position,  Statistics } from '@/types.ts'
import { POSITION_ENUM } from '@/constants.ts'

export const isForward = (player: BasePlayer) => ['FR', '2R', 'H', 'L'].includes(player.positions[0] ?? '');

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


export function prettyPrintPosition(position: Position): string {
  return POSITION_ENUM[position];
}


export function prettyPrintPositions(positions: Position[]): string {
 return positions.map(prettyPrintPosition).join(', ')
}
