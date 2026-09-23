import { useEffect, useRef, useState } from 'react'

// Spotify iFrame API: https://developer.spotify.com/documentation/embeds/references/iframe-api
// Hele sanger spilles bare når game master er logget inn på Spotify i samme
// nettleser. Ellers får man 30 sekunders forhåndsvisning.

type Controller = {
  loadUri: (uri: string, preferVideo?: boolean, startAt?: number) => void
  play: () => void
  pause: () => void
  resume: () => void
  destroy: () => void
  addListener: (event: string, cb: (e: { data: { isPaused: boolean } }) => void) => void
}

type IFrameAPI = {
  createController: (el: HTMLElement, opts: { uri: string; width?: string | number; height?: number }, cb: (c: Controller) => void) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void
  }
}

let apiPromise: Promise<IFrameAPI> | null = null
function loadApi() {
  apiPromise ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve
    const s = document.createElement('script')
    s.src = 'https://open.spotify.com/embed/iframe-api/v1'
    s.async = true
    document.body.appendChild(s)
  })
  return apiPromise
}

type Props = { uri: string; startMs: number }

export function SpotifyEmbed({ uri, startMs }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<Controller | null>(null)
  const [ready, setReady] = useState(false)

  // Én kontroller for hele økten. Nye sanger lastes inn i den.
  useEffect(() => {
    let cancelled = false
    loadApi().then((api) => {
      if (cancelled || !host.current) return
      const el = document.createElement('div')
      host.current.appendChild(el)
      api.createController(el, { uri, width: '100%', height: 152 }, (c) => {
        if (cancelled) return c.destroy()
        controller.current = c
        c.addListener('ready', () => setReady(true))
      })
    })
    return () => {
      cancelled = true
      controller.current?.destroy()
      controller.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const c = controller.current
    if (!c || !ready) return
    c.loadUri(uri, false, Math.floor(startMs / 1000))
    c.play()
  }, [uri, startMs, ready])

  return <div className="spotify" ref={host} />
}

// Gjør en Spotify-lenke om til en URI: https://open.spotify.com/track/<id>?si=... -> spotify:track:<id>
export function toTrackUri(text: string): string | null {
  const t = text.trim()
  const m = t.match(/^spotify:track:([A-Za-z0-9]{22})$/) ?? t.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]{22})/)
  return m ? `spotify:track:${m[1]}` : null
}
