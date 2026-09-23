export type Role = 'gm' | 'team'

export type Player = {
  id: string
  session_id: string
  user_id: string
  role: Role
  name: string
  color: TeamColor | null
  score: number
  locked_until: string
  joined_at: string
}

export type Session = {
  id: string
  board_id: string | null
  current_song_id: string | null
  current_category_id: string | null
  current_difficulty: number | null
  current_started_at: string | null
  last_buzz_player_id: string | null
  last_buzz_at: string | null
  ended_at: string | null
}

export type Play = {
  session_id: string
  song_id: string
  category_id: string
  difficulty: number
  awarded_player_id: string | null
}

export type Category = { id: string; board_id: string; position: number; name: string }
export type Board = { id: string; name: string; description: string | null }

export type Song = {
  id: string
  category_id: string
  difficulty: number
  title: string
  artist: string
  answer: string
  why: string | null
  spotify_uri: string | null
  start_ms: number
}

export type GmBoard = {
  id: string
  name: string
  categories: (Category & { songs: Song[] })[]
}

export type Peek = {
  session_id: string
  me: Player | null
  gm_taken: boolean
  teams: { name: string; color: TeamColor }[]
}

export const TEAM_COLORS = {
  rod: { label: 'Rød', hex: '#e3574a' },
  oransje: { label: 'Oransje', hex: '#f0843a' },
  gul: { label: 'Gul', hex: '#f2c94c' },
  gronn: { label: 'Grønn', hex: '#4cc38a' },
  bla: { label: 'Blå', hex: '#4c9cf2' },
  lilla: { label: 'Lilla', hex: '#a47cf8' },
} as const

export type TeamColor = keyof typeof TEAM_COLORS

export const colorHex = (c: TeamColor | null) => (c ? TEAM_COLORS[c].hex : '#8a93a5')
