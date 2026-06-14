import type { POSITION_ENUM } from '@/constants.ts'

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

export type BasePlayerWithAccolades = BasePlayer & {
  dreamTeam: boolean
  mos: boolean
}

export type RatedPlayer = BasePlayer & {
  rating: number
}

export type Player = RatedPlayer & {
  dreamTeam: boolean
  mos: boolean
  ratings: RatingsStats
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
  players: Player[]
}

export type DreamTeamPlayer = {
  name: PlayerName
  url: PlayerURL
  mos: boolean
}
export type FullPlayer = Player & { season: Season; team: string; }

export type RatingsStats = {
  baseRate: number,
  finish: number,
  champions: number,
  starts: number,
  adjustedTries: number,
  adjustedDownTable: number,
}

export type DreamTeam = { [key: PlayerURL]: DreamTeamPlayer }

export type Seasons = Record<Season, BaseTeam[]>

export type StatModifiers = {
  downTable: number
  forwardTries: number
  baseRate: number
  forwardPoints: number
  logVal: number
}
