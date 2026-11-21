<script setup lang="ts">
import type {DaySummary} from '@/types/appointments';
import {formatDayOfMonth, formatLongDate, formatMonth, formatWeekday} from '@/utils/format';

defineProps<{
  days: DaySummary[];
  selectedDate: string | null;
}>();

defineEmits<{
  select: [date: string];
}>();

function statusText(day: DaySummary): string {
  if (day.totalSlots === 0) return 'Closed';
  if (day.availableSlots === 0) return 'Full';
  return `${day.availableSlots} free`;
}

function accessibleLabel(day: DaySummary): string {
  if (day.totalSlots === 0) return `${formatLongDate(day.date)}, clinic closed`;
  if (day.availableSlots === 0) return `${formatLongDate(day.date)}, fully booked`;
  const times = day.availableSlots === 1 ? 'time' : 'times';
  return `${formatLongDate(day.date)}, ${day.availableSlots} free ${times}`;
}
</script>

<template>
  <div
      role="group"
      aria-label="Choose a day"
      class="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-7 sm:overflow-visible sm:px-0"
  >
    <button
        v-for="day in days"
        :key="day.date"
        type="button"
        :data-date="day.date"
        :aria-pressed="day.date === selectedDate"
        :aria-label="accessibleLabel(day)"
        class="flex min-w-[76px] shrink-0 snap-start flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        :class="day.date === selectedDate
          ? 'border-brand-700 bg-brand-700 text-white'
          : day.availableSlots > 0
            ? 'border-gray-200 bg-white hover:border-brand-500 hover:bg-brand-50'
            : 'border-gray-200 bg-gray-50 text-muted hover:bg-gray-100'"
        @click="$emit('select', day.date)"
    >
      <span class="text-xs uppercase tracking-wide">{{ formatWeekday(day.date) }}</span>
      <span class="text-xl font-semibold leading-tight">{{ formatDayOfMonth(day.date) }}</span>
      <span class="text-xs">{{ formatMonth(day.date) }}</span>
      <span
          class="mt-1 text-[11px] font-medium"
          :class="day.date === selectedDate ? 'text-white' : day.availableSlots > 0 ? 'text-brand-800' : 'text-muted'"
      >
        {{ statusText(day) }}
      </span>
    </button>
  </div>
</template>
