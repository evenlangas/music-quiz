import { useEffect, useState } from 'react'
import { api, errorText } from '../lib/api'
import { parseTs, serverNow } from '../lib/clock'
import { useServerNow } from '../lib/useNow'
import { colorHex, type Player, type Session } from '../lib/types'
import type { SessionState } from '../lib/useSession'
import { Scoreboard } from '../components/Scoreboard'

type Props = SessionState & { session: Session; me: Player }

const OWN_LOCK_MS = 8000

export function TeamView({ session, me, players, categories }: Props) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Svaret på eget trykk kommer før Realtime-oppdateringen. Bruk det med en
  // gang, og slipp det når raden vår oppdateres.
  const [ownLock, setOwnLock] = useState(0)
  useEffect(() => setOwnLock(0), [me.locked_until])

  const lockedUntil = Math.max(parseTs(me.locked_until), ownLock)
  const now = useServerNow(lockedUntil > serverNow() || pending)
  const remaining = Math.max(0, lockedUntil - now)
  const locked = remaining > 0

  const lastBuzzer = players.find((p) => p.id === session.last_buzz_player_id)
  const recentBuzz = session.last_buzz_at && now - parseTs(session.last_buzz_at) < OWN_LOCK_MS
  const iBuzzed = lastBuzzer?.id === me.id || ownLock > 0

  const category = categories.find((c) => c.id === session.current_category_id)

  const buzz = async () => {
    if (locked || pending) return
    navigator.vibrate?.(60)
    setPending(true)
    setError(null)
    try {
      const res = await api.buzz(session.id)
      setOwnLock(parseTs(res.locked_until))
    } catch (e) {
      setError(errorText(e))
    } finally {
      setPending(false)
    }
  }

  let label = 'Buzz'
  let sub = 'Trykk når dere vet svaret'
  if (pending) {
    label = '…'
    sub = ''
  } else if (locked) {
    label = String(Math.ceil(remaining / 1000))
    sub = iBuzzed ? 'Dere buzzet. Vent før dere kan prøve igjen.' : `${lastBuzzer?.name ?? 'Et annet lag'} buzzet`
  }

  // Ringen teller ned fra 8 (eget trykk) eller 4 sekunder (andres trykk).
  const total = iBuzzed ? OWN_LOCK_MS : 4000
  const progress = locked ? Math.min(1, remaining / total) : 0

  return (
    <main className="page team" style={{ '--team': colorHex(me.color) } as React.CSSProperties}>
      <header className="team-head">
        <span className="dot" />
        <h1>{me.name}</h1>
        <span className="score">{me.score} p</span>
      </header>

      <p className="now-playing">
        {category && session.current_difficulty ? (
          <>
            Spiller nå: <strong>{category.name}</strong> for {session.current_difficulty} poeng
          </>
        ) : session.board_id ? (
          'Venter på neste sang'
        ) : (
          'Venter på at game master skanner brettet'
        )}
      </p>

      <button
        className={'buzzer' + (locked ? ' locked' : '') + (pending ? ' pending' : '')}
        onPointerDown={buzz}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && buzz()}
        aria-disabled={locked}
        style={{ '--progress': progress } as React.CSSProperties}
      >
        <span className="buzzer-label">{label}</span>
      </button>
      <p className="buzzer-sub">{sub}</p>
      {!locked && recentBuzz && lastBuzzer && !iBuzzed && (
        <p className="muted">{lastBuzzer.name} buzzet sist</p>
      )}
      {error && <p className="error">{error}</p>}

      <Scoreboard players={players} highlight={me.id} />
    </main>
  )
}
