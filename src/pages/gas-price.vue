<template>
    <div>
      <h1>油價資訊</h1>
      <div v-if="oilPrices.length > 0">
        <p v-for="price in oilPrices" :key="price.產品名稱">
          {{ price.產品名稱 }}: {{ price.參考牌價 }} 元/公升
        </p>
      </div>
      <p v-else>載入中...</p>
    </div>
  </template>
  
  <script setup>
  import { oilPrices } from '../main.js'; // 引入 tools
  

  </script>