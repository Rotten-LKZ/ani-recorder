import { BaseDirectory, readTextFile, writeBinaryFile, writeTextFile } from '@tauri-apps/api/fs'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import notify from '../utils/notify'
import request from '../utils/request'

export const possibleStatus = ['WATCHED', 'WATCHING', 'UNWATCH', 'ABANDONED'] as const

export type AnimeSummary = {
  aids: Set<string>
}

export type AnimeInfo = {
  aid: string // aid in anidb
  name: string // anime's name
  cover: string // anime's cover
  createdAt: number
  updatedAt: number
  releasedAt: number // anime's release date
  isOver: boolean // is anime over
  status: typeof possibleStatus[number] // my view status
  tags: string[]
  rating: number
  episodes: { [key: string]: Episode }
  star: boolean
  note: string // note for an anime
  download: boolean // whether you watch an anime by downloading to your device
}

export type Episode = {
  comment: string // a comment for one episode
  times: number // how many times I watched the episode
  downloaded: boolean // whether an episode have been downloaded (just when Anime.download is true, this attr can be used)
  downloadNote: string
}

export const useAnimeInfoStore = defineStore('animeInfo', () => {
  const animeInfos = reactive<{ [aid: string]: AnimeInfo }>({})
  const animeSummary = reactive<AnimeSummary>({
    aids: new Set(),
  })

  async function add(info: AnimeInfo, saveImg: boolean) {
    if (saveImg) {
      writeBinaryFile(`data/img/${info.aid}.jpg`, await request.downloadImg(info.cover), { dir: BaseDirectory.App })
      info.cover = 'INSYSTEM'
    }
    animeInfos[info.aid] = info
    animeSummary.aids.add(info.aid)
    save(info.aid)
  }

  async function modify(info: AnimeInfo, saveImg: boolean) {
    if (saveImg) {
      writeBinaryFile(`data/img/${info.aid}.jpg`, await request.downloadImg(info.cover), { dir: BaseDirectory.App })
      info.cover = 'INSYSTEM'
    }
    animeInfos[info.aid] = info
    save(info.aid)
  }

  function del(aid: string) {
    delete animeInfos[aid]
    animeSummary.aids.delete(aid)
  }

  init()
  function init() {
    readTextFile('data/summary.json', { dir: BaseDirectory.App })
      .then((data) => {
        Object.assign(animeInfos, JSON.parse(data))
      }).catch(() => {
        writeTextFile('data/summary.json', JSON.stringify(animeSummary), { dir: BaseDirectory.App })
          .catch(() => {
            notify.negative('初始化数据文件失败')
          })
      })

    for (const aid of animeSummary.aids) {
      readTextFile(`data/animeInfo/${aid}.json`, { dir: BaseDirectory.App })
        .then((data) => {
          animeInfos[aid] = JSON.parse(data)
        }).catch(() => {
          notify.negative('数据文件已丢失')
        })
    }
  }

  function save(aid: string) {
    writeTextFile('data/summary.json', JSON.stringify(animeSummary), { dir: BaseDirectory.App })
    writeTextFile(`data/animeInfo/${aid}.json`, JSON.stringify(animeInfos[aid]), { dir: BaseDirectory.App })
  }

  return { animeInfos, animeSummary, add, modify, del }
})
