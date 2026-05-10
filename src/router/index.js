import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'
import AboutView from '../views/AboutView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/list', name: 'list', component: ListView },
  { path: '/detail/:id', name: 'detail', component: DetailView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/analytics', name: 'analytics', component: AnalyticsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Performance Measurements for RTT
router.beforeEach((to, from, next) => {
  if (!from.name) {
    window.__routeStart = null
    next()
    return
  }

  window.__routeStart = performance.now()
  next()
})

router.afterEach((to, from) => {
  requestAnimationFrame(() => {
    if (!from.name || !window.__routeStart) return

    const duration = performance.now() - window.__routeStart

    const result = {
      from: from.name,
      to: to.name,
      time: Number(duration.toFixed(2))
    }

    if (!window.__measurements) {
      window.__measurements = []
    }

    window.__measurements.push(result)

    console.log(`${result.from} → ${result.to}: ${result.time} ms`)
  })
})

if (typeof window !== "undefined") {
  window.router = router;
}

export default router