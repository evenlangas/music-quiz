import { supabase } from './supabase'
import type { GmBoard, Peek, Player, Role, TeamColor } from './types'

// Feilkodene fra databasefunksjonene, oversatt.
const MESSAGES: Record<string, string> = {
  ukjent_boks: 'Kjenner ikke igjen denne boksen.',
  ukjent_brett: 'Kjenner ikke igjen dette brettet.',
  gm_opptatt: 'Noen andre er allerede game master.',
  farge_opptatt: 'Den fargen er tatt. Velg en annen.',
  ugyldig_navn: 'Laget trenger et navn (maks 24 tegn).',
  ugyldig_farge: 'Velg en farge.',
  ikke_med: 'Du er ikke med i denne økten lenger.',
  ikke_gm: 'Bare game master kan gjøre det.',
  ikke_lag: 'Bare lag har buzzer.',
  okt_ferdig: 'Økten er avsluttet.',
  ingen_sang: 'Ingen sang spilles nå.',
  ukjent_lag: 'Fant ikke laget.',
  ugyldig_uri: 'Det ser ikke ut som en Spotify-lenke til en sang.',
  sang_ikke_paa_brettet: 'Sangen er ikke på dette brettet.',
}

export class ApiError extends Error {
  code: string
  constructor(code: string) {
    super(MESSAGES[code] ?? code)
    this.code = code
  }
}

async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw new ApiError(error.message)
  return data as T
}

export const api = {
  peekBox: (code: string) => rpc<Peek>('peek_box', { p_code: code }),
  joinBox: (code: string, role: Role, name?: string, color?: TeamColor) =>
    rpc<Player>('join_box', { p_code: code, p_role: role, p_name: name ?? null, p_color: color ?? null }),
  setBoard: (session: string, board: string) => rpc<void>('set_board', { p_session: session, p_board: board }),
  gmBoard: (session: string) => rpc<GmBoard | null>('gm_board', { p_session: session }),
  playSong: (session: string, song: string) => rpc<void>('play_song', { p_session: session, p_song: song }),
  finishSong: (session: string, player: string | null) =>
    rpc<void>('finish_song', { p_session: session, p_player: player }),
  setSongUri: (session: string, song: string, uri: string) =>
    rpc<void>('set_song_uri', { p_session: session, p_song: song, p_uri: uri }),
  endSession: (session: string) => rpc<void>('end_session', { p_session: session }),
  buzz: (session: string) =>
    rpc<{ ok: boolean; locked_until: string; now: string }>('buzz', { p_session: session }),
  serverNow: () => rpc<string>('server_now'),
}

export const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e))
