import { services } from '@tomtom-international/web-sdk-services';

export function useAddressHandling() {
  const API_KEY = '9EKBnyQjcyZBnee9HAOKrOXCxltu2htL';
  
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
  
  return { performReverseGeocode };
}