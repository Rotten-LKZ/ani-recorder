<script setup lang="ts">
import { useRoute } from 'vue-router'

defineEmits<{
  (e: 'pushRoute', activeRouteName: string): void
}>()

defineProps<{
  routeName: string
  content: string
  icon: string
}>()

const route = useRoute()

function isActive(activeRouteName: string) {
  return activeRouteName === route.name
}
</script>
<template>
  <q-list padding>
    <q-item
      active-class="active-action"
      clickable
      v-ripple
      :active="isActive($props.routeName)"
      @click="$emit('pushRoute', $props.routeName)"
    >
      <q-item-section avatar>
        <q-icon :name="$props.icon" />
      </q-item-section>

      <q-item-section>{{ $props.content }}</q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">
.active-action {
  color: white;
  background: $primary;
}
</style>
