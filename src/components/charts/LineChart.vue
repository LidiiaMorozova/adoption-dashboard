<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import type {Plugin, PointStyle} from 'chart.js';
import {Chart} from '@/plugins/chart';

export interface LineSeries {
  label: string;
  data: number[];
  color: string;
  /** Marker shape; gives each series a second cue besides color. */
  pointStyle?: PointStyle;
  format: (value: number) => string;
}

const props = defineProps<{
  /** Short x-axis labels, one per point. */
  labels: string[];
  /** Full date and time for tooltips and the table, one per point. */
  titles: string[];
  series: LineSeries[];
  yMin: number;
  yMax: number;
  yStep?: number;
  yTick?: (value: number) => string;
  referenceLine?: {value: number; label: string};
  description: string;
}>();

const GRID = '#E1E0D9';
const AXIS = '#C3C2B7';
const INK_SECONDARY = '#52514E';

const canvas = ref<HTMLCanvasElement | null>(null);
// Kept outside Vue reactivity: Chart.js mutates its instance internally.
let chart: Chart<'line'> | null = null;

/** Draws a dashed horizontal line with a label, such as the fever threshold. */
const referenceLinePlugin: Plugin<'line'> = {
  id: 'referenceLine',
  afterDatasetsDraw(instance) {
    const line = props.referenceLine;
    if (!line) return;
    const {ctx, chartArea, scales} = instance;
    const y = scales.y?.getPixelForValue(line.value);
    if (y === undefined || y < chartArea.top || y > chartArea.bottom) return;

    ctx.save();
    ctx.strokeStyle = INK_SECONDARY;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = INK_SECONDARY;
    ctx.font = "11px 'Poppins', sans-serif";
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(line.label, chartArea.right, y - 3);
    ctx.restore();
  },
};

function render() {
  chart?.destroy();
  chart = null;
  if (!canvas.value) return;

  const multiSeries = props.series.length > 1;

  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.series.map((s) => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: s.color,
        borderWidth: 2,
        pointStyle: s.pointStyle ?? 'circle',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        // Straight segments: a curve would suggest values between check-ins that were never measured.
        tension: 0,
        // Lets markers on the top and bottom gridlines draw in full instead of being cut in half.
        clip: 8,
      })),
    },
    options: {
      maintainAspectRatio: false,
      interaction: {mode: 'index', intersect: false},
      layout: {padding: {top: 8, right: 8}},
      scales: {
        x: {
          grid: {display: false},
          border: {color: AXIS},
          ticks: {autoSkip: true, maxRotation: 0, font: {size: 11}},
        },
        y: {
          min: props.yMin,
          max: props.yMax,
          grid: {color: GRID},
          border: {display: false},
          ticks: {
            stepSize: props.yStep,
            font: {size: 11},
            callback: (value) => (props.yTick ? props.yTick(Number(value)) : value),
          },
        },
      },
      plugins: {
        legend: {
          display: multiSeries,
          position: 'top',
          align: 'start',
          labels: {usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 16, color: INK_SECONDARY},
        },
        tooltip: {
          backgroundColor: '#1F2933',
          padding: 10,
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          callbacks: {
            title: (items) => props.titles[items[0]?.dataIndex ?? 0] ?? '',
            label: (item) => {
              const series = props.series[item.datasetIndex];
              return series ? ` ${series.label}: ${series.format(Number(item.raw))}` : '';
            },
          },
        },
      },
    },
    plugins: [referenceLinePlugin],
  });
}

onMounted(render);
watch(() => [props.labels, props.series], render, {deep: true});
onUnmounted(() => chart?.destroy());
</script>

<template>
  <div>
    <div class="relative h-56">
      <canvas ref="canvas" role="img" :aria-label="description"></canvas>
    </div>
    <details class="mt-3 text-sm">
      <summary class="cursor-pointer rounded text-muted hover:text-ink focus-visible:outline-3 focus-visible:outline-brand-500">
        Show as table
      </summary>
      <div class="mt-2 overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-gray-200 text-muted">
              <th scope="col" class="py-1.5 pr-3 font-medium">Date</th>
              <th v-for="s in series" :key="s.label" scope="col" class="py-1.5 pr-3 font-medium">{{ s.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(title, i) in titles" :key="title + i" class="border-b border-gray-100">
              <th scope="row" class="py-1.5 pr-3 font-normal whitespace-nowrap">{{ title }}</th>
              <td v-for="s in series" :key="s.label" class="py-1.5 pr-3 whitespace-nowrap">
                {{ s.data[i] === undefined ? '—' : s.format(s.data[i]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>
