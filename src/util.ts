import type {
  Accolade,
  Accolades,
  FullPlayer,
  Player,
  Position,
  PositionList,
  Statistics,
  Team,
} from '@/types.ts'
import { ACCOLADE_VALUES, POSITION_ENUM } from '@/constants.ts'


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

export function sortByLastName(a: { name: string }, b: { name: string }): number {
  const aSplit = a.name.split(' ');
  const bSplit = b.name.split(' ');
  const aLastName = aSplit[aSplit.length - 1];
  const bLastName = bSplit[bSplit.length - 1];
  if (aLastName === undefined && bLastName === undefined) {
    return 0;
  }
  if (aLastName === undefined) {
    return 1;
  }
  if (bLastName === undefined) {
    return -1;
  }
  return aLastName.localeCompare(bLastName);
}

export function prettyPrintAccolade(accolade: Accolade): string {
  switch(accolade) {
    case 'dreamTeam':
      return 'Dream Team';
    case 'mos':
      return 'Man of Steel';
    case 'lanceTodd':
      return 'Lance Todd';
    case 'youngPlayerOfTheYear':
      return 'Young Player of the Year';
  }
}

export function prettyPrintAccolades(accolades: Accolades): string {
  return accoladesPlayerHas(accolades)
    .map(prettyPrintAccolade)
    .join(', ');
}

export function accoladesPlayerHas(accolades: Accolades): Accolade[] {
  return Object
    .entries(accolades)
    .filter(([_, v]) => v)
    .map(([k, _]) => k as Accolade)
    .sort((a: Accolade, b: Accolade) => ACCOLADE_VALUES[b] - ACCOLADE_VALUES[a])
    ;
}
