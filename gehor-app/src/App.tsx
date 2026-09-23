import { useEffect, useState } from 'react'
import { configured, ensureSignedIn, supabase } from './lib/supabase'
import { api, errorText } from './lib/api'
import { syncClock } from './lib/clock'
import type { Peek, Player } from './lib/types'
import { Scanner } from './components/Scanner'
import { Mark } from './components/Mark'
import { JoinScreen } from './screens/JoinScreen'
import { GameScreen } from './screens/GameScreen'

type Screen =
  | { name: 'starting' }
  | { name: 'home' }
  | { name: 'scanBox' }
  | { name: 'join'; code: string; peek: Peek }
  | { name: 'game'; sessionId: string }

const CURRENT = 'gehor.session'

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'starting' })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Oppstart: logg inn anonymt og fortsett i økten vi var i, hvis den lever.
  useEffect(() => {
    if (!configured) return
    ;(async () => {
      try {
        await ensureSignedIn()
        await syncClock()
        const saved = localStorage.getItem(CURRENT)
        if (saved) {
          // RLS gir bare treff hvis vi er med i økten.
          const { data } = await supabase
            .from('sessions')
            .select('id')
            .eq('id', saved)
            .is('ended_at', null)
            .maybeSingle()
          if (data) return setScreen({ name: 'game', sessionId: saved })
          localStorage.removeItem(CURRENT)
        }
        setScreen({ name: 'home' })
      } catch (e) {
        setError(errorText(e))
        setScreen({ name: 'home' })
      }
    })()
  }, [])

  const enterGame = (me: Player) => {
    localStorage.setItem(CURRENT, me.session_id)
    setScreen({ name: 'game', sessionId: me.session_id })
  }

  const onBoxScanned = async (code: string) => {
    setBusy(true)
    setError(null)
    try {
      await ensureSignedIn()
      const peek = await api.peekBox(code)
      if (peek.me) enterGame(peek.me)
      else setScreen({ name: 'join', code, peek })
    } catch (e) {
      setError(errorText(e))
      setScreen({ name: 'home' })
    } finally {
      setBusy(false)
    }
  }

  const leave = () => {
    localStorage.removeItem(CURRENT)
    setScreen({ name: 'home' })
  }

  if (!configured) {
    return (
      <main className="page center">
        <Mark size={64} />
        <h1>Gehør</h1>
        <p className="error">
          Mangler Supabase-oppsett. Kopier <code>.env.example</code> til <code>.env.local</code> og fyll inn.
        </p>
      </main>
    )
  }

  switch (screen.name) {
    case 'starting':
      return <main className="page center"><Mark size={64} /></main>
    case 'scanBox':
      return (
        <Scanner
          expect="box"
          title="Skann koden inni boksen"
          onResult={onBoxScanned}
          onCancel={() => setScreen({ name: 'home' })}
        />
      )
    case 'join':
      return <JoinScreen code={screen.code} peek={screen.peek} onJoined={enterGame} onCancel={leave} />
    case 'game':
      return <GameScreen sessionId={screen.sessionId} onLeave={leave} />
    case 'home':
      return (
        <main className="page center home">
          <Mark size={88} />
          <h1>Gehør</h1>
          <p className="lede">Ordet gjemmer seg i låta.</p>
          <button className="primary big" disabled={busy} onClick={() => setScreen({ name: 'scanBox' })}>
            {busy ? 'Kobler til …' : 'Skann boksen'}
          </button>
          {error && <p className="error">{error}</p>}
          <ol className="steps">
            <li>Game master skanner koden inni boksen.</li>
            <li>Hvert lag skanner den samme koden og får en buzzer.</li>
            <li>Game master skanner brettet, og dere er i gang.</li>
          </ol>
        </main>
      )
  }
}
