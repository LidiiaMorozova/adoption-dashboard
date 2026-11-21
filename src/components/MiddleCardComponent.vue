<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {Chart} from '@/plugins/chart';
import BaseCard from './common/BaseCard.vue';
import CardHeader from './common/CardHeader.vue';
import TrendBadge from './common/TrendBadge.vue';
import GrayButton from './common/GrayButton.vue';
import ColorGuideDialog from './ColorGuideDialog.vue';
import type {MiddleCard} from '@/types/dashboard';

const props = defineProps<MiddleCard>();

const detailsOpen = ref(false);

const formattedValue = computed(() => props.value.toLocaleString());

const canvasRef = ref<HTMLCanvasElement | null>(null);
// Kept outside Vue reactivity: Chart.js mutates its instance internally.
let chartInstance: Chart<'doughnut'> | null = null;

const toPercent = (value: number, total: number) => (total ? Math.round((value / total) * 100) : 0);

const destroyChart = () => {
  chartInstance?.destroy();
  chartInstance = null;
};

const renderChart = () => {
  destroyChart();
  if (!canvasRef.value) return;

  const labels = props.points.map((point) => point.label);
  const dataValues = props.points.map((point) => point.value);
  const backgroundColors = props.points.map((point) => point.color);
  const total = dataValues.reduce((sum, value) => sum + value, 0);
  const legendTextColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-legend-text').trim();

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 0,
        borderRadius: 10,
        spacing: 3,
      }],
    },
    options: {
      cutout: '55%',
      layout: {
        padding: {
          right: 20,
        },
      },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            generateLabels: () => labels.map((label, i) => ({
              text: `${toPercent(dataValues[i] ?? 0, total)}% ${label}`,
              fillStyle: backgroundColors[i],
              strokeStyle: backgroundColors[i],
              fontColor: legendTextColor,
              index: i,
            })),
            usePointStyle: false,
            boxWidth: 20,
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: (item) => `  ${item.raw} (${toPercent(Number(item.raw), total)}%)`,
          },
          bodyFont: {
            size: 12,
          },
        },
      },
    },
  });
};

onMounted(renderChart);

watch(() => props.points, renderChart, {deep: true});

onUnmounted(destroyChart);
</script>

<template>
  <BaseCard class="middle-card">
    <CardHeader :icon="icon" :title="title"/>
    <div class="card-value">
      {{ formattedValue }}
    </div>

    <TrendBadge :trend="trend" :caption="caption" :color="color" :background-color="backgroundColor"/>
    <div class="divider"/>

    <div class="chart-container">
      <canvas ref="canvasRef" role="img" :aria-label="`${title} breakdown`"></canvas>
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
        :segments="points"
    />
  </BaseCard>
</template>

<style scoped>
.middle-card {
  align-items: flex-start;
  justify-content: space-around;
  width: 440px;
  height: 455px;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
}

canvas {
  max-width: 100%;
  max-height: 100%;
}

.view-button {
  margin-left: 10px;
}
</style>
