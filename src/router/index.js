import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component:() => import('../views/HomeView.vue') },
  { path: '/list', name: 'list', component:() => import('../views/ListView.vue') },
  { path: '/detail/:id', name: 'detail', component: () => import('../views/DetailView.vue') },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/analytics', name: 'analytics', component: () => import('../views/AnalyticsView.vue')}
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