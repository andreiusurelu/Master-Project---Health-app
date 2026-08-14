import { createApp} from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createBootstrap } from 'bootstrap-vue-next'
import { createI18n } from 'vue-i18n'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import router from './router'
import './registerServiceWorker'

import ro from './locales/ro.json'
import en from './locales/en.json'
import de from './locales/de.json'

createApp(App)
  .use(router, createBootstrap())
  .use(createPinia())
  .use(createI18n({
    locale: navigator.language,
    escapeParameter: true,
    fallbackLocale: 'en',
    messages: {en, ro, de}
  }
  ))
  .mount('#app')