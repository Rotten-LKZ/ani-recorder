<script setup lang="ts">
import { ref } from 'vue'

const searchText = ref('')
</script>

<template>
  <div class="container">
    <q-input outlined bottom-slots v-model="searchText" label="搜索">
      <template v-slot:append>
        <q-icon v-if="searchText !== ''" name="close" @click="searchText = ''" class="close-icon" />
        <q-icon v-else name="search" />
      </template>
    </q-input>

    <q-tabs>

    </q-tabs>
  </div>
</template>
<style scoped lang="scss">
  .container {
    .close-icon {
      cursor: pointer;
    }
  }
</style>
