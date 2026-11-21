<script setup lang="ts">
import {computed, ref, useId, watch} from 'vue';
import {XMarkIcon} from '@heroicons/vue/24/outline';
import type {BreakdownSegment, Trend} from '@/types/dashboard';

const props = withDefaults(defineProps<{
  title: string;
  /** Badge of the card the dialog belongs to. */
  trend: Trend;
  color: string;
  caption: string;
  /** Ring chart segments; empty for cards without a chart. */
  segments?: BreakdownSegment[];
}>(), {
  segments: () => [],
});

const open = defineModel<boolean>('open', {required: true});

const dialog = ref<HTMLDialogElement | null>(null);
const headingId = useId();
const chartHeadingId = useId();
const badgeHeadingId = useId();

// The native dialog traps focus, closes on Escape and returns focus to the button that opened it.
watch(open, (isOpen) => {
  if (isOpen && !dialog.value?.open) dialog.value?.showModal();
  if (!isOpen && dialog.value?.open) dialog.value.close();
});

/** What each badge color on the dashboard means; matched to the card by its color. */
const BADGE_KEY = [
  {id: 'up', color: '#0B8A00', background: 'rgba(11, 138, 0, 0.1)', name: 'Green', meaning: 'Higher than last month.'},
  {id: 'down', color: '#C71026', background: 'rgba(199, 16, 38, 0.1)', name: 'Red', meaning: 'Lower than last month.'},
  {id: 'flat', color: '#00BFA5', background: 'rgba(0, 191, 165, 0.1)', name: 'Teal', meaning: 'Steady, or a rate rather than a change.'},
  {id: 'neutral', color: '#7E858E', background: 'rgba(126, 133, 142, 0.2)', name: 'Gray', meaning: 'A current total, without a comparison.'},
] as const;

const currentBadge = computed(() =>
  BADGE_KEY.find((badge) => badge.color.toLowerCase() === props.color.toLowerCase())
  ?? BADGE_KEY.find((badge) => badge.id === props.trend),
);

const total = computed(() => props.segments.reduce((sum, segment) => sum + segment.value, 0));
const share = (value: number) => (total.value ? Math.round((value / total.value) * 100) : 0);
</script>

<template>
  <dialog
      ref="dialog"
      :aria-labelledby="headingId"
      class="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-ink shadow-xl backdrop:bg-black/40"
      @close="open = false"
      @click.self="open = false"
  >
    <div class="flex flex-col gap-5 p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 :id="headingId" class="text-lg font-semibold">{{ title }}: what the colors mean</h2>
          <p class="mt-1 text-sm text-muted">A guide to the colors used on this card.</p>
        </div>
        <button
            type="button"
            class="-m-1 rounded-full p-1 text-muted hover:bg-gray-100 hover:text-ink focus-visible:outline-3 focus-visible:outline-brand-500"
            aria-label="Close"
            @click="open = false"
        >
          <XMarkIcon class="size-6" aria-hidden="true"/>
        </button>
      </div>

      <section v-if="segments.length" :aria-labelledby="chartHeadingId">
        <h3 :id="chartHeadingId" class="text-sm font-semibold">Chart colors</h3>
        <p class="mt-1 text-sm text-muted">
          Each color in the ring is one part of the total. The bigger the part, the longer its arc.
        </p>
        <table class="mt-3 w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-xs text-muted">
              <th scope="col" class="py-2 pr-3 font-medium">Color</th>
              <th scope="col" class="py-2 pr-3 font-medium">Part</th>
              <th scope="col" class="py-2 pr-3 text-right font-medium">Count</th>
              <th scope="col" class="py-2 text-right font-medium">Share</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="segment in segments" :key="segment.label" class="border-b border-gray-100">
              <td class="py-2 pr-3">
                <span
                    class="block h-3 w-6 rounded-full ring-1 ring-black/10"
                    :style="{ backgroundColor: segment.color }"
                    aria-hidden="true"
                />
              </td>
              <th scope="row" class="py-2 pr-3 font-normal">{{ segment.label }}</th>
              <td class="py-2 pr-3 text-right tabular-nums">{{ segment.value }}</td>
              <td class="py-2 text-right font-medium tabular-nums">{{ share(segment.value) }}%</td>
            </tr>
          </tbody>
        </table>
      </section>
      <p v-else class="rounded-lg bg-gray-50 px-3 py-2 text-sm text-muted">
        This card shows lists of the most and least used items instead of a chart.
      </p>

      <section :aria-labelledby="badgeHeadingId">
        <h3 :id="badgeHeadingId" class="text-sm font-semibold">Badge colors</h3>
        <p class="mt-1 text-sm text-muted">
          The small badge under the number shows how it compares with last month.
          This card's badge reads “{{ caption }}”.
        </p>
        <ul class="mt-3 flex flex-col gap-2">
          <li
              v-for="badge in BADGE_KEY"
              :key="badge.id"
              class="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm"
              :class="badge === currentBadge ? 'bg-gray-50 ring-1 ring-gray-200' : ''"
          >
            <span
                class="w-16 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-medium"
                :style="{ color: badge.color, backgroundColor: badge.background }"
            >
              {{ badge.name }}
            </span>
            <span class="grow">{{ badge.meaning }}</span>
            <span v-if="badge === currentBadge" class="shrink-0 text-xs font-medium text-muted">This card</span>
          </li>
        </ul>
      </section>

      <div class="flex justify-end">
        <button
            type="button"
            class="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            @click="open = false"
        >
          Got it
        </button>
      </div>
    </div>
  </dialog>
</template>
