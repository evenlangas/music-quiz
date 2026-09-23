import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Board, Category, Play, Player, Session } from './types'

export type SessionState = {
  session: Session | null
  players: Player[]
  plays: Play[]
  board: Board | null
  categories: Category[]
  loading: boolean
}

const EMPTY: SessionState = { session: null, players: [], plays: [], board: null, categories: [], loading: true }

function upsert<T>(list: T[], row: T, key: (t: T) => string) {
  const k = key(row)
  const i = list.findIndex((x) => key(x) === k)
  if (i === -1) return [...list, row]
  const next = list.slice()
  next[i] = row
  return next
}

// Alt en telefon trenger å vite om økten, holdt oppdatert med Supabase Realtime.
export function useSession(sessionId: string): SessionState & { reload: () => void } {
  const [state, setState] = useState<SessionState>(EMPTY)

  const reload = useCallback(async () => {
    const [s, p, pl] = await Promise.all([
      supabase.from('sessions').select('*').eq('id', sessionId).maybeSingle(),
      supabase.from('players').select('*').eq('session_id', sessionId).order('joined_at'),
      supabase.from('plays').select('*').eq('session_id', sessionId),
    ])
    setState((prev) => ({
      ...prev,
      session: s.data as Session | null,
      players: (p.data ?? []) as Player[],
      plays: (pl.data ?? []) as Play[],
      loading: false,
    }))
  }, [sessionId])

  // Brettet og kategoriene hentes når økten får et brett.
  const boardId = state.session?.board_id ?? null
  useEffect(() => {
    if (!boardId) {
      setState((prev) => ({ ...prev, board: null, categories: [] }))
      return
    }
    let stale = false
    Promise.all([
      supabase.from('boards').select('*').eq('id', boardId).single(),
      supabase.from('categories').select('*').eq('board_id', boardId).order('position'),
    ]).then(([b, c]) => {
      if (stale) return
      setState((prev) => ({ ...prev, board: b.data as Board, categories: (c.data ?? []) as Category[] }))
    })
    return () => {
      stale = true
    }
  }, [boardId])

  useEffect(() => {
    reload()
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (e) => {
        if (e.eventType !== 'DELETE') setState((prev) => ({ ...prev, session: e.new as Session }))
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` },
        (e) => {
          if (e.eventType === 'DELETE') {
            const id = (e.old as Player).id
            setState((prev) => ({ ...prev, players: prev.players.filter((p) => p.id !== id) }))
          } else {
            setState((prev) => ({ ...prev, players: upsert(prev.players, e.new as Player, (p) => p.id) }))
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'plays', filter: `session_id=eq.${sessionId}` },
        (e) => setState((prev) => ({ ...prev, plays: upsert(prev.plays, e.new as Play, (p) => p.song_id) })),
      )
      .subscribe((status) => {
        // Hent alt på nytt hver gang vi (gjen)kobler, så vi ikke går glipp av noe.
        if (status === 'SUBSCRIBED') reload()
      })

    // Telefoner som har ligget i dvale kan ha mistet hendelser.
    const onVisible = () => document.visibilityState === 'visible' && reload()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [sessionId, reload])

  return { ...state, reload }
}
