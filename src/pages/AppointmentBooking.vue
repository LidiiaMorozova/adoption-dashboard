<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {ExclamationCircleIcon} from '@heroicons/vue/24/outline';
import DayPicker from '@/components/booking/DayPicker.vue';
import SlotPicker from '@/components/booking/SlotPicker.vue';
import BookingForm from '@/components/booking/BookingForm.vue';
import BookingConfirmation from '@/components/booking/BookingConfirmation.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import {useBookingStore} from '@/stores/booking';
import {formatLongDate} from '@/utils/format';

const store = useBookingStore();
const {
  days, daysStatus, daysError, selectedDate,
  slots, slotsStatus, slotsError, selectedSlotId, selectedSlot,
  submitting, submitError, conflictSlot, booking,
} = storeToRefs(store);

const conflictAlert = ref<HTMLElement | null>(null);

onMounted(() => {
  if (daysStatus.value !== 'success') void store.loadDays();
});

async function onSubmit(details: {patientName: string; email: string; reason?: string}) {
  const result = await store.submit(details);
  if (result === 'conflict') {
    await nextTick();
    conflictAlert.value?.focus();
  }
}
</script>

<template>
  <section aria-labelledby="booking-heading" class="mx-auto w-full max-w-5xl">
    <div class="mb-5">
      <h2 id="booking-heading" class="text-2xl font-semibold">Book an appointment</h2>
      <p class="mt-1 text-sm text-muted">Choose a day and a time, then add your details.</p>
    </div>

    <BookingConfirmation v-if="booking" :booking="booking" @start-over="store.startOver()"/>

    <template v-else>
      <div v-if="daysStatus === 'loading' || daysStatus === 'idle'" aria-busy="true" class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        <p role="status" class="sr-only">Loading available days…</p>
        <div class="flex gap-2 overflow-hidden sm:grid sm:grid-cols-7">
          <div v-for="n in 14" :key="n" class="h-[104px] min-w-[76px] animate-pulse rounded-xl bg-gray-100"/>
        </div>
      </div>

      <ErrorState
          v-else-if="daysStatus === 'error'"
          title="We couldn't load the appointment calendar"
          :message="daysError ?? ''"
          @retry="store.loadDays()"
      />

      <div v-else class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div class="flex min-w-0 flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div>
            <h3 class="mb-3 text-base font-semibold">1. Day</h3>
            <DayPicker :days="days" :selected-date="selectedDate" @select="store.selectDate"/>
          </div>

          <div>
            <h3 class="mb-3 text-base font-semibold">
              2. Time
              <span v-if="selectedDate" class="font-normal text-muted">· {{ formatLongDate(selectedDate) }}</span>
            </h3>

            <div
                v-if="conflictSlot"
                ref="conflictAlert"
                role="alert"
                tabindex="-1"
                data-testid="slot-conflict"
                class="mb-3 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 focus:outline-3 focus:outline-amber-400"
            >
              <ExclamationCircleIcon class="size-5 shrink-0" aria-hidden="true"/>
              <p>
                Sorry, <strong>{{ conflictSlot.start }}</strong> on {{ formatLongDate(conflictSlot.date) }}
                was just booked by someone else. We've refreshed the list — please choose another time.
                Your details are kept.
              </p>
            </div>

            <SlotPicker
                :slots="slots"
                :status="slotsStatus"
                :error="slotsError"
                :selected-slot-id="selectedSlotId"
                @select="store.selectSlot"
                @retry="store.loadSlots()"
            />
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:self-start">
          <BookingForm
              :selected-slot="selectedSlot"
              :submitting="submitting"
              :submit-error="submitError"
              @submit="onSubmit"
          />
        </div>
      </div>
    </template>
  </section>
</template>
