<script setup lang="ts">
import { useSettingStore } from '../../stores/setting'

const settingStore = useSettingStore()
</script>

<template>
  <q-list padding>
    <q-item-label header>通用</q-item-label>

    <q-item tag="label" v-ripple>
      <q-item-section side top>
        <q-checkbox v-model="settingStore.settings.saveImg" />
      </q-item-section>

      <q-item-section>
        <q-item-label>保存图片到本地</q-item-label>
        <q-item-label caption>
          若启用此选项，动画的封面图将下载到本地。否则会直接使用图片链接。
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label" v-ripple>
      <q-item-section>
        <q-item-label>主题</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn-toggle
          v-model="settingStore.settings.theme"
          spread
          no-caps
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            { label: '亮色', value: 'LIGHT' },
            { label: '暗色', value: 'DARK' },
          ]"
        />
      </q-item-section>
    </q-item>

    <q-separator spaced />
    
    <q-item-label header>Anidb API</q-item-label>

    <div>
      http://api.anidb.net:9001/httpapi?request=anime&client=
      <span class="cursor-pointer">
        {{ settingStore.settings.anidb.client }}
        <q-popup-edit v-model="settingStore.settings.anidb.client" auto-save v-slot="scope">
          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
        </q-popup-edit>
      </span>
      &clientver=
      <span class="cursor-pointer">
        {{ settingStore.settings.anidb.clientVersion }}
        <q-popup-edit v-model="settingStore.settings.anidb.clientVersion" auto-save v-slot="scope">
          <q-input v-model.number="scope.value" type="number" dense autofocus counter @keyup.enter="scope.set" />
        </q-popup-edit>
      </span>
      &protover=1&aid={int}
    </div>
  </q-list>

  <q-btn color="primary" @click="settingStore.saveSettings()" label="保存更改" />
</template>