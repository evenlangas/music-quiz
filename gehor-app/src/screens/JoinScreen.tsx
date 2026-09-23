import { useState } from 'react'
import { api, errorText } from '../lib/api'
import { TEAM_COLORS, type Peek, type Player, type TeamColor } from '../lib/types'

type Props = {
  code: string
  peek: Peek
  onJoined: (me: Player) => void
  onCancel: () => void
}

// Etter at boksen er skannet: bli game master (hvis ledig) eller lag.
export function JoinScreen({ code, peek, onJoined, onCancel }: Props) {
  const [mode, setMode] = useState<'choose' | 'team'>(peek.gm_taken ? 'team' : 'choose')
  const [name, setName] = useState('')
  const taken = new Set(peek.teams.map((t) => t.color))
  const firstFree = (Object.keys(TEAM_COLORS) as TeamColor[]).find((c) => !taken.has(c)) ?? null
  const [color, setColor] = useState<TeamColor | null>(firstFree)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const join = async (role: 'gm' | 'team') => {
    setBusy(true)
    setError(null)
    try {
      onJoined(await api.joinBox(code, role, name, color ?? undefined))
    } catch (e) {
      setError(errorText(e))
      setBusy(false)
    }
  }

  return (
    <main className="page join">
      <button className="ghost back" onClick={onCancel}>
        Avbryt
      </button>

      {peek.teams.length > 0 && (
        <section>
          <h3 className="eyebrow">Allerede med</h3>
          <ul className="chips">
            {peek.teams.map((t) => (
              <li key={t.color} style={{ '--team': TEAM_COLORS[t.color].hex } as React.CSSProperties}>
                {t.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {mode === 'choose' ? (
        <section className="roles">
          <h1>Hvem er du?</h1>
          <button className="role" disabled={busy} onClick={() => join('gm')}>
            <strong>Game master</strong>
            <span>Spiller sangene, ser fasiten og deler ut poeng.</span>
          </button>
          <button className="role" disabled={busy} onClick={() => setMode('team')}>
            <strong>Lag</strong>
            <span>Får en buzzer og gjetter.</span>
          </button>
        </section>
      ) : (
        <form
          className="team-form"
          onSubmit={(e) => {
            e.preventDefault()
            join('team')
          }}
        >
          <h1>Nytt lag</h1>
          {peek.gm_taken && <p className="muted">Game master er allerede valgt, så du blir med som lag.</p>}
          <label>
            Lagnavn
            <input value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="Ulvene" autoFocus />
          </label>
          <fieldset className="colors">
            <legend>Farge</legend>
            {(Object.keys(TEAM_COLORS) as TeamColor[]).map((c) => (
              <button
                key={c}
                type="button"
                className={'swatch' + (color === c ? ' picked' : '')}
                style={{ '--team': TEAM_COLORS[c].hex } as React.CSSProperties}
                disabled={taken.has(c)}
                aria-pressed={color === c}
                aria-label={TEAM_COLORS[c].label + (taken.has(c) ? ' (tatt)' : '')}
                onClick={() => setColor(c)}
              />
            ))}
          </fieldset>
          <button className="primary big" type="submit" disabled={busy || !name.trim() || !color}>
            Bli med
          </button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </main>
  )
}
