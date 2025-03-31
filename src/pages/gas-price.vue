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
  import { ref, onMounted } from 'vue';
  
  const oilPrices = ref([]);
  
  onMounted(async () => {
    try {
      const response = await fetch(
        'https://corsproxy.io/https://vipmbr.cpc.com.tw/openData/SixtypeOilListPrice'
      );
      const data = await response.json(); // Add .json() to parse the response
      console.log(data)
      const targetOilNames = ['98無鉛汽油', '95無鉛汽油', '92無鉛汽油'];
      oilPrices.value = data.filter((price) =>
        targetOilNames.includes(price.產品名稱)
      );
    } catch (error) {
      console.error('獲取油價失敗:', error);
    }
  });
  </script>