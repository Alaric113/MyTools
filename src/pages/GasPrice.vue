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
      
      <div class="route-info" v-if="routeInfo.distance">
        <div class="info-item">
          <span class="label">距離:</span>
          <span class="value">{{ routeInfo.distance }} km</span>
        </div>
        <div class="info-item">
          <span class="label">時間:</span>
          <span class="value">{{ routeInfo.duration }} 分鐘</span>
        </div>
        <div class="info-item">
          <span class="label">預估油耗:</span>
          <span class="value">{{ routeInfo.fuelConsumption }} 升</span>
        </div>
      </div>
      
      <button 
        class="calculate-btn" 
        @click="calculateRoute"
        :disabled="!startPoint || !endPoint || isLoading"
      >
        <span v-if="!isLoading">計算路線</span>
        <span v-else>計算中...</span>
      </button>
      
      <button 
        class="clear-btn" 
        @click="clearRoute"
        :disabled="!route"
      >
        清除路線
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

// 常量配置
const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';
const MAP_CONFIG = {
  center: [121.5654, 25.0330],
  zoom: 12,
  style: 'https://api.tomtom.com/map/1/style/22.2.1-9/2/basic_street-light.json'
};

// 地图相关
const mapContainer = ref(null);
const mapInstance = ref(null);

// 路线相关
const activeInput = ref(null);
const clickInProgress = ref(false);
const startAddress = ref('');
const endAddress = ref('');
const startPoint = ref(null);
const endPoint = ref(null);
const startMarker = ref(null);
const endMarker = ref(null);
const route = ref(null);
const isLoading = ref(false);
const DEFAULT_CAR_FUEL_CONSUMPTION = 6

// 路线信息
const routeInfo = ref({
  distance: null,
  duration: null,
  fuelConsumption: null,
  totalPrice:null
});

// 初始化地图
onMounted(() => {
  if (!mapContainer.value) return;

  mapInstance.value = tt.map({
    key: API_KEY,
    container: mapContainer.value,
    ...MAP_CONFIG
  });

  mapInstance.value.addControl(new tt.NavigationControl());
  mapInstance.value.addControl(new tt.FullscreenControl());
  
  mapInstance.value.on('click', handleMapClick);
  
  const resizeObserver = new ResizeObserver(() => {
    mapInstance.value?.resize();
  });
  resizeObserver.observe(mapContainer.value);

  onBeforeUnmount(() => {
    resizeObserver.disconnect();
  });
});

// 改进的反向地理编码函数
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

// 设置活动输入框
const setActiveInput = (type) => {
  activeInput.value = type;
};

// 输入框失去焦点处理
const onInputBlur = () => {
  setTimeout(() => {
    if (!clickInProgress.value) {
      activeInput.value = null;
    }
  }, 200);
};

// 修复后的地图点击处理函数
const handleMapClick = async (e) => {
  if (!activeInput.value) return;

  clickInProgress.value = true;
  const clickedPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };
  
  try {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = '正在獲取地址...';
    document.body.appendChild(loadingIndicator);
    
    const geocodeResult = await performReverseGeocode(clickedPoint);
    const address = geocodeResult?.formattedAddress || 
                  `位置 (${clickedPoint.lng.toFixed(4)}, ${clickedPoint.lat.toFixed(4)})`;
    
    // 使用 try-catch 包裹标记更新逻辑
    try {
      if (activeInput.value === 'start') {
        startAddress.value = address;
        setStartPoint(clickedPoint, address, geocodeResult?.details);
      } else {
        endAddress.value = address;
        setEndPoint(clickedPoint, address, geocodeResult?.details);
      }
    } catch (markerError) {
      console.warn('标记更新时出现非关键错误:', markerError);
    }
    
  } catch (error) {
    console.error('處理地圖點擊錯誤:', error);
  } finally {
    activeInput.value = null;
    clickInProgress.value = false;
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) document.body.removeChild(indicator);
  }
};

// 设置起点
const setStartPoint = (point, address, details = null) => {
  startPoint.value = { lng: point.lng, lat: point.lat };
  safeUpdateMarker('start', point, address, details);
};

// 设置终点
const setEndPoint = (point, address, details = null) => {
  endPoint.value = { lng: point.lng, lat: point.lat };
  safeUpdateMarker('end', point, address, details);
};

