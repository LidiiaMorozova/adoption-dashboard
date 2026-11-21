import {Inject, Injectable} from '@nestjs/common';
import {randomUUID} from 'node:crypto';
import {CLOCK, type Clock} from '../clock';
import {recentHistory, seedEntries, type CreateSymptomEntryInput} from './covid.rules';
import type {SymptomEntry} from './covid.types';

/** In-memory log of symptom check-ins, newest first. */
@Injectable()
export class CovidService {
  private readonly entries: SymptomEntry[];

  constructor(@Inject(CLOCK) private readonly clock: Clock) {
    this.entries = seedEntries(this.clock()).map((entry) => ({id: randomUUID(), ...entry}));
  }

  list(): SymptomEntry[] {
    return recentHistory(this.entries, this.clock());
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
}
