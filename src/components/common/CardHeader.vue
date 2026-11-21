<script setup lang="ts">
import {computed} from 'vue';
import {iconFor} from '@/icons';
import type {IconName} from '@/types/dashboard';

const props = defineProps<{
  icon: IconName;
  title: string;
}>();

const iconComponent = computed(() => iconFor(props.icon));
</script>

<template>
  <div class="card-header">
    <component :is="iconComponent" class="card-icon" aria-hidden="true"/>
    <h2 class="card-header-title">{{ title }}</h2>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-icon {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  color: var(--color-accent);
}

.card-header-title {
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
