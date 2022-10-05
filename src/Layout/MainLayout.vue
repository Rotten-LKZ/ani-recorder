<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getVersion } from '@tauri-apps/api/app'
import NavbarItem from '../components/NavbarItem.vue'

const version = ref('')
const router = useRouter()

initVersion()
async function initVersion() {
  version.value = await getVersion()
}

function pushRoute(routeName: string) {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="layout-main">
    <div class="sidebar">
      <div class="logo">
        <img src="../../src-tauri/icons/128x128.png" alt="LOGO">
        <div class="name">Rot Ani<br/>Recorder</div>
      </div>

      <div class="action">
        <navbar-item content="主页" icon="home" @push-route="pushRoute" routeName="MainHome" />
        <navbar-item content="所有动画" icon="list" @push-route="pushRoute" routeName="MainList" />
      </div>

      <div class="info">
        <div class="icon">
          <q-icon name="o_settings" size="md" @click="pushRoute('MainSettings')" class="cursor-pointer" />
          <!-- <q-icon name="o_info" size="md" @click="pushRoute('MainInfo')" class="cursor-pointer" /> -->
        </div>
        <div class="version">v{{ version }}</div>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>  
</template>
<style lang="scss" scoped>
.layout-main {
  gap: 20px;
  display: flex;
  padding-right: 20px;

  .sidebar {
    width: 240px;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
  
    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      user-select: none;
      padding: 25px 0;

      img {
        width: 84px;
        height: 84px;
      }

      .name {
        text-align: center;
        font-weight: bold;
        line-height: 24px;
        font-size: 1.5rem;
      }
    }

    .action {
      flex: 1;
    }

    .info {
      .icon {
        display: flex;
        gap: 30px;
        justify-content: center;
      }

      .version {
        color: gray;
        font-size: .8rem;
        text-align: center;
        padding-bottom: 6px;
        font-family: 'Courier New', Courier, monospace;
      }
    }
  }

  .content {
    width: 100%;
    padding: 10px 0;
  }
}
</style>
