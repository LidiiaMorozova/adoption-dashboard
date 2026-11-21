import {defineStore} from 'pinia';
import {ref} from 'vue';
import {covidApi} from '@/api/covid';
import {errorMessage} from '@/api/http';
import type {SymptomEntry, SymptomEntryRequest} from '@/types/covid';
import type {LoadStatus} from './dashboard';

export const useSymptomsStore = defineStore('symptoms', () => {
  const entries = ref<SymptomEntry[]>([]);
  const status = ref<LoadStatus>('idle');
  const error = ref<string | null>(null);
  const submitting = ref(false);
  const submitError = ref<string | null>(null);

  async function load(): Promise<void> {
    status.value = 'loading';
    error.value = null;
    try {
      entries.value = await covidApi.listEntries();
      status.value = 'success';
    } catch (e) {
      error.value = errorMessage(e);
      status.value = 'error';
    }
  }

  /** Saves a check-in and puts it at the top of the history. Returns whether it was saved. */
  async function submit(input: SymptomEntryRequest): Promise<boolean> {
    if (submitting.value) return false;
    submitting.value = true;
    submitError.value = null;
    try {
      const entry = await covidApi.createEntry(input);
      entries.value = [entry, ...entries.value];
      return true;
    } catch (e) {
      submitError.value = errorMessage(e);
      return false;
    } finally {
      submitting.value = false;
    }
  }

  return {entries, status, error, submitting, submitError, load, submit};
});
