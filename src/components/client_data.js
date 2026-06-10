import { createClient } from '@supabase/supabase-js'

const sessionStorageAdapter = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
  removeItem: (key) => sessionStorage.removeItem(key),
}

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, {
        auth: {
            storage: sessionStorageAdapter,
            persistSession: true,
            autoRefreshToken: true
        }
    }
)