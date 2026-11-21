// Mirrors server/src/appointments/appointments.types.ts.

export interface DaySummary {
  date: string;
  availableSlots: number;
  totalSlots: number;
}

export interface Slot {
  id: string;
  date: string;
  start: string;
  end: string;
  available: boolean;
}

export interface Booking {
  id: string;
  slotId: string;
  date: string;
  start: string;
  end: string;
  patientName: string;
  email: string;
  reason: string | null;
  createdAt: string;
}

export interface BookingRequest {
  slotId: string;
  patientName: string;
  email: string;
  reason?: string;
}

export const SLOT_TAKEN = 'SLOT_TAKEN';
