import { defineStore } from 'pinia'
import { watch, reactive } from 'vue'
import { writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import notify from '../utils/notify'

type Settings = {
  theme: 'LIGHT' | 'DARK',
  anidb: {
    client: string
    clientVersion: number
  }
  saveImg: boolean
}

export const useSettingStore = defineStore('setting', () => {
  const settings = reactive<Settings>({
    theme: 'LIGHT',
    anidb: {
      client: 'client_name',
      clientVersion: 0,
    },
    saveImg: true,
  })
  
  watch(() => settings.theme, () => {
    settings.theme = 'LIGHT'
  })

  function saveSettings() {
    writeTextFile('config.json', JSON.stringify(settings), { dir: BaseDirectory.App })
      .then(() => {
        notify.positive('保存配置文件成功')
      }).catch((err) => {
        console.error(err)
        notify.negative('保存配置文件失败')
      })
  }

  init()
  function init() {
    readTextFile('config.json', { dir: BaseDirectory.App })
      .then((data) => {
        Object.assign(settings, JSON.parse(data))
      })
  }

  return { settings, saveSettings }
})
