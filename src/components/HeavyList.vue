<template>
  <div>
    <div v-for="item in items" :key="item.id">
      {{ item.title }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import bigData from '../data/largeData.json'

const emit = defineEmits(['ready'])
const items = bigData

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    emit('ready')
  })
})
</script>