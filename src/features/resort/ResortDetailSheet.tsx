import { useEffect } from 'react'
import { X } from 'lucide-react'
import { ResortItemCard } from './ResortItemCard'
import type { ResortGuideCategory } from './resortTypes'

export function ResortDetailSheet({ category, onClose }: { category: ResortGuideCategory; onClose(): void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape) }
  }, [onClose])

  return <div className="resort-guide-backdrop" onMouseDown={event=>event.target===event.currentTarget&&onClose()}>
    <dialog className="resort-guide-sheet" open aria-modal="true" aria-labelledby="resort-guide-title">
      <div className="resort-guide-sheet-head"><div><p className="eyebrow">SUN SIYAM IRU VELI</p><h2 id="resort-guide-title">{category.title}</h2><p>{category.summary}</p></div><button onClick={onClose} aria-label="Resort-Guide schließen"><X/></button></div>
      {category.introduction&&<p className="resort-guide-intro">{category.introduction}</p>}
      <div className="resort-item-list">{category.items.map(item=><ResortItemCard key={item.id} item={item} onNavigate={onClose}/>)}</div>
      <footer><strong>Stand: August 2026</strong><span>Öffnungszeiten und Angebote können sich kurzfristig ändern. Im Zweifel gelten die aktuellen Informationen des Resorts vor Ort.</span></footer>
    </dialog>
  </div>
}
