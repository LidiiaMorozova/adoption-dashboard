<script setup lang="ts">
import {nextTick, reactive, ref} from 'vue';
import RatingField from './RatingField.vue';
import {MAX_TEMPERATURE, MIN_TEMPERATURE, type Rating, type SymptomEntryRequest} from '@/types/covid';

defineProps<{
  submitting: boolean;
  submitError: string | null;
}>();

const emit = defineEmits<{
  submit: [entry: SymptomEntryRequest];
}>();

type RatingKey = 'wellbeing' | 'appetite' | 'sleep';
type Field = 'temperature' | RatingKey;

const form = reactive<{temperature: string; notes: string} & Record<RatingKey, Rating | null>>({
  temperature: '',
  wellbeing: null,
  appetite: null,
  sleep: null,
  notes: '',
});
const errors = reactive<Record<Field, string | null>>({temperature: null, wellbeing: null, appetite: null, sleep: null});

const temperatureInput = ref<HTMLInputElement | null>(null);
const ratingFields = {
  wellbeing: ref<InstanceType<typeof RatingField> | null>(null),
  appetite: ref<InstanceType<typeof RatingField> | null>(null),
  sleep: ref<InstanceType<typeof RatingField> | null>(null),
};
const wellbeingField = ratingFields.wellbeing;
const appetiteField = ratingFields.appetite;
const sleepField = ratingFields.sleep;

/** Accepts "37.5" and "37,5"; returns null unless it is a number with at most one decimal. */
function parseTemperature(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d{2}(\.\d)?$/.test(normalized)) return null;
  return Number(normalized);
}

function validate(): Field | null {
  const temperature = parseTemperature(form.temperature);
  errors.temperature = temperature !== null && temperature >= MIN_TEMPERATURE && temperature <= MAX_TEMPERATURE
    ? null
    : `Enter a temperature between ${MIN_TEMPERATURE.toFixed(1)} and ${MAX_TEMPERATURE.toFixed(1)} °C, for example 37.2.`;
  errors.wellbeing = form.wellbeing ? null : 'Please rate how you feel.';
  errors.appetite = form.appetite ? null : 'Please rate your appetite.';
  errors.sleep = form.sleep ? null : 'Please rate your sleep.';

  return (['temperature', 'wellbeing', 'appetite', 'sleep'] as const).find((field) => errors[field]) ?? null;
}

async function onSubmit() {
  const firstInvalid = validate();
  if (firstInvalid) {
    await nextTick();
    if (firstInvalid === 'temperature') temperatureInput.value?.focus();
    else ratingFields[firstInvalid].value?.focus();
    return;
  }
  emit('submit', {
    temperature: parseTemperature(form.temperature) as number,
    wellbeing: form.wellbeing as Rating,
    appetite: form.appetite as Rating,
    sleep: form.sleep as Rating,
    notes: form.notes.trim() || undefined,
  });
}

function reset() {
  Object.assign(form, {temperature: '', wellbeing: null, appetite: null, sleep: null, notes: ''});
}

defineExpose({reset});

const inputClass = 'block w-full rounded-lg border bg-white px-3 py-2.5 text-sm shadow-xs focus:border-brand-700 focus:outline-3 focus:outline-brand-500/40';
</script>

<template>
  <form novalidate class="flex flex-col gap-5" aria-labelledby="symptom-form-heading" @submit.prevent="onSubmit">
    <h3 id="symptom-form-heading" class="text-base font-semibold">Add symptoms</h3>

    <div>
      <label for="temperature" class="text-sm font-medium">Temperature</label>
      <div class="relative mt-1 max-w-40">
        <input
            id="temperature"
            ref="temperatureInput"
            v-model="form.temperature"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder="37.0"
            required
            :aria-invalid="errors.temperature ? 'true' : undefined"
            :aria-describedby="errors.temperature ? 'temperature-error' : 'temperature-hint'"
            :class="[inputClass, 'pr-10', errors.temperature ? 'border-red-600' : 'border-gray-300']"
        >
        <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted" aria-hidden="true">°C</span>
      </div>
      <p v-if="errors.temperature" id="temperature-error" class="mt-1 text-sm text-red-700">{{ errors.temperature }}</p>
      <p v-else id="temperature-hint" class="mt-1 text-xs text-muted">In degrees Celsius, one decimal.</p>
    </div>

    <RatingField
        ref="wellbeingField"
        v-model="form.wellbeing"
        name="wellbeing"
        legend="How do you feel overall?"
        :error="errors.wellbeing"
    />
    <RatingField
        ref="appetiteField"
        v-model="form.appetite"
        name="appetite"
        legend="Appetite"
        :error="errors.appetite"
    />
    <RatingField
        ref="sleepField"
        v-model="form.sleep"
        name="sleep"
        legend="Sleep last night"
        :error="errors.sleep"
    />

    <div>
      <label for="symptom-notes" class="text-sm font-medium">
        Other symptoms or notes <span class="font-normal text-muted">(optional)</span>
      </label>
      <textarea
          id="symptom-notes"
          v-model="form.notes"
          rows="3"
          maxlength="500"
          :class="[inputClass, 'mt-1 border-gray-300']"
      />
    </div>

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
      {{ submitting ? 'Saving…' : 'Save' }}
    </button>
  </form>
</template>
