<template>
    <div class="tool-card" @click="goToRoute">
      <h1>{{ toolName }}</h1>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { defineProps } from 'vue'; // 修改引入路徑
  
  const props = defineProps({
    toolName: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
  });
  
  const router = useRouter();
  
  const goToRoute = () => {
    console.log('click');
    router.push(`/${props.route.slice(1)}`);
  };
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