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
  lanceTodd: boolean
}

export type RatedPlayer = BasePlayer & {
  rating: number
}

export type Player = RatedPlayer & {
  dreamTeam: boolean
  mos: boolean
  lanceTodd: boolean
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
  challengeCup: boolean
  players: FullPlayer[]
}

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

export type StatModifiers = {
  downTable: number
  forwardTries: number
  baseRate: number
  forwardPoints: number
  logVal: number
}

export type ChosenTeam = {
  fullback: FullPlayer|null,
  right_wing: FullPlayer|null,
  right_centre: FullPlayer|null,
  left_centre: FullPlayer|null,
  left_wing: FullPlayer|null,
  stand_off: FullPlayer|null,
  scrum_half: FullPlayer|null,
  right_prop: FullPlayer|null,
  hooker: FullPlayer|null,
  left_prop: FullPlayer|null,
  right_second_rower: FullPlayer|null,
  left_second_rower: FullPlayer|null,
  loose_forward: FullPlayer|null,
}
