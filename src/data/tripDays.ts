import { addDays, format } from 'date-fns'
import { tripConfig } from '../config/trip'
import type { TripDay } from '../types'

export function parseDateOnly(value: string) { const [year, month, day] = value.split('-').map(Number); return new Date(year, month - 1, day, 12) }
export function formatDate(value: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) { return new Intl.DateTimeFormat('de-DE', options).format(parseDateOnly(value)) }
export function createTripDays(): TripDay[] {
  const start = parseDateOnly(tripConfig.startDate); const end = parseDateOnly(tripConfig.endDate); const days: TripDay[] = []
  for (let date = start, index = 0; date <= end; date = addDays(date, 1), index += 1) {
    const value = format(date, 'yyyy-MM-dd'); const isStart = value === tripConfig.startDate; const isArrival = value === tripConfig.arrivalDate; const isEnd = value === tripConfig.endDate
    days.push({ id: `local-${value}`, date: value, dayNumber: index + 1, title: isStart ? 'Unsere Reise beginnt' : isArrival ? 'Willkommen auf den Malediven' : isEnd ? 'Rückreise' : `Reisetag ${index + 1}`, description: isStart ? 'Abflug um 15:30 Uhr ab Hamburg.' : isArrival ? 'Ankunft in Malé und Transfer per Wasserflugzeug zum Resort.' : isEnd ? 'Unser letzter Reisetag.' : '', public: true, activities: [] })
  }
  return days
}
