import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/useSession'
import { GmView } from './GmView'
import { TeamView } from './TeamView'
import { Mark } from '../components/Mark'

type Props = { sessionId: string; onLeave: () => void }

export function GameScreen({ sessionId, onLeave }: Props) {
  const state = useSession(sessionId)
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUid(data.session?.user.id ?? null))
  }, [])

  const me = state.players.find((p) => p.user_id === uid)

  if (state.loading || !uid) {
    return <main className="page center"><Mark size={64} /></main>
  }

  if (!state.session || state.session.ended_at || !me) {
    return (
      <main className="page center">
        <Mark size={64} />
        <h1>Økten er over</h1>
        <p className="muted">Skann boksen på nytt for å starte en ny.</p>
        <button className="primary big" onClick={onLeave}>
          Til start
        </button>
      </main>
    )
  }

  return me.role === 'gm' ? <GmView {...state} session={state.session} me={me} /> : <TeamView {...state} session={state.session} me={me} />
}
