// Pure symptom-log rules, free of NestJS and Node APIs, so the browser demo build reuses them.
import type {Rating, SymptomEntry} from './covid.types';

export const MIN_TEMPERATURE = 34;
export const MAX_TEMPERATURE = 43;
/** The history returns check-ins from this many past days... */
export const HISTORY_DAYS = 14;
/** ...but never more than this many entries. */
export const HISTORY_MAX_ENTRIES = 500;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface CreateSymptomEntryInput {
  temperature: number;
  wellbeing: Rating;
  appetite: Rating;
  sleep: Rating;
  notes?: string;
}

/** Sample recovery over the previous days, oldest first, so the overview has a trend to show. */
const SEED_DAYS: CreateSymptomEntryInput[] = [
  {temperature: 38.6, wellbeing: 1, appetite: 2, sleep: 2, notes: 'Sore throat, headache'},
  {temperature: 38.3, wellbeing: 2, appetite: 2, sleep: 1, notes: 'Coughing at night'},
  {temperature: 37.9, wellbeing: 2, appetite: 3, sleep: 3},
  {temperature: 37.4, wellbeing: 3, appetite: 3, sleep: 3},
  {temperature: 37.0, wellbeing: 4, appetite: 4, sleep: 3},
  {temperature: 36.8, wellbeing: 4, appetite: 4, sleep: 4},
];

/** One morning check-in per day for the six days before `now`, newest first; today is left for the user. */
export function seedEntries(now: Date): Omit<SymptomEntry, 'id'>[] {
  return SEED_DAYS.map((day, index) => {
    const recordedAt = new Date(now);
    recordedAt.setUTCDate(recordedAt.getUTCDate() - (SEED_DAYS.length - index));
    recordedAt.setUTCHours(7, 30, 0, 0);
    return {
      recordedAt: recordedAt.toISOString(),
      temperature: day.temperature,
      wellbeing: day.wellbeing,
      appetite: day.appetite,
      sleep: day.sleep,
      notes: day.notes ?? null,
    };
  }).reverse();
}

/** Entries newest first, limited to the last {@link HISTORY_DAYS} days. */
export function recentHistory(entries: SymptomEntry[], now: Date): SymptomEntry[] {
  const since = now.getTime() - HISTORY_DAYS * DAY_MS;
  return entries
    .filter((entry) => Date.parse(entry.recordedAt) >= since)
    .slice(0, HISTORY_MAX_ENTRIES);
}
