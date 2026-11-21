import {request} from './http';
import type {Booking, BookingRequest, DaySummary, Slot} from '@/types/appointments';

export const appointmentsApi = {
  listDays: () => request<DaySummary[]>('/appointments/days'),

  listSlots: (date: string) =>
    request<Slot[]>(`/appointments/slots?date=${encodeURIComponent(date)}`),

  createBooking: (body: BookingRequest) =>
    request<Booking>('/appointments/bookings', {method: 'POST', body: JSON.stringify(body)}),
};
