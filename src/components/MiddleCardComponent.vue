<script setup>
import {onMounted, watch, defineProps, computed, ref, onUnmounted} from 'vue';
import {Chart, registerables} from 'chart.js';
import {ArrowTrendingDownIcon, ArrowTrendingUpIcon} from "@heroicons/vue/24/outline";
import CardHeader from './common/CardHeader.vue';
import GrayButton from "@/components/common/GrayButton.vue";

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

const generateIdFromTitle = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

const chartId = computed(() => generateIdFromTitle(props.title));

Chart.register(...registerables);

const chartInstance = ref(null);

const renderChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = document.getElementById(chartId.value).getContext('2d');
  const labels = props.points.map(point => point.label);
  const dataValues = props.points.map(point => point.value);
  const backgroundColors = props.points.map(point => point.color);

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 0,
        borderRadius: 10,
        spacing: 3,
      }]
    },
    options: {
      cutout: '55%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            generateLabels: (chart) => {
              const data = chart.data.datasets[0].data;
              return chart.data.labels.map((label, i) => ({
                text: `${data[i]}% ${label}`,
                fillStyle: chart.data.datasets[0].backgroundColor[i],
                strokeStyle: chart.data.datasets[0].backgroundColor[i],
                fontColor: '#4A5568',
              }));
            },
            usePointStyle: false,
            boxWidth: 20,
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const value = tooltipItem.raw;
              return `  ${value}%`;
            }
          },
          bodyFont: {
            size: 12
          }
        },
        layout: {
          padding: {
            right: 20
          }
        }
      }
    }
  });
};

onMounted(() => {
  renderChart();
});

watch(() => props.points, () => {
  renderChart();
}, {deep: true});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
</script>

<template>
  <div class="card">
    <CardHeader :icon="icon" :title="title"/>
    <div class="card-value">
      {{ formattedValue }}
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
    <div class="divider"/>

    <div class="chart-container">
      <canvas :id="chartId"></canvas>
    </div>

    <div class="view-button">
      <GrayButton label="View details"/>
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

  width: 390px;
  height: 405px;
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

.divider {
  width: 100%;
  height: 1px;
  background-color: #ECEFF4;
  border-radius: 5px;
  margin: 10px 0;
}

canvas {
  max-width: 100%;
  max-height: 100%;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
}

.chartjs-legend li span {
  display: inline-block;
  width: 20px;
  height: 8px;
  margin-right: 10px;
  background-color: currentColor;
  border-radius: 10px !important;
}

.chartjs-legend li {
  color: #4A5568;
}

.chartjs-legend li span:first-child {
  color: #000;
  font-weight: 700;
}

.view-button {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-left: 10px;
}
</style>
