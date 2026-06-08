export type Season = number
export type TeamName = string
export type PlayerName = string
export type PlayerURL = string
export type Position = string
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

export type Seasons = Record<Season, Record<TeamName, Record<PlayerURL, Player>>>;
