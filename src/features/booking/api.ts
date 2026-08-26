import type {
  AvailabilityQuery,
  BookingConfirmation,
  BookingRequest,
  DayAvailability,
  TimeSlot,
} from '@/types';
import { ANY_SPECIALIST } from '@/types';
import { addDays, parseIsoDate, toIsoDate } from '@/lib/format';
import { seededRandom } from '@/lib/utils';
import { getService, getSpecialistsForService } from '@/data';

/**
 * BOOKING INTEGRATION BOUNDARY
 *
 * Everything the booking UI needs from the outside world is behind these two
 * interfaces. Today they are satisfied by deterministic mocks; connecting
 * YClients, Dikidi, an in-house CRM or a REST endpoint means writing new
 * implementations and swapping the two exported instances at the bottom of
 * this file. No component imports anything else from here.
 */

export interface AvailabilityApi {
  getAvailability(query: AvailabilityQuery): Promise<DayAvailability[]>;
}

export interface BookingApi {
  submit(request: BookingRequest): Promise<BookingConfirmation>;
}

/* ----------------------------------------------------------------- config */

/** Demo working window. Real hours arrive with the salon's own schedule. */
const OPEN_HOUR = 10;
const CLOSE_HOUR = 21;
const SLOT_MINUTES = 30;
/** Minimum notice before a slot can be booked online. */
const LEAD_TIME_MINUTES = 90;

function buildGrid(durationMinutes: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const lastStart = CLOSE_HOUR * 60 - durationMinutes;
  for (let minutes = OPEN_HOUR * 60; minutes <= lastStart; minutes += SLOT_MINUTES) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return slots;
}

function minutesOf(slot: TimeSlot): number {
  const [h, m] = slot.split(':').map(Number);
  return h * 60 + m;
}

/* ------------------------------------------------------------------- mock */

/**
 * Deterministic availability.
 *
 * The same query always returns the same slots, so the calendar does not
 * reshuffle between renders and a shared link shows what the sender saw.
 * Longer services occupy more of the day and therefore look scarcer, which is
 * both realistic and honest about why blonde work needs planning.
 */
export const mockAvailabilityApi: AvailabilityApi = {
  async getAvailability(query) {
    const service = getService(query.serviceId);
    const duration = service?.duration.max ?? service?.duration.min ?? 60;

    // "Any specialist" pools capacity, so it genuinely has more free time.
    const pool =
      query.specialist === ANY_SPECIALIST
        ? getSpecialistsForService(query.serviceId).map((s) => s.id)
        : [query.specialist];

    const start = parseIsoDate(query.from);
    const now = new Date();
    const days: DayAvailability[] = [];

    for (let index = 0; index < query.days; index += 1) {
      const date = toIsoDate(addDays(start, index));
      const grid = buildGrid(duration);
      const open = new Set<TimeSlot>();

      for (const specialistId of pool) {
        const random = seededRandom(`${date}:${specialistId}:${query.serviceId}`);
        // A specialist's day is mostly booked; longer services leave fewer gaps.
        const density = duration > 180 ? 0.22 : duration > 90 ? 0.34 : 0.45;
        for (const slot of grid) {
          if (random() < density) open.add(slot);
        }
      }

      const isToday = date === toIsoDate(now);
      const cutoff = now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MINUTES;

      const slots = [...open]
        .filter((slot) => !isToday || minutesOf(slot) >= cutoff)
        .sort((a, b) => minutesOf(a) - minutesOf(b));

      days.push({ date, slots, closed: false });
    }

    // A short delay keeps the loading state on the real code path.
    await new Promise((resolve) => setTimeout(resolve, 180));
    return days;
  },
};

/**
 * Mock booking submission.
 *
 * Returns a confirmation with a quotable reference. A real implementation
 * would POST to the salon's system and surface its failure modes; the UI
 * already renders an error state for that case.
 */
export const mockBookingApi: BookingApi = {
  async submit(request) {
    await new Promise((resolve) => setTimeout(resolve, 550));

    const stamp = request.date.replace(/-/g, '').slice(4);
    const suffix = String(
      Math.abs(Math.round(seededRandom(`${request.date}${request.time}${request.phone}`)() * 9999)),
    ).padStart(4, '0');

    return {
      id: `bk_${stamp}_${suffix}`,
      request,
      reference: `LK-${stamp}-${suffix}`,
      createdAt: new Date().toISOString(),
    };
  },
};

/* --------------------------------------------------------------- exports */

export const availabilityApi: AvailabilityApi = mockAvailabilityApi;
export const bookingApi: BookingApi = mockBookingApi;
