<script setup lang="ts">
import {onMounted} from 'vue';
import {storeToRefs} from 'pinia';
import SmallCardComponent from '@/components/SmallCardComponent.vue';
import MiddleCardComponent from '@/components/MiddleCardComponent.vue';
import LargeCardComponent from '@/components/LargeCardComponent.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import {useDashboardStore} from '@/stores/dashboard';

const store = useDashboardStore();
const {data, status, error} = storeToRefs(store);

onMounted(() => {
  if (status.value === 'idle' || status.value === 'error') void store.load();
});

// Placeholder blocks shaped like the three card rows.
const skeletonRows = [
  {count: 5, class: 'h-[230px] w-[260px]'},
  {count: 3, class: 'h-[455px] w-[440px]'},
  {count: 2, class: 'h-[300px] w-[665px]'},
];
</script>

<template>
  <div class="dashboard">
    <div v-if="status === 'loading' || status === 'idle'" aria-busy="true">
      <p role="status" class="sr-only">Loading dashboard…</p>
      <div v-for="(row, r) in skeletonRows" :key="r" class="cards-container">
        <div
            v-for="n in row.count"
            :key="n"
            :class="row.class"
            class="max-w-full animate-pulse rounded-xl border border-gray-200 bg-white"
        />
      </div>
    </div>

    <ErrorState
        v-else-if="status === 'error'"
        class="w-full"
        title="We couldn't load the dashboard"
        :message="error ?? ''"
        @retry="store.load()"
    />

    <template v-else-if="data">
      <div class="cards-container">
        <SmallCardComponent v-for="card in data.smallCards" :key="card.title" v-bind="card"/>
      </div>
      <div class="cards-container">
        <MiddleCardComponent v-for="card in data.middleCards" :key="card.title" v-bind="card"/>
      </div>
      <div class="cards-container">
        <LargeCardComponent v-for="card in data.largeCards" :key="card.title" v-bind="card"/>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 10px;
}
</style>
