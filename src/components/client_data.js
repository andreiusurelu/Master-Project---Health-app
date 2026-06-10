import { createClient } from '@supabase/supabase-js'
import {ref} from 'vue'

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

export const authEvent = ref(null)
export const authSession = ref(null)

supabase.auth.onAuthStateChange((event, session) => {
    console.log('onAuthStateChange was fired up for event: ', event)
  authEvent.value = event
  authSession.value = session
})