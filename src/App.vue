<script setup>
import toolCard from './components/toolCard.vue'
import {tools} from './main.js'

import { useRoute } from 'vue-router'; // 引入 useRoute

const route = useRoute(); // 獲取當前路由
</script>

<template>
<router-view></router-view>
  <div class="grid-container" v-if="route.path === '/'">
    <toolCard v-for="tool in tools" 
            :key="tool.id"      
            :toolName="tool.name" 
            :route="tool.route"
            :preview="tool.preview"
          />
  </div>
  
  

</template>


<style scoped>
  .grid-container{
    display: grid;
    grid-template-columns:repeat(auto-fit, minmax(200px,1fr));
    gap:16px;
    padding:16px;
  }
</style>