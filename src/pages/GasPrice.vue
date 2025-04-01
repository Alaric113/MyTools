<template>
  <div class="gas-price-container">
    <div class="header">
      <h1>油耗計算</h1>
      <OilPrice id="oilPrice" />
    </div>
    
    <!-- 左上角浮動搜索面板 -->
    <div class="floating-search-panel">
      <div class="search-group">
        <label>出發地:</label>
        <input
          v-model="startAddress"
          @focus="setActiveInput('start')"
          @blur="onInputBlur"
          placeholder="輸入或點擊地圖選擇"
          readonly
        />
      </div>
      
      <div class="search-group">
        <label>目的地:</label>
        <input
          v-model="endAddress"
          @focus="setActiveInput('end')"
          @blur="onInputBlur"
          placeholder="輸入或點擊地圖選擇"
          readonly
        />
      </div>
      
      <div class="selection-hint" v-if="activeInput">
        正在選擇{{ activeInput === 'start' ? '出發地' : '目的地' }} - 請點擊地圖
      </div>
      
      <button 
        class="calculate-btn" 
        @click="calculateRoute"
        :disabled="!startPoint || !endPoint"
      >
        計算路線
      </button>
    </div>
    
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import OilPrice from '../components/oilPrice.vue';
import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

// 地圖相關變量
const mapContainer = ref(null);
const mapInstance = ref(null);
const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';

// 路線相關變量
const activeInput = ref(null);
const startAddress = ref('');
const endAddress = ref('');
const startPoint = ref(null);
const endPoint = ref(null);
const startMarker = ref(null);
const endMarker = ref(null);
const route = ref(null);

// 初始化地圖
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

  // 添加地圖點擊事件監聽
  mapInstance.value.on('click', handleMapClick);

  mapInstance.value.on('load', () => {
    setTimeout(() => mapInstance.value.resize(), 100);
  });
});

// 設置活動輸入框
const setActiveInput = (type) => {
  activeInput.value = type;
};

// 輸入框失去焦點處理
const onInputBlur = () => {
  setTimeout(() => {
    activeInput.value = null;
  }, 200);
};

// 地圖點擊處理 (修正版)
// 地圖點擊處理 (修正版)
const handleMapClick = async (e) => {
  if (!activeInput.value) return;

  const clickedPoint = {
    lng: e.lngLat.lng,
    lat: e.lngLat.lat
  };
  
  try {
    // 反向地理編碼獲取地址
    const response = await services.reverseGeocode({
      key: API_KEY,
      position: `${clickedPoint.lng},${clickedPoint.lat}`
    });
    
    if (response.addresses && response.addresses.length > 0) {
      const address = response.addresses[0].address.freeformAddress;
      
      // 根據當前激活的輸入框更新對應的值
      if (activeInput.value === 'start') {
        startAddress.value = address; // 確保更新到出發地輸入框
        setStartPoint(clickedPoint, address);
      } else if (activeInput.value === 'end') {
        endAddress.value = address; // 確保更新到目的地輸入框
        setEndPoint(clickedPoint, address);
      }
      
      // 重置選擇狀態
      activeInput.value = null;
    }
  } catch (error) {
    console.error('反向地理編碼錯誤:', error);
    const defaultAddress = `位置 (${clickedPoint.lng.toFixed(4)}, ${clickedPoint.lat.toFixed(4)})`;
    if (activeInput.value === 'start') {
      startAddress.value = defaultAddress;
      setStartPoint(clickedPoint, defaultAddress);
    } else {
      endAddress.value = defaultAddress;
      setEndPoint(clickedPoint, defaultAddress);
    }
    activeInput.value = null;
  }
};

// 設置起點 (修正版)
const setStartPoint = (point, address) => {
  // 確保只更新出發地相關變量
  startPoint.value = {
    lng: point.lng,
    lat: point.lat
  };
  startAddress.value = address; // 明確更新出發地地址
  
  updateMarker('start', point, address);
};

// 設置終點 (修正版)
const setEndPoint = (point, address) => {
  // 確保只更新目的地相關變量
  endPoint.value = {
    lng: point.lng,
    lat: point.lat
  };
  endAddress.value = address; // 明確更新目的地地址
  
  updateMarker('end', point, address);
};

