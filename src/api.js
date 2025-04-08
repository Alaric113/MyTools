import { ref } from 'vue';

export const oilPrices = ref([]);
export const parkingData = ref([]);


export async function fetchOilPrices() {
  try {
    const response = await fetch(
      'https://corsproxy.io/https://vipmbr.cpc.com.tw/openData/SixtypeOilListPrice'
    );
    const data = await response.json();
    const targetOilNames = ['98無鉛汽油', '95無鉛汽油', '92無鉛汽油'];
    oilPrices.value = data.filter((price) =>
      targetOilNames.includes(price.產品名稱)
    );
  } catch (error) {
    console.error('獲取油價失敗:', error);
  }
}

export async function getParkingData(lat,lon){


  const proxyUrl = 'https://corsproxy.io/'; // 更換為其他代理服務
  const targetUrl = 'https://Parking.pma.gov.taipei/MapAPI/GetAllPOIData';
    const url = proxyUrl + targetUrl; // 組合 URL

    const payload = new URLSearchParams({
        lon: lon,
        lat: lat,
        catagory: 'car',
        type: 1
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        if (response.ok) {
            const data = await response.json();
            console.log('成功從 API 獲取數據');
            originalData = data;
            parkingData.value = data;
            return data;
            
        }
    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
}