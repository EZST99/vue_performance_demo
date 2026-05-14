<template>
  <div>
    <h1>Detail View</h1>

    <div v-if="item">
      <p><strong>ID:</strong> {{ item.id }}</p>
      <p><strong>Name:</strong> {{ item.name }}</p>
      <p><strong>Category:</strong> {{ item.category }}</p>

      <h3>Additional Information</h3>
      <p v-for="n in 20" :key="n">
        Additional detail line {{ n }}
      </p>
    </div>

    <router-link to="/list">Back to List</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  category: ['A', 'B', 'C'][i % 3]
}))

const item = computed(() =>
  items.find(i => i.id === Number(route.params.id))
)

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('view-ready'))
  })
})
</script>