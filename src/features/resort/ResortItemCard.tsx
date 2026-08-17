import { ArrowRight, CalendarCheck2, Clock3, MapPin, Shirt } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ResortGuideItem, ResortReservation } from './resortTypes'

const reservationLabels: Record<ResortReservation, string> = {
  required: 'Reservierung erforderlich',
  recommended: 'Reservierung empfohlen',
  'not-required': 'Keine Reservierung erforderlich',
}

export function ResortItemCard({ item, onNavigate }: { item: ResortGuideItem; onNavigate(): void }) {
  return <article className="resort-item-card">
    <header><p className="eyebrow">{item.subtitle}</p><h3>{item.name}</h3></header>
    <p className="resort-item-description">{item.description}</p>
    {item.openingHours?.length&&<div className="resort-hours">{item.openingHours.map(hour=><div key={`${hour.label}-${hour.time}`}><Clock3/><span><b>{hour.label}</b><strong>{hour.time}</strong>{hour.detail&&<small>{hour.detail}</small>}</span></div>)}</div>}
    {(item.location||item.reservation||item.attire)&&<div className="resort-facts">
      {item.location&&<p><MapPin/><span><b>Lage</b>{item.location}</span></p>}
      {item.reservation&&<p><CalendarCheck2/><span><b>Reservierung</b>{reservationLabels[item.reservation]}</span></p>}
      {item.attire&&<p><Shirt/><span><b>Dresscode</b>{item.attire}</span></p>}
    </div>}
    {item.features?.length&&<div className="resort-tags">{item.features.map(feature=><span key={feature}>{feature}</span>)}</div>}
    {item.note&&<p className="resort-item-note">{item.note}</p>}
    {item.appLinks?.length&&<div className="resort-app-links">{item.appLinks.map(link=><Link key={link.to+link.label} to={link.to} onClick={onNavigate}>{link.label}<ArrowRight/></Link>)}</div>}
  </article>
}
