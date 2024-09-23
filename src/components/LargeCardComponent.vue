<script setup>
import {defineProps} from 'vue';
import CardHeader from './common/CardHeader.vue';
import GrayButton from "@/components/common/GrayButton.vue";

defineProps({
  title: String,
  value: String,
  trend: String,
  percentage: String,
  backgroundColor: String,
  color: {
    type: String,
    default: 'blue'
  },
  icon: Object,
  lowestUsedValues: {
    type: Array,
    default: () => []
  },
  mostUsedValues: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div class="card">
    <div class="columns">
      <div class="first-column">
        <CardHeader :icon="icon" :title="title"/>
        <div class="card-value">
          {{ value }}
        </div>

        <div class="card-percentage" :style="{ backgroundColor: backgroundColor, color: color }">
          <span v-if="trend !== 'flat'">{{ percentage }}</span>
          <span v-else>{{ percentage }}</span>
        </div>
      </div>

      <div class="vertical-divider"></div>

      <div class="second-column">
        <div class="usage-column">
          <div class="usage-title">Most used</div>
          <div class="usage-items">
            <div v-for="(item, index) in mostUsedValues" :key="index" class="usage-item">
              <div class="icon-with-usage">
                <div class="item-icon" :style="{ backgroundColor: item.backgroundColor }">
                  <component :is="item.icon || item.color" class="card-icon"/>
                </div>
                <div class="item-label">{{ item.label }}</div>
              </div>
              <div class="item-number">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <div class="vertical-divider"></div>

        <div class="usage-column">
          <div class="usage-title">Lowest used</div>
          <div class="usage-items">
            <div v-for="(item, index) in lowestUsedValues" :key="index" class="usage-item">
              <div class="icon-with-usage">
                <div class="item-icon" :style="{ backgroundColor: item.backgroundColor }">
                  <component :is="item.icon || item.color" class="card-icon"/>
                </div>
                <div class="item-label">{{ item.label }}</div>
              </div>
              <div class="item-number">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="view-button">
      <GrayButton label="View details"/>
    </div>
  </div>
</template>

<style scoped>
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

.usage-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48%;
}

.usage-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #7E858E;
  margin-bottom: 12px;
  line-height: 18px;
}

.usage-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
}

.usage-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.icon-with-usage {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
}

.card-icon {
  width: 20px;
  height: 20px;
}

.item-label {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #7E858E;
  margin-right: 10px;
}

.item-number {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: #7E858E;
}

.vertical-divider {
  height: 100%;
  width: 1px;
  background-color: #ECEFF4;
  margin: 0 10px;
  border-radius: 5px;
}

.card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  width: 665px;
  height: auto;
  box-sizing: border-box;
  background-color: #FFFFFF;
}

.card-value {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 50px;
  line-height: 61px;
  margin-left: 5px;
}

.card-percentage {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}

.view-button {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}


@media (max-width: 768px) {
  .card {
    width: 100%;
    background-color: #FFFFFF;

  }

  .second-column {
    flex-direction: column;
    align-items: center;
  }

  .usage-column {
    width: 100%;
    margin-bottom: 20px;
  }

  .vertical-divider {
    display: none;
  }
}
</style>
