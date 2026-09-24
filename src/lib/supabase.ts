import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const auth = {
  detectSessionInUrl: false,
  // Skip the cross-tab auth lock; a stale lock stalls every request
  lock: async <R>(_name: string, _timeout: number, fn: () => Promise<R>): Promise<R> => await fn(),
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, { auth })
