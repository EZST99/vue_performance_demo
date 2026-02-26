<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import bigData from '../data/largeData.json'

const chartCanvas = ref(null)

onMounted(() => {
  new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: bigData.slice(0, 500).map((_, i) => i),
      datasets: [
        {
          label: 'Dataset',
          data: bigData.slice(0, 500).map(item => item.value ?? 0)
        }
      ]
    }
  })
})
</script>