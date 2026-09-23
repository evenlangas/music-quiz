import { useEffect, useState } from 'react'
import { serverNow } from './clock'

// Serverens tid, oppdatert jevnlig mens `active` er sann.
export function useServerNow(active: boolean, everyMs = 100) {
  const [now, setNow] = useState(serverNow)
  useEffect(() => {
    if (!active) return
    setNow(serverNow())
    const t = setInterval(() => setNow(serverNow()), everyMs)
    return () => clearInterval(t)
  }, [active, everyMs])
  return now
}
