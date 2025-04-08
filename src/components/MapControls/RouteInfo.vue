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
    <div class="info-item">
      <span class="label">預估價錢:</span>
      <span class="value">{{ totalPrice }} 元
      </span>
    </div>
  </div>

</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { services } from '@tomtom-international/web-sdk-services';
import { oilPrices }  from '@/api';

const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';

const distance = ref(null);
const duration = ref(null);
const fuelConsumption = ref(null);
const totalPrice = ref(null);

const p98 = 32.3



const calculateRoute = async (start, end) => {
  try {
  
    const response = await services.calculateRoute({
      key: API_KEY,
      locations: `${start.lng},${start.lat}:${end.lng},${end.lat}`,
      travelMode: 'car',
      traffic: true,
      language: 'zh-TW'
    });
    
    if (response.routes?.length > 0) {
      const route = response.routes[0];
      distance.value = (route.summary.lengthInMeters / 1000).toFixed(1);
      duration.value = Math.round(route.summary.travelTimeInSeconds / 60);
      fuelConsumption.value = (route.summary.lengthInMeters / 1000 /7).toFixed(1);
      totalPrice.value = (fuelConsumption.value * p98).toFixed(1);
      return {
        success:true,
        route:route
      }; // 計算成功
    }
    return false;
  } catch (error) {
    console.error('路線計算失敗:', error);
    throw error;
  }
};

// 暴露方法給父組件使用
defineExpose({ calculateRoute });
</script>

<style scoped>
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

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
}

.value {
  font-weight: bold;
  color:#444
}
</style>