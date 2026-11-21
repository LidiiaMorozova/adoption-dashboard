import {request} from './http';
import type {DashboardData} from '@/types/dashboard';

export const dashboardApi = {
  get: () => request<DashboardData>('/dashboard'),
};
