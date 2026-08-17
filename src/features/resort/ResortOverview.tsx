import { useCallback, useState } from 'react'
import { Fish, Heart, Home, Sailboat, Sparkles, Sunset, Utensils, Wine, type LucideIcon } from 'lucide-react'
import { resortGuide } from './resortData'
import { ResortDetailSheet } from './ResortDetailSheet'
import type { ResortCategory, ResortGuideCategory } from './resortTypes'

const icons: Record<ResortCategory, LucideIcon> = {
  villa: Home,
  restaurants: Utensils,
  'bars-pools': Wine,
  spa: Sparkles,
  snorkeling: Fish,
  activities: Sailboat,
  experiences: Sunset,
  honeymoon: Heart,
}

export function ResortOverview() {
  const [selected, setSelected] = useState<ResortGuideCategory | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return <>
    <div className="resort-category-grid">{resortGuide.map(category=>{
      const Icon=icons[category.id]
      return <button className="resort-category-card" key={category.id} onClick={()=>setSelected(category)} aria-haspopup="dialog">
        <span><Icon/></span><div><h3>{category.title}</h3><p>{category.summary}</p></div><b>{String(category.items.length).padStart(2,'0')}</b>
      </button>
    })}</div>
    <p className="resort-guide-freshness"><strong>Stand: August 2026</strong><span>Öffnungszeiten und Angebote können sich kurzfristig ändern. Im Zweifel gelten die aktuellen Informationen des Resorts vor Ort.</span></p>
    {selected&&<ResortDetailSheet category={selected} onClose={close}/>}</>
}
