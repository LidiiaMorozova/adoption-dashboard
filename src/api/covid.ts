import {request} from './http';
import type {SymptomEntry, SymptomEntryRequest} from '@/types/covid';

export const covidApi = {
  listEntries: () => request<SymptomEntry[]>('/covid/symptom-entries'),

  createEntry: (body: SymptomEntryRequest) =>
    request<SymptomEntry>('/covid/symptom-entries', {method: 'POST', body: JSON.stringify(body)}),
};
