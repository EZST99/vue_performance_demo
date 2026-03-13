<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/list">List</router-link> |
    <router-link to="/analytics">Analytics</router-link>
  </nav>

  <router-view />

  <footer class="footer">
    <router-link to="/about">About</router-link>
  </footer>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function downloadResults() {
  const rows = window.__measurements
    .map(r => `${r.from};${r.to};${r.time}`)
    .join("\n")

  const csv = "from;to;time\n" + rows

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "route-measurements-expected-baseline.csv"
  a.click()
}

window.downloadResults = downloadResults

onMounted(() => {
  runTestSequence(router);
});

async function runTestSequence(router) {

  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const delay = 5000

  await wait(delay)
  await router.push("/list")

  await wait(delay)
  await router.push("/analytics")

  await wait(delay)
  await router.push("/about")

  await wait(delay)
  await router.push("/list")

  await wait(delay)
  await router.push("/detail/1")

  await wait(delay)

  console.log("MEASUREMENTS:", window.__measurements)
}

</script>

<style>
nav {
  padding: 1rem;
}

nav a {
  margin-right: 0.5rem;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.8rem;
  text-align: center;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
}
</style>