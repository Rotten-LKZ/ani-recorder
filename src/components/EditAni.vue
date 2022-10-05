<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { AnimeInfo, useAnimeInfoStore, possibleStatus } from '../stores/animeInfo'
import { useSettingStore } from '../stores/setting'
import type { SearchNameResult } from '../utils/request'
import notify from '../utils/notify'
import request from '../utils/request'
import time from '../utils/time'
import QInputDate from './QInputDate.vue'
import { BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs'

defineExpose({
  toggle,
})

const props = defineProps<{
  defaultAid?: number // if not undefined, it will be EDIT MODE or VIEW MODE.
}>()

let now = time.getNow()
const nowEpisode = ref('-1')
const nowDownloadedEpisode = ref('-1')
const open = ref(true)
const coverImg = ref<any>('')
const animeInfoStore = useAnimeInfoStore()
const settingStore = useSettingStore()
const searchNames = reactive<SearchNameResult>({})
const defaultValue: AnimeInfo = {
  aid: '0',
  name: '',
  cover: '',
  createdAt: 0,
  updatedAt: 0, 
  releasedAt: 0,
  isOver: false,
  status: 'UNWATCH',
  tags: [],
  rating: 0,
  episodes: {},
  star: false,
  note: '',
  download: false,
}
const animeInfo = reactive<AnimeInfo>(Object.assign(JSON.parse(JSON.stringify(defaultValue)), { createdAt: now, updatedAt: now }))
const createdAt = computed({
  get() {
    return time.tsToString(animeInfo.createdAt)
  },
  set(newValue) {
    animeInfo.createdAt = time.stringToTs(newValue)
  },
})
const updatedAt = computed({
  get() {
    return time.tsToString(animeInfo.updatedAt)
  },
  set(newValue) {
    animeInfo.updatedAt = time.stringToTs(newValue)
  },
})
const releasedAt = computed({
  get() {
    return time.tsToString(animeInfo.releasedAt)
  },
  set(newValue) {
    animeInfo.releasedAt = time.stringToTs(newValue)
  },
})
const episodeComment = computed({
  get() {
    return animeInfo.episodes[nowEpisode.value]?.comment ?? ''
  },
  set(newValue) {
    if (animeInfo.episodes[nowEpisode.value] !== undefined)
      animeInfo.episodes[nowEpisode.value].comment = newValue
  },
})
const downloadedEpisodeNote = computed({
  get() {
    return animeInfo.episodes[nowDownloadedEpisode.value]?.comment ?? ''
  },
  set(newValue) {
    if (animeInfo.episodes[nowDownloadedEpisode.value] !== undefined)
      animeInfo.episodes[nowDownloadedEpisode.value].downloadNote = newValue
  },
})

const watchTimes = {
  add(episode: string) {
    nowEpisode.value = episode
    animeInfo.episodes[episode].times++
    notify.info(`你已经看 ${episode} 集 ${animeInfo.episodes[episode].times} 遍了！`, 'top')
  },
  reduce(episode: string) {
    nowEpisode.value = episode
    if (animeInfo.episodes[episode].times !== 0)
      animeInfo.episodes[episode].times--
    notify.info(`你已经看 ${episode} 集 ${animeInfo.episodes[episode].times} 遍了！`, 'top')
  },
}

function toggle() {
  open.value = !open.value
}

function submit() {
  if (props.defaultAid === undefined) {
    animeInfoStore.add(animeInfo, settingStore.settings.saveImg)
  } else {
    animeInfoStore.modify(animeInfo, settingStore.settings.saveImg)
  }
  clear()
}

initAnimeInfo()
function initAnimeInfo() {
  if (props.defaultAid !== undefined) {
    Object.assign(animeInfo, animeInfoStore.animeInfos[props.defaultAid])
  }
}

function clear() {
  now = time.getNow()
  Object.assign(animeInfo, Object.assign(JSON.parse(JSON.stringify(defaultValue)), { createdAt: now, updatedAt: now }))
}

function searchName(zhOnly: boolean) {
  request.searchName(animeInfo.name, zhOnly)
    .then((data) => {
      Object.assign(searchNames, data)
    })
}

function searchAid(id?: string, name?: string) {
  Object.keys(searchNames).forEach((value) => { delete searchNames[value] })
  if (id !== undefined && name !== undefined)
    animeInfo.name = name
  const aid = id ?? animeInfo.aid
  request.getAidInfo(aid, settingStore.settings.anidb.client, settingStore.settings.anidb.clientVersion)
    .then((data) => {
      if (id !== undefined) {
        animeInfo.name = data.title 
      }
      animeInfo.aid = data.aid
      animeInfo.isOver = data.isOver
      animeInfo.releasedAt = data.releasedAt
      animeInfo.cover = data.cover
      data.episodes.forEach((value) => {
        animeInfo.episodes[value] = {
          comment: '',
          times: 0,
          downloaded: false,
          downloadNote: '',
        }
      })
    })
}

watch(() => animeInfo.status, (newValue) => {
  if (newValue === 'WATCHED') {
    for (const epi of Object.keys(animeInfo.episodes)) {
      if (animeInfo.episodes[epi].times === 0)
        animeInfo.episodes[epi].times = 1
    }
  }
})

watch(() => animeInfo.cover, async (newValue) => {
  if (newValue.startsWith('http')) {
    coverImg.value = `data:image/png;base64,${window.btoa(String.fromCharCode(...await request.downloadImg(newValue)))}`
  } else if (newValue === 'INSYSTEM') {
    readBinaryFile(`data/img/${animeInfo.aid}`, { dir: BaseDirectory.App })
      .then((data) => {
        coverImg.value = `data:image/png;base64,${window.btoa(String.fromCharCode(...data))}`
      }).catch((err) => {
        console.error(err)
        notify.negative('读取封面失败')
      })
  }
}, { immediate: true })
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-scroll-area style="height: 500px;max-width: 700px;width: 650px;">
      <q-card style="width: 650px;">
        <q-card-section>
          <div class="ani column gap-6">
            <div class="name-result">
              <q-list bordered>
                <q-item v-for="name of Object.keys(searchNames)" clickable @click="searchAid(searchNames[name], name)">
                  <q-item-section>
                    <q-item-label>{{ name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="basic-info gap-6">
              <img :src="coverImg" alt="动画封面" />
              <div class="text column gap-6">
                <div class="aid full-width row justify-between items-center">
                  <q-input
                    outlined
                    label="aid"
                    v-model="animeInfo.aid"
                    :rules="[val => !isNaN(parseInt(val)) || 'aid 为数字']"
                  />
                  <q-checkbox
                    v-model="animeInfo.isOver"
                    label="完结"  
                  />
                  <q-checkbox
                    v-model="animeInfo.star"
                    checked-icon="star"
                    unchecked-icon="star_border"
                    color="warning"
                    class="star"
                    size="lg"
                  />
                </div>
                <div>
                  <q-input
                    outlined
                    label="动画名称"
                    v-model="animeInfo.name"
                  />
                </div>

                <div class="row gap-6 no-wrap">
                  <q-input-date v-model="createdAt" label="创建日期" />
                  <q-input-date v-model="updatedAt" label="更新日期" />
                </div>


                <div class="row gap-6 no-wrap">
                  <q-input-date v-model="releasedAt" label="首播日期" />
                  <q-select outlined v-model="animeInfo.status" :options="possibleStatus" label="观看状态" />
                </div>

                <div class="row justify-between">
                  <q-rating
                    v-model="animeInfo.rating"
                    :max="10"
                    color="primary"
                  />
                  <span class="tip-text">评分</span>
                </div>
              </div>
            </div>

            <div class="episode-status column gap-2">
              <span>每集观看状态: </span>
              <div class="row gap-2">
                <q-btn
                  v-for="epi of Object.keys(animeInfo.episodes)"
                  round
                  :outline="animeInfo.episodes[epi].times === 0"
                  :color="animeInfo.episodes[epi].times === 0 ? 'black' : 'green'"
                  :label="epi"
                  size='xs'
                  @click.left="watchTimes.add(epi)"
                  @click.middle="nowEpisode = epi"
                  @click.right="watchTimes.reduce(epi)"
                />
              </div>
            </div>

            <q-slide-transition>
              <div v-show="nowEpisode !== '-1'" class="column gap-2">
                <div class="column gap-2">
                  <div class="row justify-between">
                    <span>第 {{ nowEpisode }} 集观看次数：{{ animeInfo.episodes[nowEpisode]?.times || 0 }}</span>
                    <span @click="nowEpisode = '-1'" class="cursor-pointer tip-text">关闭</span>
                  </div>
                  <q-input
                    v-model="episodeComment"
                    filled
                    autogrow
                  />
                </div>
              </div>
            </q-slide-transition>

            <div class="download column">
              <q-checkbox
                v-model="animeInfo.download"
                label="下载到本地观看"
              />
              <q-slide-transition>
                <div v-show="animeInfo.download">
                  <div class="row gap-2">
                    <q-btn
                      v-for="epi of Object.keys(animeInfo.episodes)"
                      round
                      :outline="!animeInfo.episodes[epi].downloaded"
                      :color="animeInfo.episodes[epi].downloaded ? 'green' : 'black'"
                      :label="epi"
                      size='xs'
                      @click.left="nowDownloadedEpisode = epi;animeInfo.episodes[epi].downloaded = true"
                      @click.middle="nowDownloadedEpisode = epi"
                      @click.right="nowDownloadedEpisode = epi;animeInfo.episodes[epi].downloaded = false"
                    />
                  </div>
                  <div class="column">
                    <span class="tip-text">第 {{ nowDownloadedEpisode }} 集下载备注: </span>
                    <q-input
                      v-model="downloadedEpisodeNote"
                      filled
                      autogrow
                    />
                  </div>
                </div>
              </q-slide-transition>
            </div>

            <div class="column">
              <span class="tip-text">备注: </span>
              <q-input
                v-model="animeInfo.note"
                filled
                autogrow
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="搜索 AID" @click="searchAid()" />
          <q-btn flat label="搜索动画名称 (仅中文)" @click="searchName(true)" />
          <q-btn flat label="搜索动画名称" @click="searchName(false)" />
          <q-btn flat label="取消" v-close-popup @click="clear" />
          <q-btn flat :label="$props.defaultAid === undefined ? '添加' : '修改'" v-close-popup @click="submit" />
        </q-card-actions>
      </q-card>
    </q-scroll-area>
  </q-dialog>
</template>
<style scoped lang="scss">
.gap-2 {
  gap: 2px;
}
.gap-6 {
  gap: 6px;
}
.ani {
  padding: 10px 20px;
  position: relative;

  .name-result {
    position: absolute;
    top: 130px;
    left: 236px;
    width: 362px;
    max-height: 200px;
    z-index: 999;
    overflow-y: auto;
    background-color: white;
  }

  label {
    padding-bottom: 0;
  }

  .basic-info {
    display: flex;

    img {
      width: 210px;
    }

    .text {
      flex: 1;

      .aid {
        width: 100%;
      }
    }
  }
  
  .episode-status {
    .title {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
}
</style>
