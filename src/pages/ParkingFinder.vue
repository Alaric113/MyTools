// parking-finder.vue
<template>
  <div class="gas-price-container">
    <div class="header">
      <h1>油耗計算</h1>
      <OilPrice id="oilPrice" />
    </div>
    <div class="map-wrapper">
      <div ref="mapContainer" class="map-container"></div>
      <div class="search">

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import OilPrice from '../components/gas-price/oilPrice.vue';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';

const mapContainer = ref(null);
const mapInstance = ref(null);
const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';

onMounted(() => {
  if (!mapContainer.value) return;

  mapInstance.value = tt.map({
    key: API_KEY,
    container: mapContainer.value,
    center: [121.5654, 25.0330],
    zoom: 12,
    style: 'https://api.tomtom.com/map/1/style/22.2.1-9/2/basic_street-light.json?key=' + API_KEY
  });

  mapInstance.value.addControl(new tt.NavigationControl());
  mapInstance.value.addControl(new tt.FullscreenControl());

  mapInstance.value.on('load', () => {
    console.log('地圖加載成功');
    // 確保地圖填滿容器
    setTimeout(() => mapInstance.value.resize(), 100);
  });
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});
</script>

<style scoped>
/* 重置基本佈局 */
.gas-price-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.header {
  flex-shrink: 0; /* 防止header被壓縮 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  position: relative;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.map-wrapper {
  flex: 1; /* 佔用剩餘空間 */
  position: relative;
  width: 100%;
  height: calc(100vh - 60px); /* 減去header高度 */
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

#oilPrice {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 20;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>