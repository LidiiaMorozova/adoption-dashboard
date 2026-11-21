// Pure scheduling rules, free of NestJS and Node APIs, so the browser demo build reuses them.
import {addDays, addMinutes, dateInTimeZone, isWeekend} from './calendar';

export const DEFAULT_CLINIC_TIME_ZONE = 'Europe/Brussels';
/** Number of bookable days, starting tomorrow. */
export const BOOKING_WINDOW_DAYS = 14;
export const SLOT_MINUTES = 30;
/** Weekday opening hours, with a lunch break from 12:00 to 13:00. */
export const SLOT_STARTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];
/** Share of slots that start out taken, so the demo calendar looks lived-in. */
const SEED_TAKEN_PERCENT = 30;

export const SLOT_ID_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export interface ScheduledSlot {
  /** `YYYY-MM-DDTHH:mm`. */
  id: string;
  date: string;
  start: string;
  end: string;
  /** Whether the slot is already taken before anyone books through the app. */
  takenAtStart: boolean;
}

/** FNV-1a; gives every slot a stable pseudo-random starting state. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** The bookable dates: the {@link BOOKING_WINDOW_DAYS} days after today in the clinic's time zone. */
export function bookingWindow(now: Date, timeZone: string): string[] {
  const today = dateInTimeZone(now, timeZone);
  return Array.from({length: BOOKING_WINDOW_DAYS}, (_, i) => addDays(today, i + 1));
}

/** The slots of one day in the window; weekends have none, and the second working day is fully booked. */
export function scheduleForDay(date: string, window: string[]): ScheduledSlot[] {
  if (!window.includes(date) || isWeekend(date)) return [];
  const fullyBooked = date === window.filter((day) => !isWeekend(day))[1];
  return SLOT_STARTS.map((start) => {
    const id = `${date}T${start}`;
    return {
      id,
      date,
      start,
      end: addMinutes(start, SLOT_MINUTES),
      takenAtStart: fullyBooked || hash(id) % 100 < SEED_TAKEN_PERCENT,
    };
  });
}
