<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import tt from '@tomtom-international/web-sdk-maps';
  import '@tomtom-international/web-sdk-maps/dist/maps.css';
  import { services } from '@tomtom-international/web-sdk-services';

  const emit =defineEmits([
    'update:startAddress',
    'update:endAddress',
    'update:activeInput',
    'update:center'
  ])
  
  const props = defineProps({
    activeInput: String,
    startAddress: String,
    endAddress: String,
    route:Object,
    center:Object
  });

  
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

 

  // 反向地理編碼函數 (獨立出來方便重用)
  const reverseGeocode = async (point) => {
    try {
      const response = await services.reverseGeocode({
        key: API_KEY,
        position: `${point.lng},${point.lat}`,
        language: 'zh-TW'
      });
      
      return response.addresses?.[0]?.address?.freeformAddress || 
            `位置 (${point.lng.toFixed(4)}, ${point.lat.toFixed(4)})`;
    } catch (error) {
      console.error('地理編碼失敗:', error);
      return `位置 (${point.lng.toFixed(4)}, ${point.lat.toFixed(4)})`;
    }
  };

  const handleMapClick = async (e) => {
    if (!props.activeInput) return ;

     // 清除選擇狀態
    
    const point = { lng: e.lngLat.lng, lat: e.lngLat.lat };
    const address = await reverseGeocode(point);


    if(props.activeInput === 'start'){
      emit('update:startAddress', address);
      emit('update:startPoint', point);

    }else{
      
      emit('update:endAddress', address);
      emit('update:endPoint', point);

    }
    emit('update:activeInput', null);
    
  };
  
  
  // 初始化地圖
  onMounted(() => {
    if (!mapContainer.value) return;
  
    // 創建地圖實例
    mapInstance.value = tt.map({
      key: API_KEY,
      container: mapContainer.value,
      ...MAP_CONFIG
    });

     // 在 onMounted 的地圖初始化代碼後添加：
    mapInstance.value.on('moveend', () => {
      const center = mapInstance.value.getCenter();
      emit('update:center',center)
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
    mapInstance.value.on('click', handleMapClick);
  });
  
  // 組件卸載時移除地圖
  onBeforeUnmount(() => {
    if (mapInstance.value) {
      mapInstance.value.remove();
    }
  });
  const drawRoute = (routeData) => {
  if (!mapInstance.value || !routeData) return;

  // 清除舊路線
  if (mapInstance.value.getLayer('route')) {
    mapInstance.value.removeLayer('route');
    mapInstance.value.removeSource('route');
  }

  // 轉換為 GeoJSON 格式
  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routeData.legs[0].points.map(point => 
        [point.longitude, point.latitude]
      )
    }
  };

  // 添加路線源
  mapInstance.value.addSource('route', {
    type: 'geojson',
    data: routeGeoJSON
  });

  // 添加路線圖層
  mapInstance.value.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    paint: {
      'line-color': '#1e90ff',
      'line-width': 4
    }
  });

  // 自動調整視圖
  const bounds = new tt.LngLatBounds();
  routeGeoJSON.geometry.coordinates.forEach(coord => {
    bounds.extend(coord);
  });
  mapInstance.value.fitBounds(bounds, { padding: 50 });
};

// 監聽 route 變化
watch(() => props.route, (newRoute) => {
  drawRoute(newRoute);
}, { deep: true });

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