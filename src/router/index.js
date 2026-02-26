import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/list', component: ListView },
  { path: '/detail', component: DetailView },
  { path: '/about', component: AboutView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})