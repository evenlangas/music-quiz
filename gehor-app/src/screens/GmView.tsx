import { useCallback, useEffect, useState } from 'react'
import { api, errorText } from '../lib/api'
import { parseTs } from '../lib/clock'
import { useServerNow } from '../lib/useNow'
import { colorHex, type GmBoard, type Player, type Session, type Song } from '../lib/types'
import type { SessionState } from '../lib/useSession'
import { Scanner } from '../components/Scanner'
import { Scoreboard } from '../components/Scoreboard'
import { SpotifyEmbed, toTrackUri } from '../components/SpotifyEmbed'
import { Mark } from '../components/Mark'

type Props = SessionState & { session: Session; me: Player }

export function GmView({ session, players, plays }: Props) {
  const [board, setBoard] = useState<GmBoard | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const teams = players.filter((p) => p.role === 'team')

  const loadBoard = useCallback(() => {
    api.gmBoard(session.id).then(setBoard, (e) => setError(errorText(e)))
  }, [session.id])

  useEffect(() => {
    if (session.board_id) loadBoard()
    else setBoard(null)
  }, [session.board_id, loadBoard])

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (e) {
      setError(errorText(e))
    } finally {
      setBusy(false)
    }
  }

  if (scanning) {
    return (
      <Scanner
        expect="board"
        title="Skann koden på brettet"
        onCancel={() => setScanning(false)}
        onResult={(id) => {
          setScanning(false)
          run(() => api.setBoard(session.id, id))
        }}
      />
    )
  }

  const songs = board?.categories.flatMap((c) => c.songs.map((s) => ({ ...s, category: c.name }))) ?? []
  const current = songs.find((s) => s.id === session.current_song_id)
  const playedBy = new Map(plays.map((p) => [p.song_id, p.awarded_player_id]))

  return (
    <main className="page gm">
      <header className="gm-head">
        <Mark size={32} />
        <div>
          <p className="eyebrow">Game master</p>
          <h1>{board?.name ?? 'Ingen brett ennå'}</h1>
        </div>
      </header>

      <section>
        <h3 className="eyebrow">{teams.length === 1 ? '1 lag' : `${teams.length} lag`}</h3>
        <Scoreboard players={players} />
      </section>

      {!session.board_id && (
        <button className="primary big" onClick={() => setScanning(true)}>
          Skann brettet
        </button>
      )}

      {current && (
        <NowPlaying
          key={current.id}
          session={session}
          song={current}
          teams={teams}
          busy={busy}
          onAward={(playerId) => run(() => api.finishSong(session.id, playerId))}
          onSaveUri={(uri) => run(async () => {
            await api.setSongUri(session.id, current.id, uri)
            loadBoard()
          })}
        />
      )}

      {error && <p className="error">{error}</p>}

      {board && (
        <section className="grid">
          {board.categories.map((c) => (
            <div className="cat" key={c.id}>
              <h3>{c.name}</h3>
              <div className="cells">
                {c.songs.map((s) => {
                  const played = playedBy.has(s.id)
                  const winner = teams.find((t) => t.id === playedBy.get(s.id))
                  return (
                    <button
                      key={s.id}
                      className={`cell grad-${s.difficulty}` + (played ? ' played' : '') + (s.id === current?.id ? ' current' : '')}
                      style={winner ? ({ '--team': colorHex(winner.color) } as React.CSSProperties) : undefined}
                      disabled={busy || played}
                      onClick={() => run(() => api.playSong(session.id, s.id))}
                      aria-label={`${c.name} ${s.difficulty}${played ? ', spilt' : ''}`}
                    >
                      {s.difficulty}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      <footer className="gm-foot">
        {session.board_id && (
          <button className="ghost" onClick={() => setScanning(true)}>
            Bytt brett
          </button>
        )}
        <button
          className="ghost danger"
          onClick={() => confirm('Avslutte økten? Boksen blir ledig for en ny.') && run(() => api.endSession(session.id))}
        >
          Avslutt økten
        </button>
      </footer>
    </main>
  )
}

type NowPlayingProps = {
  session: Session
  song: Song & { category: string }
  teams: Player[]
  busy: boolean
  onAward: (playerId: string | null) => void
  onSaveUri: (uri: string) => void
}

function NowPlaying({ session, song, teams, busy, onAward, onSaveUri }: NowPlayingProps) {
  const [revealed, setRevealed] = useState(false)
  const [link, setLink] = useState('')
  const buzzAt = parseTs(session.last_buzz_at)
  const now = useServerNow(true, 250)
  const buzzer = teams.find((t) => t.id === session.last_buzz_player_id)
  const fresh = buzzer && now - buzzAt < 8000

  const parsed = toTrackUri(link)
  const search = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`.trim())}`

  return (
    <section className="now">
      <p className="eyebrow">
        Spilles nå · {song.category} · {song.difficulty} poeng
      </p>

      {buzzer && (
        <div className={'buzz-banner' + (fresh ? ' fresh' : '')} style={{ '--team': colorHex(buzzer.color) } as React.CSSProperties}>
          {fresh ? `${buzzer.name} buzzet!` : `Sist buzzet: ${buzzer.name}`}
        </div>
      )}

      {song.spotify_uri ? (
        <SpotifyEmbed uri={song.spotify_uri} startMs={song.start_ms} />
      ) : (
        <div className="missing">
          <p>Sangen mangler Spotify-spor.</p>
          <a href={search} target="_blank" rel="noreferrer">
            Søk etter «{song.title}» på Spotify
          </a>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (parsed) onSaveUri(parsed)
            }}
          >
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Lim inn lenke til sangen" />
            <button type="submit" disabled={!parsed || busy}>
              Lagre
            </button>
          </form>
        </div>
      )}

      {revealed ? (
        <div className="answer">
          <p className="answer-word">{song.answer}</p>
          <p>
            {song.title}
            {song.artist && ` – ${song.artist}`}
          </p>
          {song.why && <p className="muted">{song.why}</p>}
        </div>
      ) : (
        <button className="secondary" onClick={() => setRevealed(true)}>
          Vis fasit
        </button>
      )}

      <div className="award">
        <p className="eyebrow">Hvem fikk poengene?</p>
        <div className="award-buttons">
          {teams.map((t) => (
            <button
              key={t.id}
              className="team-btn"
              style={{ '--team': colorHex(t.color) } as React.CSSProperties}
              disabled={busy}
              onClick={() => onAward(t.id)}
            >
              {t.name} +{song.difficulty}
            </button>
          ))}
          <button className="ghost" disabled={busy} onClick={() => onAward(null)}>
            Ingen
          </button>
        </div>
      </div>
    </section>
  )
}
