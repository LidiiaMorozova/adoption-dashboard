import {ConflictException, NotFoundException} from '@nestjs/common';
import {AppointmentsService, BOOKING_WINDOW_DAYS} from './appointments.service';

// Monday 2 March 2026, 10:00 in Brussels.
const NOW = new Date('2026-03-02T09:00:00Z');

function createService(now = NOW): AppointmentsService {
  return new AppointmentsService(() => now, 'Europe/Brussels');
}

describe('AppointmentsService', () => {
  it('lists the booking window starting tomorrow', () => {
    const days = createService().listDays();

    expect(days).toHaveLength(BOOKING_WINDOW_DAYS);
    expect(days[0]?.date).toBe('2026-03-03');
    expect(days.at(-1)?.date).toBe('2026-03-16');
  });

  it('has no slots at weekends', () => {
    const service = createService();

    expect(service.listSlots('2026-03-07')).toEqual([]);
    expect(service.listDays().find((day) => day.date === '2026-03-07')).toEqual({
      date: '2026-03-07',
      totalSlots: 0,
      availableSlots: 0,
    });
  });

  it('fully books the second working day', () => {
    const day = createService().listDays().find((d) => d.date === '2026-03-04');

    expect(day?.totalSlots).toBeGreaterThan(0);
    expect(day?.availableSlots).toBe(0);
  });

  it('returns no slots outside the booking window', () => {
    const service = createService();

    expect(service.listSlots('2026-03-02')).toEqual([]);
    expect(service.listSlots('2026-04-30')).toEqual([]);
  });

  it('books a free slot and marks it unavailable', () => {
    const service = createService();
    const free = service.listSlots('2026-03-03').find((slot) => slot.available);
    if (!free) throw new Error('expected a free slot');

    const booking = service.book({slotId: free.id, patientName: 'Test Patient', email: 'test@example.com'});

    expect(booking).toMatchObject({slotId: free.id, start: free.start, end: free.end, reason: null});
    expect(service.listSlots('2026-03-03').find((slot) => slot.id === free.id)?.available).toBe(false);
    expect(service.getBooking(booking.id)).toEqual(booking);
  });

  it('rejects a second booking of the same slot with a conflict', () => {
    const service = createService();
    const free = service.listSlots('2026-03-03').find((slot) => slot.available);
    if (!free) throw new Error('expected a free slot');
    service.book({slotId: free.id, patientName: 'First', email: 'first@example.com'});

    expect(() => service.book({slotId: free.id, patientName: 'Second', email: 'second@example.com'}))
      .toThrow(ConflictException);
  });

  it('rejects unknown slots', () => {
    const service = createService();

    expect(() => service.book({slotId: '2026-03-03T08:00', patientName: 'A B', email: 'a@b.co'}))
      .toThrow(NotFoundException);
    expect(() => service.book({slotId: '2026-03-07T09:00', patientName: 'A B', email: 'a@b.co'}))
      .toThrow(NotFoundException);
  });
});
