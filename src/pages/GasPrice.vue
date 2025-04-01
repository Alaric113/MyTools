<template>
  <div class="gas-price-container">
    <div class="header">
      <h1>油耗計算</h1>
      <oilPrice id="oilPrice" />
    </div>
    <SearchPanel />
    
   
    <MapContainer/>
  </div>
</template>

<script setup>
  import MapContainer from '@/components/MapControls/MapContainer.vue';
import SearchPanel from '@/components/MapControls/SearchPanel.vue';
  import oilPrice from '@/components/oilPrice.vue';
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
  #oilPrice{
    position: fixed;
    right: 1rem;
    
  }
</style>