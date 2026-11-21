<script setup lang="ts">
import {computed, nextTick, reactive, ref} from 'vue';
import type {Slot} from '@/types/appointments';
import {formatLongDate} from '@/utils/format';

const props = defineProps<{
  selectedSlot: Slot | null;
  submitting: boolean;
  submitError: string | null;
}>();

const emit = defineEmits<{
  submit: [details: {patientName: string; email: string; reason?: string}];
}>();

type Field = 'patientName' | 'email';

const form = reactive({patientName: '', email: '', reason: ''});
const errors = reactive<Record<Field | 'slot', string | null>>({patientName: null, email: null, slot: null});
const inputs = {patientName: ref<HTMLInputElement | null>(null), email: ref<HTMLInputElement | null>(null)};
const nameInput = inputs.patientName;
const emailInput = inputs.email;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const selectionText = computed(() =>
  props.selectedSlot
    ? `${formatLongDate(props.selectedSlot.date)}, ${props.selectedSlot.start}–${props.selectedSlot.end}`
    : null,
);

function validate(): Field | 'slot' | null {
  errors.patientName = form.patientName.trim().length >= 2 ? null : 'Please enter your full name.';
  errors.email = EMAIL_PATTERN.test(form.email.trim()) ? null : 'Please enter a valid email address, like name@example.com.';
  errors.slot = props.selectedSlot ? null : 'Please choose a day and time first.';

  if (errors.patientName) return 'patientName';
  if (errors.email) return 'email';
  if (errors.slot) return 'slot';
  return null;
}

async function onSubmit() {
  const firstInvalid = validate();
  if (firstInvalid) {
    await nextTick();
    if (firstInvalid !== 'slot') inputs[firstInvalid].value?.focus();
    return;
  }
  emit('submit', {
    patientName: form.patientName.trim(),
    email: form.email.trim(),
    reason: form.reason.trim() || undefined,
  });
}

const inputClass = 'mt-1 block w-full rounded-lg border bg-white px-3 py-2.5 text-sm shadow-xs focus:border-brand-700 focus:outline-3 focus:outline-brand-500/40';
</script>

<template>
  <form novalidate class="flex flex-col gap-4" aria-labelledby="details-heading" @submit.prevent="onSubmit">
    <h3 id="details-heading" class="text-base font-semibold">Your details</h3>

    <div
        class="rounded-lg px-3 py-2.5 text-sm"
        :class="selectedSlot ? 'bg-brand-50 text-brand-800' : 'bg-gray-50 text-muted'"
        aria-live="polite"
        data-testid="selected-time"
    >
      <template v-if="selectionText">
        <span class="block text-xs font-medium uppercase tracking-wide">Selected time</span>
        <span class="font-medium">{{ selectionText }}</span>
      </template>
      <template v-else>No time selected yet.</template>
    </div>

    <div>
      <label for="patient-name" class="text-sm font-medium">Full name</label>
      <input
          id="patient-name"
          ref="nameInput"
          v-model="form.patientName"
          type="text"
          name="name"
          autocomplete="name"
          required
          :aria-invalid="errors.patientName ? 'true' : undefined"
          :aria-describedby="errors.patientName ? 'patient-name-error' : undefined"
          :class="[inputClass, errors.patientName ? 'border-red-600' : 'border-gray-300']"
      >
      <p v-if="errors.patientName" id="patient-name-error" class="mt-1 text-sm text-red-700">{{ errors.patientName }}</p>
    </div>

    <div>
      <label for="patient-email" class="text-sm font-medium">Email</label>
      <input
          id="patient-email"
          ref="emailInput"
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          inputmode="email"
          required
          :aria-invalid="errors.email ? 'true' : undefined"
          :aria-describedby="errors.email ? 'patient-email-error' : 'patient-email-hint'"
          :class="[inputClass, errors.email ? 'border-red-600' : 'border-gray-300']"
      >
      <p v-if="errors.email" id="patient-email-error" class="mt-1 text-sm text-red-700">{{ errors.email }}</p>
      <p v-else id="patient-email-hint" class="mt-1 text-xs text-muted">Only used to contact you about this appointment.</p>
    </div>

    <div>
      <label for="visit-reason" class="text-sm font-medium">
        Reason for visit <span class="font-normal text-muted">(optional)</span>
      </label>
      <textarea
          id="visit-reason"
          v-model="form.reason"
          name="reason"
          rows="3"
          maxlength="500"
          :class="[inputClass, 'border-gray-300']"
      />
    </div>

    <p v-if="errors.slot" role="alert" class="text-sm text-red-700">{{ errors.slot }}</p>
    <p v-if="submitError" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{{ submitError }}</p>

    <button
        type="submit"
        :disabled="submitting"
        :aria-busy="submitting"
        class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-wait disabled:opacity-70"
    >
      <span
          v-if="submitting"
          class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
      />
      {{ submitting ? 'Booking…' : 'Confirm booking' }}
    </button>
  </form>
</template>
