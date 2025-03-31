// main.js
import './assets/main.css';

import { createApp,ref } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ToolLayout from './pages/ToolLayout.vue'; // 引入 ToolLayout

let id = 0;

export const tools = [
  { id: id++, name: 'Gas price', route: '/gas-price' ,preview:{
    '98無鉛汽油': '載入中...',
    '95無鉛汽油': '載入中...',
    '92無鉛汽油': '載入中...',
  },},
  { id: id++, name: 'Parking Finder', route: '/parking-finder' },
];

// main.js 路由配置修改
const routes = [
  { 
    path: '/', 
    component: App,
  },
  { 
    path: '/gas-price',
    name: 'gas-price',
    component: () => import('./pages/GasPrice.vue'),
    meta: { preview: tools[0].preview }
  },
  { 
    path: '/parking-finder',
    name: 'parking-finder', 
    component: () => import('./pages/ParkingFinder.vue')
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


const app = createApp(App);
app.use(router);
app.mount('#app');
