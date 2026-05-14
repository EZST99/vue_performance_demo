<template>
  <div>
    <h1>Product List</h1>

    <!-- Filter & Sort Controls -->
    <div class="controls">
      <select v-model="selectedCategory">
        <option value="">All Categories</option>
        <option value="A">Category A</option>
        <option value="B">Category B</option>
        <option value="C">Category C</option>
      </select>

      <button @click="toggleSort">
        Sort: {{ sortDirection }}
      </button>
    </div>

    <!-- Rendered Items with links to DetailView -->
    <div v-for="item in paginatedItems" :key="item.id">
      <router-link 
        :to="`/detail/${item.id}`"
        class="item-link"
      >
        {{ item.name }} - {{ item.category }}
      </router-link>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// simulates 2500 Items
const items = Array.from({ length: 2500 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  category: ['A', 'B', 'C'][i % 3]
}))

const selectedCategory = ref('')
const sortDirection = ref('ASC')
const page = ref(1)
const pageSize = 100

// Filter
const filteredItems = computed(() => {
  if (!selectedCategory.value) return items
  return items.filter(item => item.category === selectedCategory.value)
})

// Sort
const sortedItems = computed(() => {
  return [...filteredItems.value].sort((a, b) => {
    if (sortDirection.value === 'ASC') {
      return a.name.localeCompare(b.name)
    }
    return b.name.localeCompare(a.name)
  })
})

// Pagination
const totalPages = computed(() =>
  Math.ceil(sortedItems.value.length / pageSize)
)

const paginatedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return sortedItems.value.slice(start, start + pageSize)
})

function toggleSort() {
  sortDirection.value =
    sortDirection.value === 'ASC' ? 'DESC' : 'ASC'
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('view-ready'))
  })
})
</script>