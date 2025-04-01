<template>
  <div class="gas-price-container">
    <div class="header">
      <h1>油耗計算</h1>
      <OilPrice id="oilPrice" />
    </div>
    
    <RouteSearchPanel
      :start-address="startAddress"
      :end-address="endAddress"
      :active-input="activeInput"
      :start-point="startPoint"
      :end-point="endPoint"
      :is-loading="isLoading"
      :route="route"
      :route-info="routeInfo"
      @set-active-input="setActiveInput"
      @input-blur="onInputBlur"
      @calculate-route="handleCalculateRoute"
      @clear-route="clearRoute"
    />
    
    <MapContainer
      ref="mapContainer"
      :active-input="activeInput"
      :start-point="startPoint"
      :end-point="endPoint"
      :route="route"
      @map-click="handleMapClick"
      @update:start-point="(point) => startPoint = point"
      @update:end-point="(point) => endPoint = point"
      @update:start-address="(addr) => startAddress = addr"
      @update:end-address="(addr) => endAddress = addr"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import OilPrice from '../components/gas-price/oilPrice.vue';
import RouteSearchPanel from '../components/gas-price/RouteSearchPanel.vue';
import { useRouteCalculation } from '../composables/useRouteCalculation';
import MapContainer from '@/components/gas-price/MapContainer.vue';

// 路線計算
const { route, isLoading, routeInfo, calculateRoute, clearRoute } = useRouteCalculation();

// 本地狀態
const activeInput = ref(null);
const clickInProgress = ref(false);
const startAddress = ref('');
const endAddress = ref('');
const startPoint = ref(null);
const endPoint = ref(null);
const mapContainer = ref(null);

// 事件處理
const setActiveInput = (type) => {
  activeInput.value = type;
};

const onInputBlur = () => {
  setTimeout(() => {
    if (!clickInProgress.value) {
      activeInput.value = null;
    }
  }, 200);
};

const handleMapClick = async (e) => {
  if (!activeInput.value) return;

  clickInProgress.value = true;
  
  try {
    // 這裡可以添加加載指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = '正在處理...';
    document.body.appendChild(loadingIndicator);
    
    // 實際的點擊處理邏輯已經移到 MapContainer 中
    // 這裡只需要處理狀態變化
    if (activeInput.value === 'start') {
      startAddress.value = '正在獲取地址...';
    } else {
      endAddress.value = '正在獲取地址...';
    }
  } finally {
    clickInProgress.value = false;
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) document.body.removeChild(indicator);
  }
};

const handleCalculateRoute = () => {
  if (!startPoint.value || !endPoint.value) {
    alert('請選擇出發地和目的地');
    return;
  }
  calculateRoute(startPoint.value, endPoint.value);
};
</script>

<style scoped>
/* 保留你的樣式不變 */
.gas-price-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.header {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.map-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
}

#oilPrice {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 20;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  z-index: 2000;
  font-size: 14px;
}
</style>