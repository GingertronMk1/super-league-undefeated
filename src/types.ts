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
  season?: Season;
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


export type PlayerToChoose = Omit<FullPlayer, 'positions'> & { positions: (keyof ChosenTeam)[]
  displayPositions: Position[]
}

export type TeamToChoose = Omit<Team, 'players'> & {
  players: PlayerToChoose[]
}


export type ChosenTeam = {
  fullback: PlayerToChoose|null,
  right_wing: PlayerToChoose|null,
  right_centre: PlayerToChoose|null,
  left_centre: PlayerToChoose|null,
  left_wing: PlayerToChoose|null,
  stand_off: PlayerToChoose|null,
  scrum_half: PlayerToChoose|null,
  right_prop: PlayerToChoose|null,
  hooker: PlayerToChoose|null,
  left_prop: PlayerToChoose|null,
  right_second_rower: PlayerToChoose|null,
  left_second_rower: PlayerToChoose|null,
  loose_forward: PlayerToChoose|null,
}
