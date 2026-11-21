/**
 * Browser-only stand-in for the REST API, used by the static demo build (`VITE_DEMO=true`).
 *
 * It answers the same routes with the same shapes and status codes as the NestJS server,
 * reusing the server's scheduling rules and sample data. State lives in `localStorage`, and
 * every request reads it afresh, so two tabs see each other's bookings, which is how the
 * "slot taken by someone else" case can be tried out on a static site.
 */
import {dashboardData} from '@server/dashboard/dashboard.data';
import {isIsoDate} from '@server/appointments/calendar';
import {
  bookingWindow,
  DEFAULT_CLINIC_TIME_ZONE,
  scheduleForDay,
  SLOT_ID_PATTERN,
} from '@server/appointments/schedule';
import {MAX_TEMPERATURE, MIN_TEMPERATURE, recentHistory, seedEntries} from '@server/covid/covid.rules';
import {SLOT_TAKEN, type Booking, type DaySummary, type Slot} from '@/types/appointments';
import type {SymptomEntry} from '@/types/covid';

const STORAGE_KEY = 'bewell-demo-v1';
/** Short pause per request, so loading states are visible as they would be online. */
const LATENCY_MS = 250;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DemoState {
  bookings: Booking[];
  symptomEntries: SymptomEntry[];
}

export interface DemoResponse {
  status: number;
  body: unknown;
}

const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;

// Used when storage is unavailable (private mode, blocked site data); then data lasts until reload.
let memoryState: DemoState | null = null;

function initialState(): DemoState {
  return {
    bookings: [],
    symptomEntries: seedEntries(new Date()).map((entry) => ({id: newId(), ...entry})),
  };
}

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DemoState;
  } catch {
    // Fall through to the in-memory copy.
  }
  if (!memoryState) {
    memoryState = initialState();
    saveState(memoryState);
  }
  return memoryState;
}

function saveState(state: DemoState): void {
  memoryState = state;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the in-memory copy only.
  }
}

/** Clears everything saved by the demo; the next request starts from the sample data again. */
export function resetDemoData(): void {
  memoryState = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored.
  }
}

const ok = (body: unknown, status = 200): DemoResponse => ({status, body});
const fail = (status: number, message: string | string[], code?: string): DemoResponse =>
  ({status, body: {statusCode: status, message, ...(code ? {code} : {})}});

const trimmed = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const isRating = (value: unknown) => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 5;

function slotsFor(date: string, state: DemoState): Slot[] {
  const window = bookingWindow(new Date(), DEFAULT_CLINIC_TIME_ZONE);
  const booked = new Set(state.bookings.map((booking) => booking.slotId));
  return scheduleForDay(date, window).map((slot) => ({
    id: slot.id,
    date: slot.date,
    start: slot.start,
    end: slot.end,
    available: !slot.takenAtStart && !booked.has(slot.id),
  }));
}

function listDays(state: DemoState): DaySummary[] {
  return bookingWindow(new Date(), DEFAULT_CLINIC_TIME_ZONE).map((date) => {
    const slots = slotsFor(date, state);
    return {date, totalSlots: slots.length, availableSlots: slots.filter((slot) => slot.available).length};
  });
}

function createBooking(body: Record<string, unknown>, state: DemoState): DemoResponse {
  const slotId = typeof body.slotId === 'string' ? body.slotId : '';
  const patientName = trimmed(body.patientName);
  const email = trimmed(body.email);
  const reason = trimmed(body.reason);

  const errors = [
    !SLOT_ID_PATTERN.test(slotId) && 'slotId must look like YYYY-MM-DDTHH:mm',
    !patientName && 'patientName is required',
    patientName.length > 100 || (patientName && patientName.length < 2) ? 'patientName must be between 2 and 100 characters' : '',
    (!EMAIL_PATTERN.test(email) || email.length > 254) && 'email must be a valid email address',
    reason.length > 500 && 'reason must be shorter than or equal to 500 characters',
  ].filter((error): error is string => Boolean(error));
  if (errors.length) return fail(400, errors);

  const slot = slotsFor(slotId.slice(0, 10), state).find((candidate) => candidate.id === slotId);
  if (!slot) return fail(404, 'This time slot does not exist.', 'SLOT_NOT_FOUND');
  if (!slot.available) return fail(409, 'This time slot has just been booked by someone else.', SLOT_TAKEN);

  const booking: Booking = {
    id: newId(),
    slotId: slot.id,
    date: slot.date,
    start: slot.start,
    end: slot.end,
    patientName,
    email,
    reason: reason || null,
    createdAt: new Date().toISOString(),
  };
  saveState({...state, bookings: [...state.bookings, booking]});
  return ok(booking, 201);
}

function createSymptomEntry(body: Record<string, unknown>, state: DemoState): DemoResponse {
  const temperature = body.temperature;
  const notes = trimmed(body.notes);
  const errors = [
    (typeof temperature !== 'number' || Math.round(temperature * 10) !== temperature * 10)
      && 'temperature must be a number with at most one decimal',
    typeof temperature === 'number' && (temperature < MIN_TEMPERATURE || temperature > MAX_TEMPERATURE)
      && `temperature must be between ${MIN_TEMPERATURE} and ${MAX_TEMPERATURE}`,
    !isRating(body.wellbeing) && 'wellbeing must be an integer from 1 to 5',
    !isRating(body.appetite) && 'appetite must be an integer from 1 to 5',
    !isRating(body.sleep) && 'sleep must be an integer from 1 to 5',
    notes.length > 500 && 'notes must be shorter than or equal to 500 characters',
  ].filter((error): error is string => Boolean(error));
  if (errors.length) return fail(400, errors);

  const entry = {
    id: newId(),
    recordedAt: new Date().toISOString(),
    temperature,
    wellbeing: body.wellbeing,
    appetite: body.appetite,
    sleep: body.sleep,
    notes: notes || null,
  } as SymptomEntry;
  saveState({...state, symptomEntries: [entry, ...state.symptomEntries]});
  return ok(entry, 201);
}

export async function demoRequest(method: string, path: string, body?: unknown): Promise<DemoResponse> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  const url = new URL(path, 'http://demo.local');
  const route = `${method.toUpperCase()} ${url.pathname}`;
  const payload = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const state = loadState();

  if (route === 'GET /health') return ok({status: 'ok'});
  if (route === 'GET /dashboard') return ok(dashboardData);
  if (route === 'GET /appointments/days') return ok(listDays(state));
  if (route === 'GET /appointments/slots') {
    const date = url.searchParams.get('date') ?? '';
    if (!isIsoDate(date)) return fail(400, ['date must be a valid date in YYYY-MM-DD format']);
    return ok(slotsFor(date, state));
  }
  if (route === 'POST /appointments/bookings') return createBooking(payload, state);
  const bookingMatch = route.match(/^GET \/appointments\/bookings\/([\w-]+)$/);
  if (bookingMatch) {
    const booking = state.bookings.find((candidate) => candidate.id === bookingMatch[1]);
    return booking ? ok(booking) : fail(404, 'Booking not found.', 'BOOKING_NOT_FOUND');
  }
  if (route === 'GET /covid/symptom-entries') return ok(recentHistory(state.symptomEntries, new Date()));
  if (route === 'POST /covid/symptom-entries') return createSymptomEntry(payload, state);

  return fail(404, `Cannot ${route}`);
}
