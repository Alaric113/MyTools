<template>
  <div class="floating-search-panel">
    <div class="search-group">
      <label>出發地:</label>
      <input
        :value="startAddress"  
        @input="$emit('update:startAddress', $event.target.value)" 
        @focus="$emit('set-active-input', 'start')"
        @blur="$emit('input-blur')"
        placeholder="輸入或點擊地圖選擇"
        readonly
      />
    </div>
    
    <div class="search-group">
      <label>目的地:</label>
      <input
        :value="endAddress"  
        @input="$emit('update:endAddress', $event.target.value)"  
        @focus="$emit('set-active-input', 'end')"
        @blur="$emit('input-blur')"
        placeholder="輸入或點擊地圖選擇"
        readonly
      />
    </div>
      
      <div class="selection-hint" v-if="activeInput">
        正在選擇{{ activeInput === 'start' ? '出發地' : '目的地' }} - 請點擊地圖
      </div>
      
      <RouteInfoDisplay
        v-if="routeInfo.distance"
        :distance="routeInfo.distance"
        :duration="routeInfo.duration"
        :fuel-consumption="routeInfo.fuelConsumption"
      />
      
      <button 
        class="calculate-btn" 
        @click="$emit('calculate-route')"
        :disabled="!startPoint || !endPoint || isLoading"
      >
        <span v-if="!isLoading">計算路線</span>
        <span v-else>計算中...</span>
      </button>
      
      <button 
        class="clear-btn" 
        @click="$emit('clear-route')"
        :disabled="!route"
      >
        清除路線
      </button>
    </div>
  </template>
  
  <script setup>
  import RouteInfoDisplay from './RouteInfoDisplay.vue';
  
  const props = defineProps({
    startAddress: String,
    endAddress: String,
    activeInput: String,
    startPoint: Object,
    endPoint: Object,
    isLoading: Boolean,
    route: Object,
    routeInfo: Object
  });
  
  defineEmits([
    'set-active-input',
    'input-blur',
    'calculate-route',
    'clear-route'
  ]);
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
  </style>