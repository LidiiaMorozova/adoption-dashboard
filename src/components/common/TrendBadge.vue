<script setup lang="ts">
import {ArrowTrendingDownIcon, ArrowTrendingUpIcon} from '@heroicons/vue/24/outline';
import type {Trend} from '@/types/dashboard';

defineProps<{
  trend: Trend;
  caption: string;
  color: string;
  backgroundColor: string;
}>();
</script>

<template>
  <div class="trend-badge" :style="{ backgroundColor, color }">
    <ArrowTrendingUpIcon v-if="trend === 'up'" class="trend-icon" aria-hidden="true"/>
    <ArrowTrendingDownIcon v-else-if="trend === 'down'" class="trend-icon" aria-hidden="true"/>
    <span>{{ caption }}</span>
  </div>
</template>

<style scoped>
.trend-badge {
  display: inline-flex;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  padding: 4px 8px;
  border-radius: 12px;
}

.trend-icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
}
</style>
