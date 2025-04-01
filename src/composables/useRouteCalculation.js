import { ref } from 'vue';
import { services } from '@tomtom-international/web-sdk-services';

export function useRouteCalculation(mapInstance) {
  const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';
  const DEFAULT_CAR_FUEL_CONSUMPTION = 6;
  
  const route = ref(null);
  const isLoading = ref(false);
  const routeInfo = ref({
    distance: null,
    duration: null,
    fuelConsumption: null
  });
  
  const calculateRoute = async (startPoint, endPoint) => {
    if (!startPoint || !endPoint) {
      alert('請選擇出發地和目的地');
      return;
    }
    
    isLoading.value = true;
    routeInfo.value = { distance: null, duration: null, fuelConsumption: null };
    
    try {
      const response = await services.calculateRoute({
        key: API_KEY,
        locations: `${startPoint.lng},${startPoint.lat}:${endPoint.lng},${endPoint.lat}`,
        travelMode: 'car',
        traffic: true,
        departAt: 'now',
        instructionsType: 'text',
        language: 'zh-TW'
      });
      
      if (response.routes?.length > 0) {
        route.value = response.routes[0];
        updateRouteInfo(route.value);
        displayRoute(route.value);
      }
    } catch (error) {
      console.error('路線計算錯誤:', error);
      alert('無法計算路線: ' + (error.message || '未知錯誤'));
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateRouteInfo = (routeData) => {
    const summary = routeData.summary;
    routeInfo.value = {
      distance: (summary.lengthInMeters / 1000).toFixed(1),
      duration: Math.round(summary.travelTimeInSeconds / 60),
      fuelConsumption: (summary.lengthInMeters / 100000 * DEFAULT_CAR_FUEL_CONSUMPTION).toFixed(1)
    };
  };
  
  const displayRoute = (routeData) => {
    // 實現與之前相同的顯示路線邏輯
  };
  
  const clearRoute = () => {
    if (mapInstance.value?.getLayer('route')) {
      mapInstance.value.removeLayer('route');
      mapInstance.value.removeSource('route');
    }
    route.value = null;
    routeInfo.value = { distance: null, duration: null, fuelConsumption: null };
  };
  
  return { route, isLoading, routeInfo, calculateRoute, clearRoute };
}