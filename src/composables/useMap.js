import { ref, onMounted, onBeforeUnmount } from 'vue';
import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

export function useMap(containerRef) {
  const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';
  const mapInstance = ref(null);
  
  const initMap = () => {
    if (!containerRef.value) return;
    
    mapInstance.value = tt.map({
      key: API_KEY,
      container: containerRef.value,
      center: [121.5654, 25.0330],
      zoom: 12,
      style: 'https://api.tomtom.com/map/1/style/22.2.1-9/2/basic_street-light.json'
    });
    
    mapInstance.value.addControl(new tt.NavigationControl());
    mapInstance.value.addControl(new tt.FullscreenControl());
    
    const resizeObserver = new ResizeObserver(() => {
      mapInstance.value?.resize();
    });
    resizeObserver.observe(containerRef.value);
    
    return resizeObserver;
  };
  
  onMounted(() => {
    const resizeObserver = initMap();
    
    onBeforeUnmount(() => {
      resizeObserver.disconnect();
      if (mapInstance.value) {
        mapInstance.value.remove();
      }
    });
  });
  
  return { mapInstance };
}