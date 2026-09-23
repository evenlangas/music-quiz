import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const configured = Boolean(url && key)

// Med ?test i adressen får hver fane sin egen anonyme bruker, så du kan være
// game master i én fane og lag i en annen på samme maskin.
const perTab = new URLSearchParams(location.search).has('test')

export const supabase = createClient(url ?? 'http://localhost', key ?? 'mangler', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: perTab ? sessionStorage : localStorage,
  },
})

// Hver enhet er en anonym Supabase-bruker. Den huskes, så enheten kommer
// tilbake til samme lag etter at siden er lastet på nytt.
export async function ensureSignedIn(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session.user.id
  const { data: signed, error } = await supabase.auth.signInAnonymously()
  if (error || !signed.user) throw error ?? new Error('Fikk ikke logget inn')
  return signed.user.id
}
