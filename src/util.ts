import { type BasePlayer, type Position, POSITION_ENUM, type BaseTeam, type BasePlayerWithAccolades } from '@/types.ts'

export function getPlayerRating(player: BasePlayerWithAccolades, team: BaseTeam, teamsInSeason: number) {
  const BASE_RATE: number = 50;
  return [
      BASE_RATE - (team.finish / teamsInSeason) * BASE_RATE,
      team.finish === 1 ? 10 : 0,
      team.champions ? 25 : 0,
      player.stats.appearances,
      player.stats.tries,
      player.stats.points / 10,
      player.mos ? 50 : player.dreamTeam ? 25 : 0,
      ].reduce((a, b) => a + b, 0)
}



export function prettyPrintPositions(player: BasePlayer): string {
 return player.positions.map((pos: Position) => POSITION_ENUM[pos]).join(', ')
}
