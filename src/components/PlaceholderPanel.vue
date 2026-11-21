<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <p class="mt-2 text-sm text-muted">This section is part of the main BeWell web app and is not included in this demo.</p>
  </div>
</template>
