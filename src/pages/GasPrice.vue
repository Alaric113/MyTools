<template>
  <div class="gas-price-container">
    <div class="header">
      <h1>油耗計算</h1>
      <OilPrice id="oilPrice" />
    </div>
    
    <!-- 浮動搜索框 -->
    <div class="floating-search">
      <div class="search-group">
        <input
          v-model="startAddress"
          @input="handleAddressInput('start')"
          @focus="showStartResults = true"
          @blur="setTimeout(() => { showStartResults = false }, 200)"
          placeholder="出發地"
        />
        <div v-if="showStartResults && startResults.length" class="dropdown-results">
          <div
            v-for="(result, index) in startResults"
            :key="index"
            class="result-item"
            @mousedown="selectResult(result, 'start')"
          >
            {{ result.address.freeformAddress }}
            <span v-if="result.poi && result.poi.name" class="poi-name">
              ({{ result.poi.name }})
            </span>
          </div>
        </div>
      </div>
      
      <div class="search-group">
        <input
          v-model="endAddress"
          @input="handleAddressInput('end')"
          @focus="showEndResults = true"
          @blur="setTimeout(() => { showEndResults = false }, 200)"
          placeholder="目的地"
        />
        <div v-if="showEndResults && endResults.length" class="dropdown-results">
          <div
            v-for="(result, index) in endResults"
            :key="index"
            class="result-item"
            @mousedown="selectResult(result, 'end')"
          >
            {{ result.address.freeformAddress }}
            <span v-if="result.poi && result.poi.name" class="poi-name">
              ({{ result.poi.name }})
            </span>
          </div>
        </div>
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
const startAddress = ref('');
const endAddress = ref('');
const startPoint = ref(null);
const endPoint = ref(null);
const startResults = ref([]);
const endResults = ref([]);
const showStartResults = ref(false);
const showEndResults = ref(false);
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

  mapInstance.value.on('load', () => {
    setTimeout(() => mapInstance.value.resize(), 100);
  });
});

// 地址輸入處理
const handleAddressInput = async (type) => {
  const query = type === 'start' ? startAddress.value : endAddress.value;
  if (query.length < 3) {
    if (type === 'start') startResults.value = [];
    else endResults.value = [];
    return;
  }

  try {
    const response = await services.fuzzySearch({
      key: API_KEY,
      query: query,
      center: mapInstance.value.getCenter(),
      radius: 10000,
      limit: 5 // 限制結果數量
    });

    if (type === 'start') {
      startResults.value = response.results;
    } else {
      endResults.value = response.results;
    }
  } catch (error) {
    console.error('搜索錯誤:', error);
  }
};

// 選擇結果
const selectResult = (result, type) => {
  const position = result.position;
  
  if (type === 'start') {
    startPoint.value = position;
    startAddress.value = result.address.freeformAddress;
    startResults.value = [];
  } else {
    endPoint.value = position;
    endAddress.value = result.address.freeformAddress;
    endResults.value = [];
  }
  
  // 在地圖上添加標記
  const marker = new tt.Marker({
    color: type === 'start' ? '#4CAF50' : '#F44336'
  })
    .setLngLat([position.lng, position.lat])
    .addTo(mapInstance.value);
  
  // 添加標記標籤
  if (result.poi && result.poi.name) {
    marker.setPopup(new tt.Popup().setHTML(
      `<div><strong>${result.poi.name}</strong><br>${result.address.freeformAddress}</div>`
    ));
  }
  
  // 移動視圖到選定位置
  mapInstance.value.flyTo({
    center: [position.lng, position.lat],
    zoom: 14
  });
};

// 計算路線 (保持原有實現)
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
    route.value = response.routes[0];
    displayRoute(route.value);
  })
  .catch(error => {
    console.error('路線計算錯誤:', error);
    alert('無法計算路線，請檢查地址');
  });
};

// 顯示路線 (保持原有實現)
const displayRoute = (routeData) => {
  // 清除舊的路線
  if (mapInstance.value.getLayer('route')) {
    mapInstance.value.removeLayer('route');
    mapInstance.value.removeSource('route');
  }

  // 轉換 TomTom 路線數據為 GeoJSON 格式
  const routeGeoJSON = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: routeData.legs[0].points.map(point => [point.longitude, point.latitude])
    }
  };

  // 添加新路線
  mapInstance.value.addSource('route', {
    type: 'geojson',
    data: routeGeoJSON
  });

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

  // 調整視圖以包含整個路線
  const coordinates = routeGeoJSON.geometry.coordinates;
  const bounds = new tt.LngLatBounds();
  coordinates.forEach(coord => bounds.extend(coord));
  mapInstance.value.fitBounds(bounds, { padding: 50 });
};

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});
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
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

/* 浮動搜索框樣式 */
.floating-search {
  position: absolute;
  top: 80px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-group {
  position: relative;
}

.floating-search input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.floating-search input:focus {
  outline: none;
  border-color: #1e90ff;
  box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2);
}

/* 下拉清單樣式 */
.dropdown-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1001;
}

.result-item {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.result-item:hover {
  background-color: #f5f5f5;
}

.poi-name {
  color: #666;
  font-size: 0.9em;
}

.calculate-btn {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 5px;
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
  .floating-search {
    width: calc(100% - 40px);
    top: 70px;
    left: 20px;
    right: 20px;
  }
  
  .dropdown-results {
    max-height: 200px;
  }
}
</style>