import type { ChosenTeam, ChosenTeamPosition, Position, Season, Team, TeamName } from '@/types.ts'
import { computed } from 'vue'

export const INJECTABLES = {
  STAT_MODIFIERS: 'STAT_MODIFIERS'
}
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

export const INITIAL_STAT_MODIFIERS = {
  downTable: 4.3,
  forwardTries: 6,
  forwardPoints: 1.08,
  baseRate: 50,
  logVal: 4,
  bias: 0.2
} as const;

export const GAME_STATE = {
  CHOOSING_TEAM: 'CHOOSING_TEAM',
  CHOOSING_PLAYER: 'CHOOSING_PLAYER',
  PLAYING_GAME: 'PLAYING_GAME',
} as const

export const DOUBLED_UP_POSITIONS: Record<Position, ChosenTeamPosition[]> = {
  FB: ['fullback'], FE: ['stand_off'], H: ['hooker'], HB: ['scrum_half'], L: ['loose_forward'],
  'C': ['left_centre', 'right_centre'],
  'W': ['left_wing', 'right_wing'],
  'FR': ['left_prop', 'right_prop'],
  '2R': ['left_second_row', 'right_second_row']
}
export const TEAMS = {
  BRADFORD: 'Bradford',
  CASTLEFORD: 'Castleford',
  CATALANS: 'Catalans',
  CELTIC: 'Celtic',
  GATESHEAD: 'Gateshead',
  HALIFAX: 'Halifax',
  HUDDERSFIELD: 'Huddersfield',
  HULL_FC: 'Hull FC',
  HULL_KR: 'Hull KR',
  LEEDS: 'Leeds',
  LEIGH: 'Leigh',
  LONDON: 'London',
  SALFORD: 'Salford',
  SHEFFIELD: 'Sheffield',
  ST_HELENS: 'St Helens',
  TOULOUSE: 'Toulouse',
  WAKEFIELD_TRINITY: 'Wakefield Trinity',
  WARRINGTON: 'Warrington',
  WIDNES: 'Widnes',
  WIGAN: 'Wigan',
} as const

export const APPLIED_ALIASES: { [key: TeamName]: TeamName } = {
  Bradford: TEAMS.BRADFORD,
  'Castleford Tigers': TEAMS.CASTLEFORD,
  Castleford: TEAMS.CASTLEFORD,
  'Catalans Dragons': TEAMS.CATALANS,
  Catalans: TEAMS.CATALANS,
  Celtic: TEAMS.CELTIC,
  Crusaders: TEAMS.CELTIC,
  Gateshead: TEAMS.GATESHEAD,
  Halifax: TEAMS.HALIFAX,
  Harlequins: TEAMS.LONDON,
  'Huddersfield Giants': TEAMS.HUDDERSFIELD,
  'Huddersfield Sheffield': TEAMS.HUDDERSFIELD,
  Huddersfield: TEAMS.HUDDERSFIELD,
  'Hull FC': TEAMS.HULL_FC,
  'Hull KR': TEAMS.HULL_KR,
  'Hull Kingston Rovers': TEAMS.HULL_KR,
  Hull: TEAMS.HULL_FC,
  'Leeds Rhinos': TEAMS.LEEDS,
  Leeds: TEAMS.LEEDS,
  'Leigh Centurions': TEAMS.LEIGH,
  Leigh: TEAMS.LEIGH,
  London: TEAMS.LONDON,
  'Salford Red Devils': TEAMS.SALFORD,
  Salford: TEAMS.SALFORD,
  Sheffield: TEAMS.SHEFFIELD,
  'St Helens': TEAMS.ST_HELENS,
  Toulouse: TEAMS.TOULOUSE,
  'Wakefield T.': TEAMS.WAKEFIELD_TRINITY,
  'Wakefield Trinity Wildcats': TEAMS.WAKEFIELD_TRINITY,
  'Wakefield Trinity': TEAMS.WAKEFIELD_TRINITY,
  'Warrington Wolves': TEAMS.WARRINGTON,
  Warrington: TEAMS.WARRINGTON,
  'Widnes Vikings': TEAMS.WIDNES,
  Widnes: TEAMS.WIDNES,
  'Wigan Warriors': TEAMS.WIGAN,
  Wigan: TEAMS.WIGAN,
}

