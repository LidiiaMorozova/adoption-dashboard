<script setup lang="ts">
import {InformationCircleIcon} from '@heroicons/vue/24/outline';

async function resetData() {
  const {resetDemoData} = await import('@/api/demo');
  resetDemoData();
  window.location.reload();
}
</script>

<template>
  <aside
      aria-label="About this demo"
      data-testid="demo-banner"
      class="mb-4 flex flex-col gap-2 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800 sm:flex-row sm:items-center sm:justify-between"
  >
    <p class="flex items-start gap-2">
      <InformationCircleIcon class="mt-0.5 size-5 shrink-0" aria-hidden="true"/>
      <span>
        <strong class="font-semibold">Demo version.</strong>
        Bookings and check-ins are saved only in this browser.
      </span>
    </p>
    <button
        type="button"
        class="shrink-0 self-start rounded-full border border-brand-700 px-4 py-1.5 font-medium hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:self-auto"
        @click="resetData"
    >
      Reset demo data
    </button>
  </aside>
</template>
