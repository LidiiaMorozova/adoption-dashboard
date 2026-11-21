<script setup lang="ts">
import {ClipboardDocumentListIcon} from '@heroicons/vue/24/outline';
import ErrorState from '@/components/common/ErrorState.vue';
import type {LoadStatus} from '@/stores/dashboard';
import {FEVER_THRESHOLD, RATING_LABELS, type SymptomEntry} from '@/types/covid';

defineProps<{
  entries: SymptomEntry[];
  status: LoadStatus;
  error: string | null;
}>();

defineEmits<{
  retry: [];
}>();

const recordedAt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
});

const ratings = [
  {key: 'wellbeing', label: 'Feeling'},
  {key: 'appetite', label: 'Appetite'},
  {key: 'sleep', label: 'Sleep'},
] as const;
</script>

<template>
  <section aria-labelledby="symptom-history-heading">
    <h3 id="symptom-history-heading" class="mb-3 text-base font-semibold">Recent entries</h3>

    <div v-if="status === 'loading' || status === 'idle'" aria-busy="true" class="flex flex-col gap-2">
      <p role="status" class="sr-only">Loading recent entries…</p>
      <div v-for="n in 3" :key="n" class="h-24 animate-pulse rounded-xl bg-gray-100"/>
    </div>

    <ErrorState
        v-else-if="status === 'error'"
        title="We couldn't load your entries"
        :message="error ?? ''"
        @retry="$emit('retry')"
    />

    <div
        v-else-if="entries.length === 0"
        class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center"
    >
      <ClipboardDocumentListIcon class="size-8 text-muted" aria-hidden="true"/>
      <p class="font-semibold">No entries yet</p>
      <p class="text-sm text-muted">Your check-ins will appear here after you save them.</p>
    </div>

    <ol v-else class="flex flex-col gap-2" data-testid="symptom-history">
      <li
          v-for="entry in entries"
          :key="entry.id"
          class="rounded-xl border border-gray-200 p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <time :datetime="entry.recordedAt" class="text-sm text-muted">
            {{ recordedAt.format(new Date(entry.recordedAt)) }}
          </time>
          <span class="flex items-center gap-2">
            <span class="text-lg font-semibold">{{ entry.temperature.toFixed(1) }} °C</span>
            <span
                v-if="entry.temperature >= FEVER_THRESHOLD"
                class="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800"
            >
              Fever
            </span>
          </span>
        </div>
        <dl class="mt-2 flex flex-wrap gap-2 text-xs">
          <div
              v-for="rating in ratings"
              :key="rating.key"
              class="flex gap-1 rounded-full bg-gray-100 px-2.5 py-1"
          >
            <dt class="text-muted">{{ rating.label }}</dt>
            <dd class="font-medium">{{ entry[rating.key] }}/5 · {{ RATING_LABELS[entry[rating.key]] }}</dd>
          </div>
        </dl>
        <p v-if="entry.notes" class="mt-2 text-sm whitespace-pre-line">{{ entry.notes }}</p>
      </li>
    </ol>
  </section>
</template>