// 安全的标记更新函数
const safeUpdateMarker = (type, position, address, details = null) => {
  try {
    // 移除旧标记
    const oldMarker = type === 'start' ? startMarker.value : endMarker.value;
    if (oldMarker) {
      try {
        oldMarker.remove();
      } catch (removeError) {
        console.warn('移除标记时出错:', removeError);
      }
    }

    // 创建新标记
    const marker = new tt.Marker({
      color: type === 'start' ? '#4CAF50' : '#F44336',
      draggable: true
    }).setLngLat([position.lng, position.lat]);

    // 设置弹出窗口内容
    const popupContent = createPopupContent(type, address, details);
    marker.setPopup(new tt.Popup().setHTML(popupContent)).addTo(mapInstance.value);

    // 保存标记引用
    if (type === 'start') {
      startMarker.value = marker;
    } else {
      endMarker.value = marker;
    }

    // 添加拖拽事件
    setupMarkerDragEvents(marker, type);
    marker.togglePopup();

  } catch (error) {
    console.error('更新标记时出错:', error);
    throw error;
  }
};

// 创建弹出窗口内容
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

// 设置标记拖拽事件
const setupMarkerDragEvents = (marker, type) => {
  marker.on('dragend', async () => {
    const newPos = marker.getLngLat();
    const newPoint = { lng: newPos.lng, lat: newPos.lat };
    const updateFn = type === 'start' ? 
      (addr) => { startAddress.value = addr; startPoint.value = newPoint; } : 
      (addr) => { endAddress.value = addr; endPoint.value = newPoint; };

    try {
      const geocodeResult = await performReverseGeocode(newPoint);
      const newAddress = geocodeResult?.formattedAddress || 
                        `位置 (${newPoint.lng.toFixed(4)}, ${newPoint.lat.toFixed(4)})`;
      
      updateFn(newAddress);
      marker.getPopup().setHTML(createPopupContent(type, newAddress, geocodeResult?.details));
    } catch (error) {
      console.error('拖拽后更新地址出错:', error);
    }
  });
};
// 改进的路线计算函数
const calculateRoute = async () => {
  if (!startPoint.value || !endPoint.value) {
    alert('請選擇出發地和目的地');
    return;
  }
  
  isLoading.value = true;
  routeInfo.value = {
    distance: null,
    duration: null,
    fuelConsumption: null
  };
  
  // 显示加载指示器
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.textContent = '正在計算路線...';
  document.body.appendChild(loadingIndicator);
  
  try {
    const response = await services.calculateRoute({
      key: API_KEY,
      locations: `${startPoint.value.lng},${startPoint.value.lat}:${endPoint.value.lng},${endPoint.value.lat}`,
      travelMode: 'car',
      traffic: true,
      departAt: 'now',
      instructionsType: 'text',
      language: 'zh-TW'
    });
    
    if (response.routes && response.routes.length > 0) {
      route.value = response.routes[0];
      displayRoute(route.value);
      
      // 更新路线信息
      const summary = route.value.summary;
      routeInfo.value = {
        distance: (summary.lengthInMeters / 1000).toFixed(1),
        duration: Math.round(summary.travelTimeInSeconds / 60),
        fuelConsumption: (summary.lengthInMeters / 100000 * DEFAULT_CAR_FUEL_CONSUMPTION).toFixed(1)
      };
    } else {
      throw new Error('未找到有效路線');
    }
  } catch (error) {
    console.error('路線計算錯誤:', error);
    alert('無法計算路線: ' + (error.message || '未知錯誤'));
  } finally {
    isLoading.value = false;
    document.body.removeChild(loadingIndicator);
  }
};

// 清除路线
const clearRoute = () => {
  if (mapInstance.value.getLayer('route')) {
    mapInstance.value.removeLayer('route');
    mapInstance.value.removeSource('route');
  }
  route.value = null;
  routeInfo.value = {
    distance: null,
    duration: null,
    fuelConsumption: null
  };
};

// 显示路线
const displayRoute = (routeData) => {
  try {
    // 清除旧路线
    if (mapInstance.value.getLayer('route')) {
      mapInstance.value.removeLayer('route');
      mapInstance.value.removeSource('route');
    }

    // 检查路线数据
    if (!routeData.legs || routeData.legs.length === 0 || 
        !routeData.legs[0].points || routeData.legs[0].points.length === 0) {
      throw new Error('無效的路線數據');
    }

    // 转换为 GeoJSON 格式
    const routeGeoJSON = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeData.legs[0].points.map(point => [point.longitude, point.latitude])
      }
    };

    // 添加路线源
    mapInstance.value.addSource('route', {
      type: 'geojson',
      data: routeGeoJSON
    });

    // 添加路线图层
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

    // 调整视图
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

.clear-btn {
  padding: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background-color: #d32f2f;
}

.clear-btn:disabled {
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