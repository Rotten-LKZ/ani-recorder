<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>
<template>
  <div class="condition">
    <div class="left">
      <span>
        {{ name }}
      </span>
      <div>
        <slot name="left"></slot>
      </div>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </div>
  <q-separator />
</template>
<style scoped lang="scss">
.condition {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 4px 10px;
  font-size: 1.05rem;

  .left {
    display: flex;
    gap: 8px;
    align-items: center;

    span {
      font-size: 1rem;
      color: gray;
    }
  }
}
</style>
