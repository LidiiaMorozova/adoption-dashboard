<script setup>
import SmallCardComponent from "@/components/SmallCardComponent.vue";
import MiddleCardComponent from "@/components/MiddleCardComponent.vue";
import LargeCardComponent from "@/components/LargeCardComponent.vue";
import {cards, middleCardsData, largeCardsData} from './cardsData';
import GrayButton from "@/components/common/GrayButton.vue";

const tabs = ['Main', 'To validate', 'Care paths', 'BioMaterials', 'Covid monitoring', 'Kiosk usage', 'Adoption dashboard'];

function setActiveTab(tab) {
  console.log(`Active tab: ${tab}`);
}

</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <GrayButton
          v-for="tab in tabs"
          :key="tab"
          :label="tab"
          @click="setActiveTab(tab)"
      />
    </div>
    <div class="cards-container">
      <SmallCardComponent
          v-for="(card, index) in cards"
          :key="index"
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :trend="card.trend"
          :percentage="card.percentage"
          :backgroundColor="card.backgroundColor"
          :color="card.color"
          :points="card.points"
      />
    </div>
    <div class="cards-container">
      <MiddleCardComponent
          v-for="(card, index) in middleCardsData"
          :key="index"
          :title="card.title"
          :value="card.value"
          :size="card.size"
          :icon="card.icon"
          :trend="card.trend"
          :percentage="card.percentage"
          :backgroundColor="card.backgroundColor"
          :color="card.color"
          :points="card.points"

      />
    </div>
    <div class="cards-container">
      <LargeCardComponent
          v-for="(card, index) in largeCardsData"
          :key="index"
          :title="card.title"
          :value="card.value"
          :trend="card.trend"
          :percentage="card.percentage"
          :color="card.color"
          :backgroundColor="card.backgroundColor"
          :icon="card.icon"
          :lowestUsedValues="card.lowestUsedValues"
          :mostUsedValues="card.mostUsedValues"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  max-width: 1350px;
}

.dashboard-header {
  display: flex;
  margin-bottom: 20px;
  justify-content: flex-start;

  width: 100%;
  flex-wrap: wrap;
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