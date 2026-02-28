import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'
import AboutView from '../views/AboutView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/list', component: ListView },
  { path: '/detail/:id', component: DetailView },
  { path: '/about', component: AboutView },
  { path: '/analytics', component: AnalyticsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  window.__routeStart = performance.now()
  next()
})

router.afterEach(() => {
  requestAnimationFrame(() => {
    const duration = performance.now() - window.__routeStart
    console.log("Route Transition Time:", duration.toFixed(2), "ms")
  })
})

export default router