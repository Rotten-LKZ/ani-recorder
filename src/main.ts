import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/zh-CN'

import { createDir, BaseDirectory } from '@tauri-apps/api/fs'

import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'

import App from './App.vue'
import routes from './routes'

// init data folder
createDir('data/img', { dir: BaseDirectory.App, recursive: true })
createDir('data/animeInfo', { dir: BaseDirectory.App, recursive: true })

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
  },
  lang: quasarLang,
})
app.mount('#app')
