<script setup lang="ts">
import {ref} from 'vue';
import {RATING_LABELS, type Rating} from '@/types/covid';

const props = defineProps<{
  name: string;
  legend: string;
  error: string | null;
}>();

const model = defineModel<Rating | null>({required: true});

const ratings: Rating[] = [1, 2, 3, 4, 5];
const inputs = ref<HTMLInputElement[]>([]);

defineExpose({
  // Focuses the checked option, or the first one, like a browser does when tabbing into a radio group.
  focus: () => (inputs.value.find((input) => input.checked) ?? inputs.value[0])?.focus(),
});

const errorId = `${props.name}-error`;
</script>

<template>
  <fieldset
      :aria-describedby="error ? errorId : undefined"
      :aria-invalid="error ? 'true' : undefined"
  >
    <legend class="text-sm font-medium">{{ legend }}</legend>
    <div class="mt-1.5 grid grid-cols-5 gap-1.5">
      <label
          v-for="rating in ratings"
          :key="rating"
          class="flex cursor-pointer flex-col items-center rounded-lg border px-1 py-2 text-center transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500"
          :class="model === rating
            ? 'border-brand-700 bg-brand-700 text-white'
            : [error ? 'border-red-600' : 'border-gray-300', 'bg-white hover:border-brand-500 hover:bg-brand-50']"
      >
        <input
            ref="inputs"
            v-model="model"
            type="radio"
            class="sr-only"
            :name="name"
            :value="rating"
        >
        <span class="text-base font-semibold leading-tight">{{ rating }}</span>
        <span class="text-[11px] leading-tight">{{ RATING_LABELS[rating] }}</span>
      </label>
    </div>
    <p v-if="error" :id="errorId" class="mt-1 text-sm text-red-700">{{ error }}</p>
  </fieldset>
</template>
