<template>
  <div class="floating-search-panel">
    <div class="search-group">
      <label>出發地:</label>
      <input
        :value="startAddress"
        placeholder="輸入或點擊地圖選擇"
        @focus="setActiveInput('start')"
       
      />
    </div>
    
    <div class="search-group">
      <label>目的地:</label>
      <input
        :value="endAddress"
        @focus="setActiveInput('end')"
        
        placeholder="輸入或點擊地圖選擇"
        
      />
    </div>
    
    <div class="selection-hint" v-if="activeInput">
      正在選擇{{ activeInput === 'start' ? '出發地' : '目的地' }} - 請點擊地圖
    </div>
    
    <RouteInfo
      ref="routeInfoRef"
      v-show="hasRoute"
      :startPoint="startPoint"
      :endPoint="endPoint"
      @calculate="emit('calculate')"
    />
    <div class="button-group">
      <button 
        class="calculate-btn" 
        @click="handleCalculate"
        :disabled="!startPoint || !endPoint || isLoading" 
      >
        <span v-if="!isLoading">計算路線</span>
        <span v-else>計算中...</span>
      </button>
      
      <button 
        class="clear-btn" 
        @click="handleClear"
        :disabled="!hasRoute"
      >
        清除路線
      </button>
    </div>
    
  </div>
</template>

<script setup>
  import RouteInfo from './RouteInfo.vue';
  import { ref, onMounted } from 'vue';
  
  const props = defineProps({
    startAddress: String,
    endAddress: String,
    activeInput: String,
    startPoint: Object,
    endPoint: Object,
    isLoading: Boolean
  });
  
  const emit = defineEmits([
    'update:activeInput',
    'update:hasRoute',
    'calculate',
    'clear'
  ]);
  
  const routeInfoRef = ref(null);
  const hasRoute = ref(false);
  
  const setActiveInput = (type) => {
    emit('update:activeInput', type);
  };
  
  const handleCalculate = async () => {
    if (!props.startPoint || !props.endPoint) return;
    
    emit('calculate', true); // 開始計算
  
    try {
      
      const success = await routeInfoRef.value.calculateRoute(
        props.startPoint,
        props.endPoint
      );
      
      if (success.success){
        hasRoute.value = success;
        emit('update:hasRoute', success);
        emit('update:route',success.route); // 更新路線資訊
      }
      
    } catch (error) {
      hasRoute.value = false;
      emit('update:hasRoute', false);
    } finally {
      emit('calculate', false); // 結束計算
    }
  };
  
  const handleClear = () => {
    hasRoute.value = false;
    emit('update:hasRoute', false);
    emit('clear');
  };
  </script>

<style scoped>
.floating-search-panel {
  position: absolute;
  top: 90px;
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
.button-group {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  
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
  flex: 1;
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
  flex: 1;
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
  position: fixed;
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
  transform: translateY(0);
  animation: slideUp 0.3s ease;
}

.button-group {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  flex-direction: row-reverse;
  gap:16px;
};

/* 添加拖拽手柄 */
.bottom-sheet::before {
  content: '';
  display: block;
  width: 40px;
  height: 4px;
  background: #ccc;
  border-radius: 2px;
  margin: 8px auto;
}

/* 滑入動畫 */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
}
</style>