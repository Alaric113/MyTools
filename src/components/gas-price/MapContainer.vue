<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import tt from '@tomtom-international/web-sdk-maps';
  import { services } from '@tomtom-international/web-sdk-services';
  import '@tomtom-international/web-sdk-maps/dist/maps.css';
  
  const props = defineProps({
    activeInput: String,
    startPoint: Object,
    endPoint: Object,
    route: Object
  });
  
  const emit = defineEmits([
    'map-click',
    'update:start-point',
    'update:end-point',
    'update:start-address',
    'update:end-address'
  ]);
  
  const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';
  const mapContainer = ref(null);
  const mapInstance = ref(null);
  const startMarker = ref(null);
  const endMarker = ref(null);
  
  // 初始化地圖
  onMounted(() => {
    if (!mapContainer.value) return;
  
    mapInstance.value = tt.map({
      key: API_KEY,
      container: mapContainer.value,
      center: [121.5654, 25.0330],
      zoom: 12,
      style: 'https://api.tomtom.com/map/1/style/22.2.1-9/2/basic_street-light.json'
    });
  
    mapInstance.value.addControl(new tt.NavigationControl());
    mapInstance.value.addControl(new tt.FullscreenControl());
    
    // 添加點擊事件監聽
    mapInstance.value.on('click', handleMapClick);
  
    // 監聽容器大小變化
    const resizeObserver = new ResizeObserver(() => {
      mapInstance.value?.resize();
    });
    resizeObserver.observe(mapContainer.value);
  
    onBeforeUnmount(() => {
      resizeObserver.disconnect();
    });
  });
  
  // 反向地理編碼函數
  const performReverseGeocode = async (point) => {
    try {
      const response = await services.reverseGeocode({
        key: API_KEY,
        position: `${point.lng},${point.lat}`,
        radius: 100,
        limit: 1
      });
      
      if (response.addresses?.length > 0) {
        return {
          formattedAddress: response.addresses[0].address.freeformAddress,
          details: response.addresses[0].address
        };
      }
      return null;
    } catch (error) {
      console.error('反向地理編碼錯誤:', error);
      return null;
    }
  };
  
  // 處理地圖點擊
  const handleMapClick = async (e) => {
    if (!props.activeInput) return;
    
    const clickedPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };
    const geocodeResult = await performReverseGeocode(clickedPoint);
    const address = geocodeResult?.formattedAddress || 
                  `位置 (${clickedPoint.lng.toFixed(4)}, ${clickedPoint.lat.toFixed(4)})`;
  
    if (props.activeInput === 'start') {
      updateMarker('start', clickedPoint, address, geocodeResult?.details);
      emit('update:start-point', clickedPoint);
      emit('update:start-address', address);
      console.log(address)
    } else {
      updateMarker('end', clickedPoint, address, geocodeResult?.details);
      emit('update:end-point', clickedPoint);
      emit('update:end-address', address);
    }
  
    emit('map-click', e);
  };
  
  // 更新標記
  const updateMarker = (type, position, address, details = null) => {
  // 確保 position 是普通對象，不是 reactive 代理
  const plainPosition = {
    lng: position.lng,
    lat: position.lat
  };

  const marker = type === 'start' ? startMarker : endMarker;
  
  // 移除舊標記
  if (marker.value) {
    try {
      marker.value.remove();
    } catch (error) {
      console.warn('移除標記時出錯:', error);
    }
  }

  // 創建新標記 - 使用普通對象
  const newMarker = new tt.Marker({
    color: type === 'start' ? '#4CAF50' : '#F44336',
    draggable: true
  }).setLngLat([plainPosition.lng, plainPosition.lat]);

  // 設置彈出窗口
  const popupContent = createPopupContent(type, address, details);
  newMarker.setPopup(new tt.Popup().setHTML(popupContent)).addTo(mapInstance.value);

  // 添加拖拽事件
  newMarker.on('dragend', async () => {
    const newPos = newMarker.getLngLat();
    const newPoint = { lng: newPos.lng, lat: newPos.lat };
    const geocodeResult = await performReverseGeocode(newPoint);
    const newAddress = geocodeResult?.formattedAddress || 
                      `位置 (${newPoint.lng.toFixed(4)}, ${newPoint.lat.toFixed(4)})`;
    
    if (type === 'start') {
      emit('update:start-point', newPoint);
      emit('update:start-address', newAddress);
    } else {
      emit('update:end-point', newPoint);
      emit('update:end-address', newAddress);
    }
    
    newMarker.getPopup().setHTML(createPopupContent(type, newAddress, geocodeResult?.details));
  });

  newMarker.togglePopup();
  
  // 保存標記引用 - 注意這裡保存的是原始標記對象
  if (type === 'start') {
    startMarker.value = newMarker;
  } else {
    endMarker.value = newMarker;
  }
};
  
  // 創建彈出窗口內容
  const createPopupContent = (type, address, details) => {
    let content = `<div class="marker-popup"><strong>${type === 'start' ? '出發地' : '目的地'}</strong><br>${address}`;
    
    if (details) {
      const additionalInfo = [
        details.municipalitySubdivision,
        details.municipality,
        details.countrySubdivision
      ].filter(Boolean);
      
      if (additionalInfo.length) {
        content += `<br><small>${additionalInfo.join(', ')}</small>`;
      }
    }
    
    return content + '</div>';
  };
  
  // 顯示路線
  const displayRoute = (routeData) => {
    if (!mapInstance.value) return;
  
    // 清除舊路線
    if (mapInstance.value.getLayer('route')) {
      mapInstance.value.removeLayer('route');
      mapInstance.value.removeSource('route');
    }
  
    // 檢查路線數據
    if (!routeData.legs || routeData.legs.length === 0 || 
        !routeData.legs[0].points || routeData.legs[0].points.length === 0) {
      console.error('無效的路線數據');
      return;
    }
  
    // 轉換為 GeoJSON 格式
    const routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeData.legs[0].points.map(point => [point.longitude, point.latitude])
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
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1e90ff',
        'line-width': 4
      }
    });
  
    // 調整視圖
    const bounds = new tt.LngLatBounds();
    routeGeoJSON.geometry.coordinates.forEach(coord => bounds.extend(coord));
    mapInstance.value.fitBounds(bounds, { padding: 50 });
  };
  
  // 監聽路線變化
  watch(() => props.route, (newRoute) => {
    if (newRoute) {
      displayRoute(newRoute);
    }
  });
  
  // 清除地圖標記和路線
  const clearMap = () => {
    if (startMarker.value) startMarker.value.remove();
    if (endMarker.value) endMarker.value.remove();
    if (mapInstance.value?.getLayer('route')) {
      mapInstance.value.removeLayer('route');
      mapInstance.value.removeSource('route');
    }
  };
  
  onBeforeUnmount(() => {
    clearMap();
    if (mapInstance.value) {
      mapInstance.value.remove();
    }
  });
  
  // 暴露方法給父組件
  defineExpose({
    clearMap
  });
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  :deep(.marker-popup) {
    font-size: 14px;
    line-height: 1.4;
    padding: 8px;
  }
  
  :deep(.mapboxgl-popup-close-button) {
    font-size: 18px;
    padding: 4px 8px;
  }
  </style>