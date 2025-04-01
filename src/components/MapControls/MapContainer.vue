<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import tt from '@tomtom-international/web-sdk-maps';
  import '@tomtom-international/web-sdk-maps/dist/maps.css';
  
  // 地圖配置常數
  const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';
  const MAP_CONFIG = {
    center: [121.5654, 25.0330], // 台北預設中心點
    zoom: 12,
    style: 'https://api.tomtom.com/map/1/style/22.2.1-9/2/basic_street-light.json'
  };
  
  // 地圖實例和容器引用
  const mapContainer = ref(null);
  const mapInstance = ref(null);
  
  // 初始化地圖
  onMounted(() => {
    if (!mapContainer.value) return;
  
    // 創建地圖實例
    mapInstance.value = tt.map({
      key: API_KEY,
      container: mapContainer.value,
      ...MAP_CONFIG
    });
  
    // 添加基本控制項
    mapInstance.value.addControl(new tt.NavigationControl());
    mapInstance.value.addControl(new tt.FullscreenControl());
  
    // 處理窗口大小變化
    const resizeObserver = new ResizeObserver(() => {
      mapInstance.value?.resize();
    });
    resizeObserver.observe(mapContainer.value);
  
    // 組件卸載時清理
    onBeforeUnmount(() => {
      resizeObserver.disconnect();
    });
  });
  
  // 組件卸載時移除地圖
  onBeforeUnmount(() => {
    if (mapInstance.value) {
      mapInstance.value.remove();
    }
  });
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  /* 確保地圖容器在父層級正確擴展 */
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }
  </style>