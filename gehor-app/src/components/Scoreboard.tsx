import { colorHex, type Player } from '../lib/types'

export function Scoreboard({ players, highlight }: { players: Player[]; highlight?: string }) {
  const teams = players.filter((p) => p.role === 'team').sort((a, b) => b.score - a.score)
  if (teams.length === 0) return <p className="muted">Ingen lag ennå. Be lagene skanne boksen.</p>
  return (
    <ol className="scoreboard">
      {teams.map((t) => (
        <li
          key={t.id}
          className={t.id === highlight ? 'me' : undefined}
          style={{ '--team': colorHex(t.color) } as React.CSSProperties}
        >
          <span className="dot" />
          <span className="name">{t.name}</span>
          <span className="score">{t.score}</span>
        </li>
      ))}
    </ol>
  )
}
