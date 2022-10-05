import type { RouteRecordRaw } from 'vue-router'

import MainLayoutVue from './Layout/MainLayout.vue'

import MainHomeVue from './pages/main/Home.vue'
import MainListVue from './pages/main/List.vue'
import MainSettingsVue from './pages/main/Settings.vue'
import MainInfoVue from './pages/main/Info.vue'

const routes: readonly RouteRecordRaw[] = [
  { path: '/', redirect: '/main' },
  {
    path: '/main',
    component: MainLayoutVue,
    children: [
      { path: '', component: MainHomeVue, name: 'MainHome' },
      { path: 'list', component: MainListVue, name: 'MainList' },
      { path: 'settings', component: MainSettingsVue, name: 'MainSettings' },
      { path: 'info', component: MainInfoVue, name: 'MainInfo' },
    ],
  },
]

export default routes
