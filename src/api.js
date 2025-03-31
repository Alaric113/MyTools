import { ref } from 'vue';


export const oilPrices=ref([])
try {
  const response = await fetch(
    'https://corsproxy.io/https://vipmbr.cpc.com.tw/openData/SixtypeOilListPrice'
  );
  const data = await response.json(); // Add .json() to parse the response
  const targetOilNames = ['98無鉛汽油', '95無鉛汽油', '92無鉛汽油'];
  oilPrices.value = data.filter((price) =>
    targetOilNames.includes(price.產品名稱)
  );
  console.log(oilPrices)
} catch (error) {
  console.error('獲取油價失敗:', error);
}