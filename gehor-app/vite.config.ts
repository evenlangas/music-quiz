import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative stier, så samme bygg virker på GitHub Pages (under /<repo>/)
// og inni Capacitor-appen.
export default defineConfig({
  base: './',
  plugins: [react()],
})
