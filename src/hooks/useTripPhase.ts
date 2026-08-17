import { differenceInCalendarDays, differenceInDays, intervalToDuration } from 'date-fns'
import { tripConfig } from '../config/trip'
import { parseDateOnly } from '../data/tripDays'

export function getTripPhase(now = new Date()) {
  const departure = new Date(tripConfig.departureAt); const arrivalStart = new Date('2026-08-31T00:00:00+05:00'); const arrivalEnd = new Date('2026-09-01T00:00:00+05:00'); const end = new Date('2026-09-10T23:59:59+05:00')
  if (now < departure) { const duration = intervalToDuration({ start: now, end: departure }); const days = differenceInCalendarDays(departure, now); const detail = days <= 2 ? `${duration.hours ?? 0} Std. ${duration.minutes ?? 0} Min. bis zum Abflug` : 'Abflug am 30. August 2026 um 15:30 Uhr'; return { phase: 'before' as const, eyebrow: 'UNSERE FLITTERWOCHEN', headline: `Noch ${days} ${days === 1 ? 'Tag' : 'Tage'}`, detail } }
  if (now < arrivalStart) return { phase: 'travel' as const, eyebrow: 'HAMBURG → MALEDIVEN', headline: 'Unsere Reise hat begonnen ✈️', detail: 'Auf dem Weg ins Paradies' }
  if (now < arrivalEnd) return { phase: 'arrival' as const, eyebrow: '31. AUGUST 2026', headline: 'Willkommen auf den Malediven 🌴', detail: 'Malé → Dhaalu Atoll' }
  if (now <= end) { const day = differenceInCalendarDays(now, new Date('2026-08-30T00:00:00+05:00')) + 1; return { phase: 'during' as const, eyebrow: 'MALEDIVEN 2026', headline: `Tag ${day} unserer Hochzeitsreise`, detail: tripConfig.resort } }
  return { phase: 'after' as const, eyebrow: 'PHILIPP & JUSTINE', headline: 'Unsere Hochzeitsreise', detail: 'Erinnerungen für immer' }
}
export const tripLength = differenceInDays(parseDateOnly(tripConfig.endDate), parseDateOnly(tripConfig.startDate)) + 1
