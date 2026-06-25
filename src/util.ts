import type {
  Accolade,
  Accolades, ChosenTeam, ChosenTeamPosition,
  FullPlayer,
  Player,
  Position,
  PositionList,
  Statistics,
  Team,
} from '@/types.ts'
import {
  ACCOLADE_VALUES,
  APPLIED_ALIASES,
  CHOSEN_TEAM_ORDER,
  DOUBLED_UP_POSITIONS,
  POSITION_ENUM,
} from '@/constants.ts'

export const getMostFrequentPosition = (l: PositionList): Position => Object.entries(l).reduce(
  ([
    accPos,
    accNum,
  ], [
    currPos,
    currNum,
  ]) => (currNum > accNum
    ? [currPos,
        currNum]
    : [accPos,
        accNum]),
  [
    '',
    0,
  ],
)[0] as Position

export const isForward = (player: FullPlayer) => [
  'FR',
  '2R',
  'H',
  'L',
].includes(getMostFrequentPosition(player.positions) ?? '')

export function getAverageStatsForPlayers(players: { stats: Statistics }[]): Statistics {
  const averageStat = (statistic: keyof Statistics) => players.map(({ stats }) => stats[statistic]).reduce(
    (prev: number, curr: number) => prev + curr,
    0,
  )
  / players.length
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

export function getBestThirteen(team: Team): Player[] {
  const sortedPlayers = team.players.sort((a, b) => b.rating - a.rating)
  return sortedPlayers.slice(
    0,
    13,
  )
}

export function prettyPrintPosition(position: Position): string {
  return POSITION_ENUM[position]
}

export function prettyPrintPositions(positions: Position[]): string {
  return positions.map(prettyPrintPosition).join(', ')
}

export function sortByLastName(a: { name: string }, b: { name: string }): number {
  const aSplit = a.name.split(' ')
  const bSplit = b.name.split(' ')
  const aLastName = aSplit[aSplit.length - 1]
  const bLastName = bSplit[bSplit.length - 1]
  if (aLastName === undefined && bLastName === undefined) {
    return 0
  }
  if (aLastName === undefined) {
    return 1
  }
  if (bLastName === undefined) {
    return -1
  }
  return aLastName.localeCompare(bLastName)
}

export function prettyPrintAccolade(accolade: Accolade): string {
  switch (accolade) {
    case 'dreamTeam':
      return 'Dream Team'
    case 'mos':
      return 'Man of Steel'
    case 'lanceTodd':
      return 'Lance Todd'
    case 'youngPlayerOfTheYear':
      return 'Young Player of the Year'
  }
}

export function prettyPrintAccolades(accolades: Accolades): string {
  return accoladesPlayerHas(accolades)
    .map(prettyPrintAccolade)
    .join(', ')
}

export function accoladesPlayerHas(accolades: Accolades): Accolade[] {
  return Object
    .entries(accolades)
    .filter(([
      _,
      v,
    ]) => v)
    .map(([
      k,
      _,
    ]) => k as Accolade)
    .sort((a: Accolade, b: Accolade) => ACCOLADE_VALUES[b] - ACCOLADE_VALUES[a])
}

export function displayPositionToTeamPositions(position: Position): ChosenTeamPosition[] {
  switch (position) {
    case 'FB':
      return ['fullback']
    case 'W':
      return [
        'right_wing',
        'left_wing',
      ]
    case 'C':
      return [
        'right_centre',
        'left_centre',
      ]
    case 'FE':
      return ['stand_off']
    case 'HB':
      return ['scrum_half']
    case 'FR':
      return [
        'right_prop',
        'left_prop',
      ]
    case '2R':
      return [
        'right_second_row',
        'left_second_row',
      ]
    case 'H':
      return ['hooker']
    case 'L':
      return ['loose_forward']
    default:
      throw new Error('Invalid position')
  }
}

export const convertDoubledPosition = (position: ChosenTeamPosition): Position | false => {
  for (const [
    positionKey,
    positionValues,
  ] of Object.entries(DOUBLED_UP_POSITIONS)) {
    if (positionValues.includes(position)) {
      return positionKey as Position
    }
  }
  return false
}

export const convertDoubledPositions = (positions: ChosenTeamPosition[]): Position[] => [...new Set(positions.map(convertDoubledPosition).filter(p => p !== false))]

export function sortChosenTeam<T>(team: ChosenTeam<T>): (T | null)[] {
  const ret: (T | null)[] = []
  CHOSEN_TEAM_ORDER.forEach((position: ChosenTeamPosition) => {
    team[position]
      ? ret.push(team[position])
      : ret.push(null)
  })
  return ret
}

export function generateBestPossibleTeam(players: FullPlayer[]): FullPlayer[] {
  const ret: ChosenTeam<FullPlayer> = {
    fullback: null,
    right_wing: null,
    right_centre: null,
    left_centre: null,
    left_wing: null,
    stand_off: null,
    scrum_half: null,
    right_prop: null,
    hooker: null,
    left_prop: null,
    right_second_row: null,
    left_second_row: null,
    loose_forward: null,
  }
  const sortedPlayers = players.sort((a, b) => b.rating - a.rating)
  sortedPlayers.forEach((player) => {
    const convertedPosition = Object.keys(player.positions).map(p => displayPositionToTeamPositions(p as Position))
    for (const positions of convertedPosition) {
      for (const position of positions) {
        if (ret[position] === null) {
          ret[position] = player
          return
        }
      }
    }
  })
  return sortChosenTeam(ret).filter(p => p !== null)
}
export function sortByPredicate<T>(
  a: T,
  b: T,
  predicate: (arg0: T) => boolean,
  fallback: (arg0: T, arg1: T) => number,
): number {
  const aPredicate = predicate(a)
  const bPredicate = predicate(b)
  if (aPredicate && !bPredicate) {
    return 1
  } else if (!aPredicate && bPredicate) {
    return -1
  } else {
    return fallback(a, b)
  }
}

