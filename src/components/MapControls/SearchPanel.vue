<template>
    <div class="floating-search-panel">
      <div class="search-group">
        <label>出發地:</label>
        <input
          
          placeholder="輸入或點擊地圖選擇"
        
        />
      </div>
      
      <div class="search-group">
        <label>目的地:</label>
        <input
          
          placeholder="輸入或點擊地圖選擇"
          
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
        @click="emit('calculate')"
        :disabled="!startPoint || !endPoint || isLoading"
      >
        <span v-if="!isLoading">計算路線</span>
        <span v-else>計算中...</span>
      </button>
      
      <button 
        class="clear-btn" 
        @click="emit('clear')"
        :disabled="!hasRoute"
      >
        清除路線
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const emit = defineEmits(['calculate', 'clear', 'update:activeInput']);
  
  const props = defineProps({
    startAddress: String,
    endAddress: String,
    startPoint: Object,
    endPoint: Object,
    routeInfo: {
      type: Object,
      default: () => ({
        distance: null,
        duration: null,
        fuelConsumption: null
      })
    },
    isLoading: Boolean,
    hasRoute: Boolean,
    activeInput: String
  });
  
  const setActiveInput = (type) => {
    emit('update:activeInput', type);
  };
  
  const onInputBlur = () => {
    // 這裡保留原來的邏輯，但可以通過父組件處理
    emit('update:activeInput', null);
  };
  </script>
  
  <style scoped>
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
  
  @media (max-width: 768px) {
    .floating-search-panel {
      width: calc(100% - 40px);
      top: 70px;
      left: 20px;
      right: 20px;
    }
  }
  </style>