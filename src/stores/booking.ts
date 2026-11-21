import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {appointmentsApi} from '@/api/appointments';
import {ApiError, errorMessage} from '@/api/http';
import {SLOT_TAKEN, type Booking, type BookingRequest, type DaySummary, type Slot} from '@/types/appointments';
import type {LoadStatus} from './dashboard';

export type SubmitResult = 'success' | 'conflict' | 'error';

export const useBookingStore = defineStore('booking', () => {
  const days = ref<DaySummary[]>([]);
  const daysStatus = ref<LoadStatus>('idle');
  const daysError = ref<string | null>(null);

  const selectedDate = ref<string | null>(null);
  const slots = ref<Slot[]>([]);
  const slotsStatus = ref<LoadStatus>('idle');
  const slotsError = ref<string | null>(null);

  const selectedSlotId = ref<string | null>(null);
  const submitting = ref(false);
  const submitError = ref<string | null>(null);
  /** The slot the user tried to book after someone else had taken it. */
  const conflictSlot = ref<Slot | null>(null);
  const booking = ref<Booking | null>(null);

  // Only the newest slots request may update state, so quick date switches cannot show stale slots.
  let slotsRequestId = 0;

  const selectedDay = computed(() => days.value.find((day) => day.date === selectedDate.value) ?? null);
  const selectedSlot = computed(() => slots.value.find((slot) => slot.id === selectedSlotId.value) ?? null);
  const availableSlots = computed(() => slots.value.filter((slot) => slot.available));

  async function loadDays(): Promise<void> {
    daysStatus.value = 'loading';
    daysError.value = null;
    try {
      days.value = await appointmentsApi.listDays();
      daysStatus.value = 'success';
    } catch (e) {
      daysError.value = errorMessage(e);
      daysStatus.value = 'error';
      return;
    }

    const stillListed = days.value.some((day) => day.date === selectedDate.value);
    if (stillListed) {
      await loadSlots();
      return;
    }
    const firstOpen = days.value.find((day) => day.availableSlots > 0) ?? days.value[0];
    if (firstOpen) await selectDate(firstOpen.date);
  }

  async function selectDate(date: string): Promise<void> {
    if (date !== selectedDate.value) {
      selectedDate.value = date;
      selectedSlotId.value = null;
    }
    await loadSlots();
  }

  async function loadSlots(): Promise<void> {
    const date = selectedDate.value;
    if (!date) return;
    const requestId = ++slotsRequestId;
    slotsStatus.value = 'loading';
    slotsError.value = null;
    try {
      const result = await appointmentsApi.listSlots(date);
      if (requestId !== slotsRequestId) return;
      slots.value = result;
      slotsStatus.value = 'success';
      if (selectedSlot.value && !selectedSlot.value.available) selectedSlotId.value = null;
    } catch (e) {
      if (requestId !== slotsRequestId) return;
      slotsError.value = errorMessage(e);
      slotsStatus.value = 'error';
    }
  }

  function selectSlot(slotId: string): void {
    selectedSlotId.value = slotId;
    conflictSlot.value = null;
    submitError.value = null;
  }

  async function submit(details: Omit<BookingRequest, 'slotId'>): Promise<SubmitResult> {
    const slot = selectedSlot.value;
    if (!slot || submitting.value) return 'error';

    submitting.value = true;
    submitError.value = null;
    conflictSlot.value = null;
    try {
      booking.value = await appointmentsApi.createBooking({...details, slotId: slot.id});
      return 'success';
    } catch (e) {
      if (e instanceof ApiError && e.code === SLOT_TAKEN) {
        conflictSlot.value = slot;
        selectedSlotId.value = null;
        await Promise.all([loadSlots(), refreshDayCounts()]);
        return 'conflict';
      }
      submitError.value = errorMessage(e);
      return 'error';
    } finally {
      submitting.value = false;
    }
  }

  /** Updates the free-slot counts in the day picker without changing the selected day. */
  async function refreshDayCounts(): Promise<void> {
    try {
      days.value = await appointmentsApi.listDays();
    } catch {
      // The counts are a hint only; the slot list already shows the current state.
    }
  }

  async function startOver(): Promise<void> {
    booking.value = null;
    selectedSlotId.value = null;
    conflictSlot.value = null;
    submitError.value = null;
    await loadDays();
  }

  return {
    days, daysStatus, daysError,
    selectedDate, selectedDay, slots, slotsStatus, slotsError, availableSlots,
    selectedSlotId, selectedSlot, submitting, submitError, conflictSlot, booking,
    loadDays, selectDate, loadSlots, selectSlot, submit, startOver,
  };
});
