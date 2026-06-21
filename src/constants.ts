import type { ChosenTeam, Position } from '@/types.ts'

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

export const DOUBLED_UP_POSITIONS: Record<Position, (keyof ChosenTeam)[]> = {
  FB: ['fullback'], FE: ['stand_off'], H: ['hooker'], HB: ['scrum_half'], L: ['loose_forward'],
  'C': ['left_centre', 'right_centre'],
  'W': ['left_wing', 'right_wing'],
  'FR': ['left_prop', 'right_prop'],
  '2R': ['left_second_row', 'right_second_row']
}
