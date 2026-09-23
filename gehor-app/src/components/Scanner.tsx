import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { parseCode, type CodeKind } from '../lib/codes'

const WRONG: Record<CodeKind, string> = {
  box: 'Det der er et brett. Skann koden inni boksen.',
  board: 'Det der er en boks. Skann koden på brettet.',
}

type Props = {
  expect: CodeKind
  title: string
  onResult: (value: string) => void
  onCancel: () => void
}

// Kameraskanner i nettleseren. I den native appen kan denne byttes ut med
// @capacitor-mlkit/barcode-scanning bak samme props.
export function Scanner({ expect, title, onResult, onCancel }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [manual, setManual] = useState(false)
  const [typed, setTyped] = useState('')
  const done = useRef(false)

  const handle = (text: string) => {
    if (done.current) return
    const code = parseCode(text)
    if (!code) return setHint('Kjenner ikke igjen koden.')
    if (code.kind !== expect) return setHint(WRONG[expect])
    done.current = true
    navigator.vibrate?.(30)
    onResult(code.value)
  }
  const handleRef = useRef(handle)
  handleRef.current = handle

  useEffect(() => {
    if (!video.current || manual) return
    const scanner = new QrScanner(video.current, (r) => handleRef.current(r.data), {
      preferredCamera: 'environment',
      highlightScanRegion: true,
      highlightCodeOutline: true,
      returnDetailedScanResult: true,
    })
    scanner.start().catch((e) => {
      setCameraError(
        String(e).includes('secure')
          ? 'Kameraet krever https.'
          : 'Fikk ikke tilgang til kameraet. Sjekk at appen har lov til å bruke det.',
      )
    })
    return () => scanner.destroy()
  }, [manual])

  const submitTyped = (e: React.FormEvent) => {
    e.preventDefault()
    const prefix = expect === 'box' ? 'GEHOR:BOX:' : 'GEHOR:BOARD:'
    handle(typed.toUpperCase().startsWith('GEHOR:') ? typed : prefix + typed)
  }

  return (
    <div className="scanner">
      <header className="scanner-head">
        <button className="ghost" onClick={onCancel}>
          Avbryt
        </button>
        <h2>{title}</h2>
      </header>
      {manual ? (
        <form className="manual" onSubmit={submitTyped}>
          <label>
            Kode
            <input autoFocus value={typed} onChange={(e) => setTyped(e.target.value)} autoCapitalize="off" />
          </label>
          <button className="primary" type="submit">
            Fortsett
          </button>
        </form>
      ) : (
        <div className="viewfinder">
          <video ref={video} playsInline muted />
          {cameraError && <p className="error">{cameraError}</p>}
        </div>
      )}
      {hint && <p className="hint">{hint}</p>}
      <button className="link" onClick={() => setManual((m) => !m)}>
        {manual ? 'Bruk kameraet' : 'Skriv inn koden i stedet'}
      </button>
    </div>
  )
}
