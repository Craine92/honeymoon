export interface WeatherPresentation { label: string; icon: string }
export function weatherPresentation(code: number): WeatherPresentation {
  if (code === 0) return { label: 'Klar', icon: '☀' }
  if (code === 1) return { label: 'Überwiegend klar', icon: '🌤' }
  if (code === 2) return { label: 'Teilweise bewölkt', icon: '⛅' }
  if (code === 3) return { label: 'Bewölkt', icon: '☁' }
  if ([45,48].includes(code)) return { label: 'Neblig', icon: '≋' }
  if ([51,53,55,56,57].includes(code)) return { label: 'Nieselregen', icon: '🌦' }
  if ([61,63,65,66,67].includes(code)) return { label: 'Regen', icon: '🌧' }
  if ([80,81,82].includes(code)) return { label: 'Regenschauer', icon: '🌦' }
  if ([95,96,99].includes(code)) return { label: 'Gewitter', icon: '⛈' }
  return { label: 'Wechselhaft', icon: '◌' }
}
export function compassDirection(degrees?: number) { if (degrees === undefined) return '–'; return ['N','NO','O','SO','S','SW','W','NW'][Math.round(degrees / 45) % 8] }
