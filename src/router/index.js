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
    window.__pendingRouteMeasurement = null
    next()
    return
  }

  window.__routeStart = performance.now()
  window.__pendingRouteMeasurement = {
    from: String(from.name),
    to: String(to.name)
  }

  next()
})

if (typeof window !== "undefined") {
  window.addEventListener("view-ready", () => {
    if (!window.__routeStart || !window.__pendingRouteMeasurement) return

    const duration = performance.now() - window.__routeStart

    const result = {
      from: window.__pendingRouteMeasurement.from,
      to: window.__pendingRouteMeasurement.to,
      time: Number(duration.toFixed(2))
    }

    if (!window.__measurements) {
      window.__measurements = []
    }

    window.__measurements.push(result)

    console.log(`${result.from} → ${result.to}: ${result.time} ms`)

    window.__routeStart = null
    window.__pendingRouteMeasurement = null
  })

  window.router = router
}

export default router