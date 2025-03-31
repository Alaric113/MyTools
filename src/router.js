import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import GasPrice from '@/pages/GasPrice.vue';
import ParkingFinder from '@/pages/ParkingFinder.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/gas-price', component: GasPrice },
  { path: '/parking-finder', component: ParkingFinder }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;