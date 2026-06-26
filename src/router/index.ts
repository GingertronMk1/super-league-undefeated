import { createRouter, createWebHistory } from 'vue-router';
import StatisticsPage from '@/pages/StatisticsPage.vue';
import DraftPage from '@/pages/DraftPage.vue';
import AllPlayers from '@/pages/AllPlayers.vue';

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
      component: DraftPage,
      name: 'game',
    },
    {
      path: '/players',
      component: AllPlayers,
      name: 'allPlayers'
    }
  ],
});

export default router;
