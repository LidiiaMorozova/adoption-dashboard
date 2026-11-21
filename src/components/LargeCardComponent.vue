<script setup lang="ts">
import BaseCard from './common/BaseCard.vue';
import CardHeader from './common/CardHeader.vue';
import TrendBadge from './common/TrendBadge.vue';
import UsageList from './common/UsageList.vue';
import {ref} from 'vue';
import GrayButton from './common/GrayButton.vue';
import ColorGuideDialog from './ColorGuideDialog.vue';
import type {LargeCard} from '@/types/dashboard';

defineProps<LargeCard>();

const detailsOpen = ref(false);
</script>

<template>
  <BaseCard class="large-card">
    <div class="columns">
      <div class="first-column">
        <CardHeader :icon="icon" :title="title"/>
        <div class="card-value">
          {{ value }}
        </div>
        <TrendBadge :trend="trend" :caption="caption" :color="color" :background-color="backgroundColor"/>
      </div>

      <div class="vertical-divider"></div>

      <div class="second-column">
        <UsageList title="Most used" :items="mostUsedValues"/>
        <div class="vertical-divider"></div>
        <UsageList title="Lowest used" :items="lowestUsedValues"/>
      </div>
    </div>

    <div class="view-button">
      <GrayButton label="View details" aria-haspopup="dialog" @click="detailsOpen = true"/>
    </div>

    <ColorGuideDialog
        v-model:open="detailsOpen"
        :title="title"
        :trend="trend"
        :color="color"
        :caption="caption"
    />
  </BaseCard>
</template>

<style scoped>
.large-card {
  width: 665px;
}

.columns {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.first-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 295px;
}

.second-column {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

.vertical-divider {
  height: 100%;
  width: 1px;
  background-color: var(--color-divider);
  margin: 0 10px;
  border-radius: 5px;
}

.view-button {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .large-card {
    width: 100%;
  }

  .columns {
    flex-direction: column;
  }

  .second-column {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }

  .vertical-divider {
    display: none;
  }
}
</style>
