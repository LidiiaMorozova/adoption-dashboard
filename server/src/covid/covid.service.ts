import {Inject, Injectable} from '@nestjs/common';
import {randomUUID} from 'node:crypto';
import {CLOCK, type Clock} from '../clock';
import type {Rating, SymptomEntry} from './covid.types';

/** The history endpoint returns check-ins from this many past days... */
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

/** In-memory log of symptom check-ins, newest first. */
@Injectable()
export class CovidService {
  private readonly entries: SymptomEntry[] = [];

  constructor(@Inject(CLOCK) private readonly clock: Clock) {
    this.seed();
  }

  /** Check-ins of the last {@link HISTORY_DAYS} days, newest first. */
  list(): SymptomEntry[] {
    const since = this.clock().getTime() - HISTORY_DAYS * DAY_MS;
    return this.entries
      .filter((entry) => Date.parse(entry.recordedAt) >= since)
      .slice(0, HISTORY_MAX_ENTRIES);
  }

  create(input: CreateSymptomEntryInput): SymptomEntry {
    const entry: SymptomEntry = {
      id: randomUUID(),
      recordedAt: this.clock().toISOString(),
      temperature: input.temperature,
      wellbeing: input.wellbeing,
      appetite: input.appetite,
      sleep: input.sleep,
      notes: input.notes || null,
    };
    this.entries.unshift(entry);
    return entry;
  }

  /** One morning check-in per day for the days before today; today is left for the user. */
  private seed(): void {
    const now = this.clock();
    SEED_DAYS.forEach((day, index) => {
      const recordedAt = new Date(now);
      recordedAt.setUTCDate(recordedAt.getUTCDate() - (SEED_DAYS.length - index));
      recordedAt.setUTCHours(7, 30, 0, 0);
      this.entries.unshift({
        id: randomUUID(),
        recordedAt: recordedAt.toISOString(),
        temperature: day.temperature,
        wellbeing: day.wellbeing,
        appetite: day.appetite,
        sleep: day.sleep,
        notes: day.notes ?? null,
      });
    });
  }
}
