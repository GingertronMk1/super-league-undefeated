import { createRouter, createWebHistory } from 'vue-router'
import StatisticsPage from '@/pages/StatisticsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    component: StatisticsPage,
    name: 'statistics',
  }],
})

export default router
