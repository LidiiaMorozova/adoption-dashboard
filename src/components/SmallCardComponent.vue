<script setup lang="ts">
import {computed} from 'vue';
import * as d3 from 'd3';
import BaseCard from './common/BaseCard.vue';
import CardHeader from './common/CardHeader.vue';
import TrendBadge from './common/TrendBadge.vue';
import type {SmallCard} from '@/types/dashboard';

const props = defineProps<SmallCard>();

const CHART_WIDTH = 100;
const CHART_HEIGHT = 30;
const STROKE_PADDING = 2;

const formattedValue = computed(() => props.value.toLocaleString());

const scales = computed(() => {
  const [min = 0, max = 0] = d3.extent(props.points);
  return {
    x: d3.scaleLinear()
        .domain([0, Math.max(props.points.length - 1, 1)])
        .range([0, CHART_WIDTH]),
    // Larger values are drawn higher; a constant series sits in the middle.
    y: d3.scaleLinear()
        .domain(min === max ? [min - 1, max + 1] : [min, max])
        .range([CHART_HEIGHT - STROKE_PADDING, STROKE_PADDING]),
  };
});

const linePath = computed(() => {
  if (props.points.length < 2) return '';
  const {x, y} = scales.value;
  return d3.line<number>()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveBasis)(props.points) ?? '';
});

const areaPath = computed(() => {
  if (props.points.length < 2) return '';
  const {x, y} = scales.value;
  return d3.area<number>()
      .x((_, i) => x(i))
      .y0(CHART_HEIGHT)
      .y1((d) => y(d))
      .curve(d3.curveBasis)(props.points) ?? '';
});
</script>

<template>
  <BaseCard class="small-card">
    <CardHeader :icon="icon" :title="title"/>
    <div class="card-value">
      {{ formattedValue }}
    </div>

    <div class="card-chart">
      <svg
          v-if="linePath"
          :viewBox="`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`"
          preserveAspectRatio="none"
          width="100%"
          :height="CHART_HEIGHT"
          aria-hidden="true"
      >
        <path :d="areaPath" :fill="color" opacity="0.1"/>
        <path :d="linePath" :stroke="color" fill="none" stroke-width="2"/>
      </svg>
    </div>

    <TrendBadge :trend="trend" :caption="caption" :color="color" :background-color="backgroundColor"/>
  </BaseCard>
</template>

<style scoped>
.small-card {
  align-items: flex-start;
  justify-content: space-around;
  width: 260px;
  height: 230px;
}

.card-chart {
  width: 192px;
  max-width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
