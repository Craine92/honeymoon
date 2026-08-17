import type { Memory, ReefSighting } from '../../types'
import { tripLength } from '../../hooks/useTripPhase'

export function Stats({ sightings, memories, highlights = 0 }: { sightings: ReefSighting[]; memories: Memory[]; highlights?: number }) {
  const total = sightings.reduce((sum, sighting) => sum + sighting.count, 0)
  const species = new Set(sightings.map(s => s.species?.trim().toLocaleLowerCase('de-DE') || s.animalType)).size
  const stats = [{ n: tripLength, label: 'Reisetage' }, { n: sightings.length, label: 'Riff-Sichtungen' }, { n: total, label: 'gesichtete Tiere' }, { n: species, label: 'verschiedene Arten' }, { n: memories.length, label: 'Erinnerungen' }, { n: highlights, label: 'Highlights' }]
  return <div className="stats-grid">{stats.map(s => <div className="stat" key={s.label}><strong>{s.n}</strong><span>{s.label}</span></div>)}</div>
}
