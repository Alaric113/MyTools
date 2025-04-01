<template>
    <div class="tool-card" @click="goToRoute">
      <h1>{{ toolName }}</h1>
      <div v-if="preview">
        <oilPrice />
    </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { defineProps } from 'vue'; // 修改引入路徑
  import oilPrice from '../components/oilPrice.vue';
  
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
  // 使用命名路由而不是拼接路徑
  router.push({ name: props.toolName.replace(/\s+/g, '-').toLowerCase() });
};
  </script>
  
  <style scoped>
  .tool-card {
    border: 1px solid #ccc;
    border-radius: 30Px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ;
  }
  </style>