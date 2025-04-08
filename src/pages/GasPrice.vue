<template>
  <div class="gas-price-container">
    <div class="header">
      <button class="back-button" @click="handleBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1>油耗計算</h1>
      
    </div>
    <oilPrice id="oilPrice" />
    <SearchPanel
      v-model:startAddress="startAddress"
      v-model:endAddress="endAddress"
      v-model:activeInput="activeInput"
      :startPoint="startPoint"
      :endPoint="endPoint"
      :isLoading="isLoading"
      :hasRoute="hasRoute"
      @calculate="handleCalculate"
      @update:hasRoute="handleHasRouteUpdate"
      @clear="handleClearRoute"
      @update:route="handleRouteUpdate"
    />
    
    
    <MapContainer
      :route="currentRoute"
      v-model:activeInput="activeInput"
      v-model:startAddress="startAddress"
      v-model:endAddress="endAddress"
      v-model:startPoint="startPoint"
      v-model:endPoint="endPoint"
    />
  </div>
</template>

<script setup>
  import MapContainer from '@/components/MapControls/MapContainer.vue';
  import SearchPanel from '@/components/MapControls/SearchPanel.vue';
  import oilPrice from '@/components/oilPrice.vue';

  import { ref } from 'vue';

  const activeInput = ref(null);
  const startAddress = ref('');
  const endAddress = ref('');
  const startPoint = ref(null);
  const endPoint = ref(null);
  const isLoading = ref(false);
  const hasRoute = ref(false);
  const currentRoute = ref(null);

  const handleRouteUpdate = (route) => {
    currentRoute.value = route;
  };

  const handleCalculate = (isCalculating) => {
    isLoading.value = isCalculating;
  };

  const handleHasRouteUpdate = (value) => {
    hasRoute.value = value;
  };
  
  const handleBack = () => {
    // 返回上一頁的邏輯
    window.history.back();
  };

  const handleClearRoute = (value) => {
    startAddress.value = '';
    endAddress.value = '';
    startPoint.value = null;
    endPoint.value = null;
    hasRoute.value = false;
  };
  
</script>

<style scoped>
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
    height: 3rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 10;
  }
  #oilPrice{
    position: fixed;
    right: 1rem;
    
  }
  .header {
  display: flex;
  align-items: center; /* 確保內容垂直居中 */
  padding: 1rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  padding: 8px;
  margin-right: 12px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: absolute;
  left: 5px;
}

.back-button:hover {
  background-color: #f0f0f0;
}

.back-button svg {
  display: block;
}

/* 調整油價顯示位置 */
#oilPrice {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

h1 {
  margin: 0;
  flex-grow: 1;
  text-align: center;
}
</style>