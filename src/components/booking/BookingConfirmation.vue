<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {CheckCircleIcon} from '@heroicons/vue/24/outline';
import type {Booking} from '@/types/appointments';
import {formatLongDate} from '@/utils/format';

defineProps<{
  booking: Booking;
}>();

defineEmits<{
  startOver: [];
}>();

const heading = ref<HTMLHeadingElement | null>(null);

// Moves keyboard and screen reader focus to the result of the booking.
onMounted(() => heading.value?.focus());
</script>

<template>
  <div class="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-10">
    <CheckCircleIcon class="mx-auto size-12 text-brand-700" aria-hidden="true"/>
    <h3 ref="heading" tabindex="-1" class="mt-3 text-xl font-semibold focus:outline-none">Your appointment is booked</h3>
    <p class="mt-1 text-sm text-muted">Keep the reference below in case you need to change it.</p>

    <dl class="mt-6 grid gap-3 rounded-xl bg-gray-50 p-4 text-left text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
      <dt class="font-medium text-muted">Date</dt>
      <dd data-testid="confirmation-date">{{ formatLongDate(booking.date) }}</dd>
      <dt class="font-medium text-muted">Time</dt>
      <dd data-testid="confirmation-time">{{ booking.start }}–{{ booking.end }}</dd>
      <dt class="font-medium text-muted">Name</dt>
      <dd>{{ booking.patientName }}</dd>
      <dt class="font-medium text-muted">Email</dt>
      <dd class="break-all">{{ booking.email }}</dd>
      <dt class="font-medium text-muted">Reference</dt>
      <dd class="font-mono text-xs leading-5">{{ booking.id.slice(0, 8).toUpperCase() }}</dd>
    </dl>

    <button
        type="button"
        class="mt-6 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        @click="$emit('startOver')"
    >
      Book another appointment
    </button>
  </div>
</template>
