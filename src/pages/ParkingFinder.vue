<template>
    <div  class="finder-container">
        <div class="header">
            <button class="back-button" @click="handleBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>
            <h1>台北市路邊即時停車位</h1>
        </div>

        <MapContainer/>
    </div>
    
</template>

<script setup>
import MapContainer from '@/components/MapControls/MapContainer.vue';
import { getParkingData, parkingData } from '@/api';
import { ref } from 'vue';

const center = ref()

const handleBack = () => {
    // 返回上一頁的邏輯
    window.history.back();
  };

console.log(getParkingData(121.2222,25.2222).data)
</script>

<style scoped>
.finder-container {
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
  display: flex;
  align-items: center; /* 確保內容垂直居中 */
  padding: 1rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
  height: 3rem;
}

.back-button {
  background: none;
  border: none;
  padding: 8px;
  margin-right: 12px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: absolute;
  left: 5px;
}

.back-button:hover {
  background-color: #f0f0f0;
}

.back-button svg {
  display: block;
}
h1 {
  margin: 0;
  flex-grow: 1;
  text-align: center;
}

</style>