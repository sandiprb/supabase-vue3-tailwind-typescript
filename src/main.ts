import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { supabase } from './lib/supabase'
import { userSession } from '@/use/useAuth'
import './assets/tailwind.css'

createApp(App).use(store).use(router).mount('#app')


/**
 * Keeps track of if the user is logged in or out and will update userSession state accordingly.
 */
 supabase.auth.onAuthStateChange((event, session) => {
    userSession.value = session
    if(!userSession.value) {
        router.push('/login')
    }else {
        router.push('/')
    }
  })