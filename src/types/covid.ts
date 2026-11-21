// Mirrors server/src/covid/covid.types.ts.

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface SymptomEntry {
  id: string;
  recordedAt: string;
  temperature: number;
  wellbeing: Rating;
  appetite: Rating;
  sleep: Rating;
  notes: string | null;
}

export interface SymptomEntryRequest {
  temperature: number;
  wellbeing: Rating;
  appetite: Rating;
  sleep: Rating;
  notes?: string;
}

export const MIN_TEMPERATURE = 34;
export const MAX_TEMPERATURE = 43;
/** Temperatures from this value up are marked as fever in the history. */
export const FEVER_THRESHOLD = 38;

export const RATING_LABELS: Record<Rating, string> = {
  1: 'Very poor',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Very good',
};
