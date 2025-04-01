<script setup>
import toolCard from './components/ToolCard.vue'
import { tools} from './main.js'
import { oilPrices } from './api.js'

import { useRoute } from 'vue-router'; // 引入 useRoute
import { ref, onMounted, computed} from 'vue';

const route = useRoute(); // 獲取當前路由

</script>

<template>
  <!-- 主布局 -->
  
  <div class="app-container">
    <h1 class="app-title" v-if="route.path === '/'">小工具集</h1>
    <!-- 首頁顯示工具卡片 -->
    <div v-if="route.path === '/'" class="grid-container">
      <toolCard v-for="tool in tools" :key="tool.id" 
                :toolName="tool.name" 
                :route="tool.route"
                :preview="tool.preview"/>
    </div>
    
    <!-- 工具頁面顯示自己的內容 -->
    <router-view v-else></router-view>
  </div>
</template>

<style>
#app{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
<style scoped>
  .app-container{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .grid-container{
    display: grid;
    grid-template-columns:repeat(2,1fr);
    gap:16px;
    padding:16px;
  }
</style>