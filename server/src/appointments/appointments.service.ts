import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {randomUUID} from 'node:crypto';
import {Booking, DaySummary, ErrorCode, Slot} from './appointments.types';
import {bookingWindow, scheduleForDay} from './schedule';
import {CLOCK, type Clock} from '../clock';

export const CLINIC_TIME_ZONE = Symbol('CLINIC_TIME_ZONE');
export {BOOKING_WINDOW_DAYS} from './schedule';

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
    return [...this.slotsFor(date).values()].map(toSlot);
  }

  book(input: CreateBookingInput): Booking {
    const slot = this.slotsFor(input.slotId.slice(0, 10)).get(input.slotId);
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
    return bookingWindow(this.clock(), this.timeZone);
  }

  /** The day's slots, created from the schedule on first use; empty outside the booking window. */
  private slotsFor(date: string): Map<string, SlotRecord> {
    const window = this.windowDates();
    if (!window.includes(date)) return new Map();

    let slots = this.days.get(date);
    if (!slots) {
      slots = new Map(scheduleForDay(date, window).map((slot) => [slot.id, {
        id: slot.id,
        date: slot.date,
        start: slot.start,
        end: slot.end,
        bookingId: slot.takenAtStart ? SEED_BOOKING : null,
      }]));
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
