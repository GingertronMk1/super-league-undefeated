import { INITIAL_STAT_MODIFIERS, type POSITION_ENUM } from '@/constants.ts'

export type Season = number
export type TeamName = string
export type PlayerName = string
export type PlayerURL = string
export type Position = keyof typeof POSITION_ENUM
export type Statistics = {
  starts: number
  interchanges: number
  appearances: number
  tries: number
  goals: number
  field_goals: number
  points: number
  sin_bins: number
  send_offs: number
}
export type BasePlayer = {
  url: string
  name: PlayerName
  positions: Position[]
  stats: Statistics
}

export type RatedPlayer = BasePlayer & {
  rating: number
}

export type PositionList = Record<Position, number>;

export type Player = Omit<RatedPlayer, 'positions'> & {
  positions: Record<Position, number>
  ratings: RatingsStats
  accolades: Accolades
}

export type BaseTeam = {
  name: TeamName
  finish: number
  champions: boolean
  players: BasePlayer[]
}

export type Team = {
  name: TeamName
  finish: number
  champions: boolean
  challengeCup: boolean
  players: FullPlayer[]
  season?: Season;
}

export type Accolades = {
  dreamTeam: boolean
  mos: boolean
  lanceTodd: boolean
  youngPlayerOfTheYear: boolean
}

export type Accolade = keyof Accolades

export type DreamTeamPlayer = {
  url: PlayerURL
  mos: boolean
}
export type FullPlayer = Player & { season: Season; team: string; }

export type RatingsStats = {
  baseRate: number,
  finish: number,
  champions: number,
  challengeCup: number,
  starts: number,
  benches: number,
  adjustedTries: number,
  adjustedDownTable: number,
}

export type DreamTeam = { [key: PlayerURL]: DreamTeamPlayer }

export type Seasons = Record<Season, BaseTeam[]>

export type StatModifiers = typeof INITIAL_STAT_MODIFIERS;


export type PlayerToChoose = Omit<FullPlayer, 'positions'> & { positions: ChosenTeamPosition[]
  displayPositions: Position[]
}

export type TeamToChoose = Omit<Team, 'players'> & {
  players: PlayerToChoose[]
}


export type ChosenTeam<T> = {
  fullback: T|null,
  right_wing: T|null,
  right_centre: T|null,
  left_centre: T|null,
  left_wing: T|null,
  stand_off: T|null,
  scrum_half: T|null,
  right_prop: T|null,
  hooker: T|null,
  left_prop: T|null,
  right_second_row: T|null,
  left_second_row: T|null,
  loose_forward: T|null,
}
export type ChosenTeamPosition = keyof ChosenTeam<unknown>

export type TableTeam = {
  name: string
  rating: number
}

export type ResultsTeam = TableTeam & {
  wins: number;
  draws: number;
  losses: number;
  points: number ;
}

export type Playoffs = {
  eliminator1: Match
  eliminator1Winner: TableTeam
  eliminator2: Match
  eliminator2Winner: TableTeam
  semiFinal1: Match
  semiFinal1Winner: TableTeam
  semiFinal2: Match
  semiFinal2Winner: TableTeam
  grandFinal: Match
  grandFinalWinner: TableTeam
}

export type Match = {
  home: TeamName
  away: TeamName
  result: TeamName | 'draw'
}

