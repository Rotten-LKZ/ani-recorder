<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
}>()
defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
<template>
  <q-input filled v-model="modelValue" mask="date" :rules="['date']" :label="label">
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="modelValue" today-btn>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="关闭" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>