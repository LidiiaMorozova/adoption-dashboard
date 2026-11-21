<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {CheckCircleIcon} from '@heroicons/vue/24/outline';
import SymptomForm from '@/components/covid/SymptomForm.vue';
import SymptomHistory from '@/components/covid/SymptomHistory.vue';
import {useSymptomsStore} from '@/stores/symptoms';
import type {SymptomEntryRequest} from '@/types/covid';

const store = useSymptomsStore();
const {entries, status, error, submitting, submitError} = storeToRefs(store);

/** The history list shows only the most recent check-ins. */
const RECENT_ENTRIES = 20;
const recentEntries = computed(() => entries.value.slice(0, RECENT_ENTRIES));

const form = ref<InstanceType<typeof SymptomForm> | null>(null);
const savedMessage = ref<HTMLElement | null>(null);
const showSaved = ref(false);

onMounted(() => {
  if (status.value !== 'success') void store.load();
});

async function onSubmit(entry: SymptomEntryRequest) {
  showSaved.value = false;
  if (!(await store.submit(entry))) return;
  form.value?.reset();
  showSaved.value = true;
  await nextTick();
  savedMessage.value?.focus();
}
</script>

<template>
  <section aria-labelledby="covid-heading" class="mx-auto w-full max-w-5xl">
    <div class="mb-5">
      <h2 id="covid-heading" class="text-2xl font-semibold">Covid monitoring</h2>
      <p class="mt-1 text-sm text-muted">Log your temperature and how you feel. Each check-in is added to your history.</p>
    </div>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:self-start">
        <div
            v-if="showSaved"
            ref="savedMessage"
            role="status"
            tabindex="-1"
            data-testid="symptoms-saved"
            class="mb-5 flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 focus:outline-3 focus:outline-brand-500"
        >
          <CheckCircleIcon class="size-5 shrink-0" aria-hidden="true"/>
          Check-in saved. You can add another one at any time.
        </div>
        <SymptomForm ref="form" :submitting="submitting" :submit-error="submitError" @submit="onSubmit"/>
      </div>

      <div class="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:self-start">
        <SymptomHistory :entries="recentEntries" :status="status" :error="error" @retry="store.load()"/>
      </div>
    </div>
  </section>
</template>
