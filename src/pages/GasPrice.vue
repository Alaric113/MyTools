<template>
  <div class="gas-price-container">
    <div class="header">
      <h1>油耗計算</h1>
      <oilPrice id="oilPrice" />
    </div>
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

    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 10;
  }
  #oilPrice{
    position: fixed;
    right: 1rem;
    
  }
</style>