// pages/Home.vue
<template>
  <div class="home">
    <h1 class="page-title">工具列表</h1>
    <div class="tools-grid">
      <ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :tool-name="tool.name"
        :route-name="tool.routeName"
        :preview-component="tool.previewComponent"
      />
    </div>
  </div>
</template>

<script setup>
import ToolCard from '@/components/ToolCard.vue'
import OilPrice from '@/components/oilPrice.vue'

const tools = [
  {
    id: 1,
    name: '油價查詢',
    routeName: 'gas-price',
    previewComponent: OilPrice
  },
  {
    id: 2,
    name: '停車場查詢',
    routeName: 'parking-finder',
    previewComponent: null
  }
]
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}
</style>