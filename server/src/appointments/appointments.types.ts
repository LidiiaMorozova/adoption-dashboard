export interface DaySummary {
  date: string;
  availableSlots: number;
  totalSlots: number;
}

export interface Slot {
  /** `YYYY-MM-DDTHH:mm`, unique per clinic. */
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

export const ErrorCode = {
  SlotNotFound: 'SLOT_NOT_FOUND',
  SlotTaken: 'SLOT_TAKEN',
  BookingNotFound: 'BOOKING_NOT_FOUND',
} as const;
