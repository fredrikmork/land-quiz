import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a dummy client if env vars are missing (for local development without Supabase)
function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set. Highscores will not be saved.')
    // Return a dummy client that won't crash but won't work
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      realtime: { params: { eventsPerSecond: 0 } },
    })
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    // Disable realtime to improve bfcache compatibility
    realtime: { params: { eventsPerSecond: 0 } },
  })
}

export const supabase = createSupabaseClient()

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
