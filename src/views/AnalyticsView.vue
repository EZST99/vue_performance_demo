<template>
  <div>
    <h1>Analytics Dashboard</h1>
     <HeavyChart @ready="onChildReady" />
    <HeavyList @ready="onChildReady" />
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import HeavyChart from '../components/HeavyChart.vue'
import HeavyList from '../components/HeavyList.vue'

let readyCount = 0

async function onChildReady() {
  readyCount++

  if (readyCount === 2) {
    await nextTick()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('view-ready'))
      })
    })
    readyCount = 0
  }
}
</script>