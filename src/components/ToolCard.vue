<template>
    <div class="tool-card" @click="goToRoute">
      <h1>{{ toolName }}</h1>
      <div v-if="preview">
      <p v-for="(price, name) in preview" :key="name">
        {{ name }}: {{ price }}
      </p>
    </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { defineProps ,onMounted,ref} from 'vue'; // 修改引入路徑
  import { tools } from '../main.js';
  const oilPrices = ref([]);
  const props = defineProps({
    toolName: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    preview: { type: Object, default: null },
  });
  
  const router = useRouter();
  
  const goToRoute = () => {
    router.push(`/${props.route.slice(1)}`);
  };

  onMounted(async () => {
    try {
      const response = await fetch(
        'https://corsproxy.io/https://vipmbr.cpc.com.tw/openData/SixtypeOilListPrice'
      );
      const data = await response.json(); // Add .json() to parse the response
      const targetOilNames = ['98無鉛汽油', '95無鉛汽油', '92無鉛汽油'];
      oilPrices.value = data.filter((price) =>
        targetOilNames.includes(price.產品名稱)
      );
      const gasPriceTool = tools.find((tool) => tool.route === '/gas-price');
    if (gasPriceTool) {
      oilPrices.value.forEach((price) => {
        if (gasPriceTool.preview[price.產品名稱]) {
          gasPriceTool.preview[price.產品名稱] = `${price.參考牌價} 元/公升`;
        }
      });
    }
    } catch (error) {
      console.error('獲取油價失敗:', error);
    }
  });
  </script>
  
  <style scoped>
  .tool-card {
    border: 1px solid #ccc;
    border-radius: 30Px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
  }
  </style>