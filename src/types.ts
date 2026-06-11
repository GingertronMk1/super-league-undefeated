export const POSITION_ENUM = {
  FB: 'Fullback',
  W: 'Wing',
  C: 'Centre',
  FE: 'Stand-Off',
  HB: 'Scrum-Half',
  FR: 'Prop',
  H: 'Hooker',
  '2R': 'Second Rower',
  L: 'Loose Forward',
} as const;

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
export type Player = {
  url: string
  name: PlayerName
  positions: Position[]
  stats: Statistics
}

export type RatedPlayer = Player & {
  rating: number
}

export type Team = {
  name: TeamName,
  finish: number,
  champions: boolean,
  players: Player[],
}

export type Seasons = Record<Season, Team[]>;

