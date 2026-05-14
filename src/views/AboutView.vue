<template>
  <h1>About</h1>
  <p>Rarely visited route.</p>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('view-ready'))
  })
})
</script>