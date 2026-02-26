<template>
  <div>
    <div v-for="item in items" :key="item.id">
      {{ item.title }}
    </div>
  </div>
</template>

<script setup>
import bigData from '../data/largeData.json'

const items = bigData
</script>