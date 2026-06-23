import type {
  FullPlayer,
  Player,
  Position,
  PositionList,
  Statistics,
  Team,
} from '@/types.ts'
import { POSITION_ENUM } from '@/constants.ts'


export const getMostFrequentPosition = (l: PositionList): Position =>
  Object.entries(l).reduce(
    ([accPos, accNum], [currPos, currNum]) =>
      currNum > accNum ? [currPos, currNum] : [accPos, accNum],
    ['', 0],
  )[0] as Position

export const isForward = (player: FullPlayer) => ['FR', '2R', 'H', 'L'].includes(getMostFrequentPosition(player.positions) ?? '');

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

export function getBestThirteen(team: Team): Player[]
{
  const sortedPlayers = team.players.sort((a, b) => b.rating - a.rating);
  return sortedPlayers.slice(0, 13);
}


export function prettyPrintPosition(position: Position): string {
  return POSITION_ENUM[position];
}


export function prettyPrintPositions(positions: Position[]): string {
 return positions.map(prettyPrintPosition).join(', ')
}
