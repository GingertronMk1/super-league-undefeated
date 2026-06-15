import type { StatModifiers } from '@/types.ts'

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

export const INITIAL_STAT_MODIFIERS: StatModifiers = {
  downTable: 4.3,
  forwardTries: 6,
  forwardPoints: 1.08,
  baseRate: 50,
  logVal: 4,
} as const;

export const GAME_STATE = {
  CHOOSING_TEAM: 'CHOOSING_TEAM',
  CHOOSING_PLAYER: 'CHOOSING_PLAYER',
  PLAYING_GAME: 'PLAYING_GAME',
} as const
