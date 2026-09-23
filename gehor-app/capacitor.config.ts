import type { CapacitorConfig } from '@capacitor/cli'

// Native app for iOS og Android lages av samme bygg: `npm run build && npx cap sync`.
const config: CapacitorConfig = {
  appId: 'no.evenlangas.gehor',
  appName: 'Gehør',
  webDir: 'dist',
}

export default config
