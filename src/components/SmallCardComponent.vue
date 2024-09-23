<script setup>
import {defineProps, computed} from 'vue';
import CardHeader from './common/CardHeader.vue';
import * as d3 from "d3";
import {ArrowTrendingDownIcon, ArrowTrendingUpIcon} from "@heroicons/vue/24/outline";

const props = defineProps({
  title: String,
  value: Number,
  trend: String,
  percentage: String,
  backgroundColor: String,
  color: {
    type: String,
    default: 'blue'
  },
  icon: Object,
  points: {
    type: Array,
    default: () => []
  }
});

const formattedValue = computed(() => {
  return props.value.toLocaleString();
});

const linePath = computed(() => {
  const line = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);
  return line(props.points);
});

const areaPath = computed(() => {
  let path = linePath.value;

  const lastPoint = props.points[props.points.length - 1];
  path += ` L ${lastPoint.x},30 L 0,30 Z`;

  return path;
});
</script>

<template>
  <div class="card">
    <CardHeader :icon="icon" :title="title"/>
    <div class="card-value">
      {{ formattedValue }}
    </div>

    <div class="card-chart">
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" width="100%" height="30">
        <path :d="areaPath" :fill="props.color" opacity="0.1"/>
        <path :d="linePath" :stroke="props.color" fill="none" stroke-width="2"/>
      </svg>
    </div>

    <div class="card-percentage" :style="{ backgroundColor: props.backgroundColor, color: props.color }">
      <template v-if="props.trend === 'down'">
        <ArrowTrendingDownIcon class="icon"/>
        <span>{{ props.percentage }} this month</span>
      </template>
      <template v-else-if="props.trend === 'up'">
        <ArrowTrendingUpIcon class="icon"/>
        <span>{{ props.percentage }} this month</span>
      </template>
      <span v-else>confirmation rate {{ props.percentage }}</span>
    </div>
  </div>
</template>


<style scoped>
.card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  width: 210px;
  height: 180px;
  background-color: #FFFFFF;
}

.icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
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

.card-chart {
  width: 192px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>