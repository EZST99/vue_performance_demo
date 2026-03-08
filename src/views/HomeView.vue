<template>
  <h1>Home</h1>
  <p>This is the home page.</p>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('view-ready'))
    import('../views/ListView.vue')
  })
})
</script>