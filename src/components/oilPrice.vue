<template >
    <div class="oilContainer">
        <div class="oiltype" v-if="oilPrices.length > 0" v-for="price in oilPrices" :key="price.產品名稱">
            <h1>{{ fw(price.產品名稱) }}</h1>
            <p>{{ price.參考牌價 }}</p>
        </div>
        <p v-else>載入中...</p>
    </div>
    
    
</template>

<script setup>
import { oilPrices } from '@/api';
function fw(productName){
    if (productName && productName.length >= 2) {
    return productName.substring(0, 2);
  } else {
    return productName; // 如果名稱長度不足 2，則返回完整名稱
  }
}

</script>

<style scoped>
.oilContainer{
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 30px;
  padding: 5px;
}
.oiltype{
  margin: 0 5px;
  text-align: center;
}
.oiltype h1{
    border-bottom: 1px solid #ccc;
}
</style>