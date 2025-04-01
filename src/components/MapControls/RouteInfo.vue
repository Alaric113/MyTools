<template></template>
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
</div>
</template>