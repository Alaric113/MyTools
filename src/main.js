// main.js
import './assets/main.css';

import { createApp,ref } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
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

const routes = [
  { path: '/', component: Home },
  {
    path: '/:tool', // 使用動態路由參數
    component: ToolLayout, // 使用 ToolLayout
    children: tools.map((tool) => ({
      path: tool.route,
      component: () => import(`./pages/${tool.route.slice(1)}.vue`),
    })),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export const oilPrices=ref([])
try {
  const response = await fetch(
    'https://corsproxy.io/https://vipmbr.cpc.com.tw/openData/SixtypeOilListPrice'
  );
  const data = await response.json(); // Add .json() to parse the response
  const targetOilNames = ['98無鉛汽油', '95無鉛汽油', '92無鉛汽油'];
  oilPrices.value = data.filter((price) =>
    targetOilNames.includes(price.產品名稱)
  );
  console.log(oilPrices)
} catch (error) {
  console.error('獲取油價失敗:', error);
}

const app = createApp(App);
app.use(router);
app.mount('#app');
