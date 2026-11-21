<script setup lang="ts">
import {ExclamationTriangleIcon} from '@heroicons/vue/24/outline';

withDefaults(defineProps<{
  title?: string;
  message: string;
  retryLabel?: string;
}>(), {
  title: 'Something went wrong',
  retryLabel: 'Try again',
});

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div role="alert" class="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
    <ExclamationTriangleIcon class="size-8 text-red-700" aria-hidden="true"/>
    <div>
      <p class="font-semibold text-red-900">{{ title }}</p>
      <p class="mt-1 text-sm text-red-800">{{ message }}</p>
    </div>
    <button
        type="button"
        class="rounded-full bg-red-700 px-5 py-2 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        @click="$emit('retry')"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>
