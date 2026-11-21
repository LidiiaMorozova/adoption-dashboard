<script setup lang="ts">
import {iconFor} from '@/icons';
import type {UsageItem} from '@/types/dashboard';

withDefaults(defineProps<{
  title: string;
  items?: UsageItem[];
}>(), {
  items: () => [],
});
</script>

<template>
  <div class="usage-column">
    <div class="usage-title">{{ title }}</div>
    <ul class="usage-items">
      <li v-for="item in items" :key="item.label" class="usage-item">
        <div class="icon-with-usage">
          <div class="item-icon">
            <component :is="iconFor(item.icon)" class="usage-icon" aria-hidden="true"/>
          </div>
          <div class="item-label">{{ item.label }}</div>
        </div>
        <div class="item-number">{{ item.value }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.usage-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48%;
}

.usage-title {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.usage-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.usage-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-with-usage {
  display: flex;
  align-items: center;
  width: 100%;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: var(--color-icon-bg);
}

.usage-icon {
  width: 20px;
  height: 20px;
}

.item-label {
  font-weight: 500;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-right: 10px;
}

.item-number {
  font-weight: 600;
  font-size: 12px;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .usage-column {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
