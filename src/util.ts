import { type BasePlayer, type Position, POSITION_ENUM, type BaseTeam, type BasePlayerWithAccolades } from '@/types.ts'

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
    (player.mos ? 50 : player.dreamTeam ? 25 : 0)
  ]
  return [
    ...teamSuccessStats,
    ...individualSuccessStats.map((stat) => stat * 1 * proportionDownTable),
    ].reduce((a, b) => a + b, 0)
}



export function prettyPrintPositions(player: BasePlayer): string {
 return player.positions.map((pos: Position): string => POSITION_ENUM[pos]).join(', ')
}
