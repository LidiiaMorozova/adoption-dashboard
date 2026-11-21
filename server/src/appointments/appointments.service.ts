import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {randomUUID} from 'node:crypto';
import {addDays, addMinutes, dateInTimeZone, isWeekend} from './calendar';
import {Booking, DaySummary, ErrorCode, Slot} from './appointments.types';
import {CLOCK, type Clock} from '../clock';

export const CLINIC_TIME_ZONE = Symbol('CLINIC_TIME_ZONE');

/** Number of bookable days, starting tomorrow. */
export const BOOKING_WINDOW_DAYS = 14;
export const SLOT_MINUTES = 30;
/** Weekday opening hours, with a lunch break from 12:00 to 13:00. */
const SLOT_STARTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];
/** Share of slots that start out taken, so the demo calendar looks lived-in. */
const SEED_TAKEN_PERCENT = 30;
const SEED_BOOKING = 'seed';

interface SlotRecord {
  id: string;
  date: string;
  start: string;
  end: string;
  bookingId: string | null;
}

export interface CreateBookingInput {
  slotId: string;
  patientName: string;
  email: string;
  reason?: string;
}

/** FNV-1a; gives every slot a stable pseudo-random seed state. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * In-memory appointment calendar.
 *
 * `book` checks and claims a slot in one synchronous step, so two concurrent requests for the
 * same slot cannot both succeed: the second one gets a 409 `SLOT_TAKEN`.
 */
@Injectable()
export class AppointmentsService {
  private readonly days = new Map<string, Map<string, SlotRecord>>();
  private readonly bookings = new Map<string, Booking>();

  constructor(
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(CLINIC_TIME_ZONE) private readonly timeZone: string,
  ) {}

  listDays(): DaySummary[] {
    return this.windowDates().map((date) => {
      const slots = [...this.slotsFor(date).values()];
      return {
        date,
        totalSlots: slots.length,
        availableSlots: slots.filter((slot) => slot.bookingId === null).length,
      };
    });
  }

  /** Slots of one day; dates outside the booking window have none. */
  listSlots(date: string): Slot[] {
    if (!this.windowDates().includes(date)) return [];
    return [...this.slotsFor(date).values()].map(toSlot);
  }

  book(input: CreateBookingInput): Booking {
    const date = input.slotId.slice(0, 10);
    const slot = this.windowDates().includes(date) ? this.slotsFor(date).get(input.slotId) : undefined;
    if (!slot) {
      throw new NotFoundException({
        statusCode: 404,
        code: ErrorCode.SlotNotFound,
        message: 'This time slot does not exist.',
      });
    }
    if (slot.bookingId !== null) {
      throw new ConflictException({
        statusCode: 409,
        code: ErrorCode.SlotTaken,
        message: 'This time slot has just been booked by someone else.',
      });
    }

    const booking: Booking = {
      id: randomUUID(),
      slotId: slot.id,
      date: slot.date,
      start: slot.start,
      end: slot.end,
      patientName: input.patientName,
      email: input.email,
      reason: input.reason ?? null,
      createdAt: this.clock().toISOString(),
    };
    slot.bookingId = booking.id;
    this.bookings.set(booking.id, booking);
    return booking;
  }

  getBooking(id: string): Booking {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new NotFoundException({
        statusCode: 404,
        code: ErrorCode.BookingNotFound,
        message: 'Booking not found.',
      });
    }
    return booking;
  }

  private windowDates(): string[] {
    const today = dateInTimeZone(this.clock(), this.timeZone);
    return Array.from({length: BOOKING_WINDOW_DAYS}, (_, i) => addDays(today, i + 1));
  }

  /** The second working day of the window is fully booked, to show the "no free slots" state. */
  private fullyBookedDate(): string | undefined {
    return this.windowDates().filter((date) => !isWeekend(date))[1];
  }

  private slotsFor(date: string): Map<string, SlotRecord> {
    let slots = this.days.get(date);
    if (!slots) {
      slots = new Map();
      if (!isWeekend(date)) {
        const fullyBooked = date === this.fullyBookedDate();
        for (const start of SLOT_STARTS) {
          const id = `${date}T${start}`;
          const taken = fullyBooked || hash(id) % 100 < SEED_TAKEN_PERCENT;
          slots.set(id, {
            id,
            date,
            start,
            end: addMinutes(start, SLOT_MINUTES),
            bookingId: taken ? SEED_BOOKING : null,
          });
        }
      }
      this.days.set(date, slots);
    }
    return slots;
  }
}

function toSlot(record: SlotRecord): Slot {
  return {
    id: record.id,
    date: record.date,
    start: record.start,
    end: record.end,
    available: record.bookingId === null,
  };
}
