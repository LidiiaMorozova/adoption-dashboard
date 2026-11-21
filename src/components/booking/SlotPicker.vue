<script setup lang="ts">
import {computed} from 'vue';
import {CalendarDaysIcon} from '@heroicons/vue/24/outline';
import ErrorState from '@/components/common/ErrorState.vue';
import type {LoadStatus} from '@/stores/dashboard';
import type {Slot} from '@/types/appointments';

const props = defineProps<{
  slots: Slot[];
  status: LoadStatus;
  error: string | null;
  selectedSlotId: string | null;
}>();

defineEmits<{
  select: [slotId: string];
  retry: [];
}>();

const hasFreeSlots = computed(() => props.slots.some((slot) => slot.available));
const emptyMessage = computed(() =>
  props.slots.length === 0
    ? 'The clinic is closed on this day.'
    : 'All times on this day are already booked.',
);
</script>

<template>
  <div>
    <div v-if="status === 'loading' || status === 'idle'" aria-busy="true">
      <p role="status" class="sr-only">Loading available times…</p>
      <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
        <div v-for="n in 8" :key="n" class="h-11 animate-pulse rounded-lg bg-gray-100"/>
      </div>
    </div>

    <ErrorState
        v-else-if="status === 'error'"
        title="We couldn't load the available times"
        :message="error ?? ''"
        @retry="$emit('retry')"
    />

    <div
        v-else-if="!hasFreeSlots"
        role="status"
        data-testid="no-slots"
        class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center"
    >
      <CalendarDaysIcon class="size-8 text-muted" aria-hidden="true"/>
      <p class="font-semibold">No free times</p>
      <p class="text-sm text-muted">{{ emptyMessage }} Please choose another day.</p>
    </div>

    <div v-else role="group" aria-label="Choose a time" class="grid grid-cols-3 gap-2 sm:grid-cols-4">
      <button
          v-for="slot in slots"
          :key="slot.id"
          type="button"
          :data-slot-id="slot.id"
          :disabled="!slot.available"
          :aria-pressed="slot.id === selectedSlotId"
          :aria-label="slot.available ? `${slot.start} to ${slot.end}` : `${slot.start}, already booked`"
          class="h-11 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          :class="!slot.available
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400 line-through'
            : slot.id === selectedSlotId
              ? 'border-brand-700 bg-brand-700 text-white'
              : 'border-gray-200 bg-white hover:border-brand-500 hover:bg-brand-50'"
          @click="$emit('select', slot.id)"
      >
        {{ slot.start }}
      </button>
    </div>
  </div>
</template>
