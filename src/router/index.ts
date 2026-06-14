import { createRouter, createWebHistory } from 'vue-router'
import StatisticsPage from '@/pages/StatisticsPage.vue'
import GamePage from '@/pages/GamePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: StatisticsPage,
      name: 'statistics',
    },
    {
      path: '/game',
      component: GamePage,
      name: 'game',
    },
  ],
})

export default router
