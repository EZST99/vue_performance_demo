<template>
  <div>
    <h1>List View</h1>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
const items = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  name: "Item " + i
}))
</script>