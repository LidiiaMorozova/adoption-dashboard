/** 1 = very poor … 5 = very good. */
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface SymptomEntry {
  id: string;
  recordedAt: string;
  /** Body temperature in °C, one decimal. */
  temperature: number;
  wellbeing: Rating;
  appetite: Rating;
  sleep: Rating;
  notes: string | null;
}
