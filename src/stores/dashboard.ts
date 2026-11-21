import {defineStore} from 'pinia';
import {ref} from 'vue';
import {dashboardApi} from '@/api/dashboard';
import {errorMessage} from '@/api/http';
import type {DashboardData} from '@/types/dashboard';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null);
  const status = ref<LoadStatus>('idle');
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    status.value = 'loading';
    error.value = null;
    try {
      data.value = await dashboardApi.get();
      status.value = 'success';
    } catch (e) {
      error.value = errorMessage(e);
      status.value = 'error';
    }
  }

  return {data, status, error, load};
});