// 更新標記
const updateMarker = (type, position, address) => {
  // 移除舊標記
  if (type === 'start' && startMarker.value) {
    startMarker.value.remove();
    startMarker.value = null;
  } else if (type === 'end' && endMarker.value) {
    endMarker.value.remove();
    endMarker.value = null;
  }
  
  // 創建新標記
  const marker = new tt.Marker({
    color: type === 'start' ? '#4CAF50' : '#F44336',
    draggable: true
  })
    .setLngLat([position.lng, position.lat])
    .setPopup(new tt.Popup().setHTML(`
      <div class="marker-popup">
        <strong>${type === 'start' ? '出發地' : '目的地'}</strong><br>
        ${address}
      </div>
    `))
    .addTo(mapInstance.value);
  
  // 保存標記引用
  if (type === 'start') {
    startMarker.value = marker;
  } else {
    endMarker.value = marker;
  }
  
  // 添加標記拖拽事件
  marker.on('dragend', () => {
    const newPos = marker.getLngLat();
    const newPoint = {
      lng: newPos.lng,
      lat: newPos.lat
    };
    
    if (type === 'start') {
      startPoint.value = newPoint;
      updateAddressAfterDrag('start', newPos);
    } else {
      endPoint.value = newPoint;
      updateAddressAfterDrag('end', newPos);
    }
  });
};

// 拖拽後更新地址
const updateAddressAfterDrag = async (type, newPos) => {
  try {
    const response = await services.reverseGeocode({
      key: API_KEY,
      position: `${newPos.lng},${newPos.lat}`
    });
    
    const address = response.addresses[0]?.address?.freeformAddress || 
                   `位置 (${newPos.lng.toFixed(4)}, ${newPos.lat.toFixed(4)})`;
    
    // 確保更新到正確的輸入框
    if (type === 'start') {
      startAddress.value = address;
    } else {
      endAddress.value = address;
    }
  } catch (error) {
    console.error('反向地理編碼錯誤:', error);
  }
};

// 計算路線
const calculateRoute = () => {
  if (!startPoint.value || !endPoint.value) {
    alert('請選擇出發地和目的地');
    return;
  }
  
  services.calculateRoute({
    key: API_KEY,
    locations: `${startPoint.value.lng},${startPoint.value.lat}:${endPoint.value.lng},${endPoint.value.lat}`,
    travelMode: 'car'
  })
  .then(response => {
    if (response.routes && response.routes.length > 0) {
      route.value = response.routes[0];
      displayRoute(route.value);
    } else {
      throw new Error('未找到有效路線');
    }
  })
  .catch(error => {
    console.error('路線計算錯誤:', error);
    alert('無法計算路線: ' + error.message);
  });
};

// 顯示路線
const displayRoute = (routeData) => {
  try {
    // 清除舊的路線
    if (mapInstance.value.getLayer('route')) {
      mapInstance.value.removeLayer('route');
      mapInstance.value.removeSource('route');
    }

    // 檢查路線數據
    if (!routeData.legs || routeData.legs.length === 0 || 
        !routeData.legs[0].points || routeData.legs[0].points.length === 0) {
      throw new Error('無效的路線數據');
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

  } catch (error) {
    console.error('顯示路線錯誤:', error);
    alert('顯示路線時發生錯誤: ' + error.message);
  }
};

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});
</script>

<style scoped>
/* 样式保持不变，与之前相同 */
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

.floating-search-panel {
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  width: 320px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.search-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

.search-group input:focus {
  outline: none;
  border-color: #1e90ff;
  box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2);
}

.selection-hint {
  font-size: 13px;
  color: #1e90ff;
  text-align: center;
  padding: 6px;
  background: rgba(30, 144, 255, 0.1);
  border-radius: 4px;
}

.calculate-btn {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.calculate-btn:hover {
  background-color: #3d8b40;
}

.calculate-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .floating-search-panel {
    width: calc(100% - 40px);
    top: 70px;
    left: 20px;
    right: 20px;
  }
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