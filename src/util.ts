import type { Team } from '@/types.ts'

export function getRatedPlayers(team: Team, teamsInSeason: number) {
  const BASE_RATE: number = 50;
  return team.players.map(player => ({
    ...player,
    rating: [
      BASE_RATE - (team.finish / teamsInSeason) * BASE_RATE,
      team.finish === 1 ? 10 : 0,
      team.champions ? 25 : 0,
      player.stats.appearances,
      player.stats.tries,
      player.stats.points / 10,
      ].reduce((a, b) => a + b, 0),
  }))
}
