import { api } from './api'

// Hvor mange millisekunder serverklokka ligger foran denne enheten.
// Sperretidene er satt av serveren, så nedtellingen må regnes i serverens tid.
let offset = 0

export async function syncClock() {
  let best = Infinity
  for (let i = 0; i < 3; i++) {
    const t0 = Date.now()
    const server = parseTs(await api.serverNow())
    const t1 = Date.now()
    if (t1 - t0 < best) {
      best = t1 - t0
      offset = server - (t0 + t1) / 2
    }
  }
}

export const serverNow = () => Date.now() + offset

// Postgres gir mikrosekunder ("…:00.123456+00:00"). Kutt til millisekunder,
// så eldre Safari også klarer å lese tiden.
export const parseTs = (iso: string | null) =>
  iso ? Date.parse(iso.replace(/(\.\d{3})\d+/, '$1')) : 0
