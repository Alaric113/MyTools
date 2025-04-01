<template>
    <div class="route-info" v-if="distance">
      <div class="info-item">
        <span class="label">距離:</span>
        <span class="value">{{ distance }} km</span>
      </div>
      <div class="info-item">
        <span class="label">時間:</span>
        <span class="value">{{ duration }} 分鐘</span>
      </div>
      <div class="info-item">
        <span class="label">預估油耗:</span>
        <span class="value">{{ fuelConsumption }} 升</span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    distance: String,
    duration: Number,
    fuelConsumption: String
  });
  </script>
  
  <style scoped>
  /* 從原GasPrice.vue複製相關樣式 */
  .route-info {
    margin-top: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 6px;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  
  .label {
    color: #666;
  }
  
  .value {
    font-weight: bold;
  }
  </style>