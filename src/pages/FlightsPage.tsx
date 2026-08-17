import { Clock3, Plane } from 'lucide-react'
import { getJourneyMoment } from '../features/flights/flightConfig'
import { FlightTimeline } from '../features/flights/FlightTimeline'
import { useFlightStatuses } from '../features/flights/useFlightStatuses'

export function FlightsPage(){
  const{flights,statuses,configured,loading,unavailable,lastChecked}=useFlightStatuses()
  const moment=getJourneyMoment(statuses)
  const featuredId=(moment.flight||moment.nextFlight)?.id
  return <div className="page-content page-top flights-page">
    <header className="page-hero"><p className="eyebrow">HAMBURG · DUBAI · MALÉ</p><h1>Unsere Flüge</h1><p>Vier Flüge, zwei Zwischenstopps und ein Ziel: unser kleines Paradies im Indischen Ozean.</p></header>
    {loading&&<div className="flight-skeleton" aria-label="Flugstatus wird geladen"><i/><i/></div>}
    {configured===false&&<div className="flight-notice"><Clock3/><div><strong>Live-Status noch nicht eingerichtet</strong><p>Der vollständige Flugplan ist trotzdem verfügbar. Live-Daten können später sicher über Supabase aktiviert werden.</p></div></div>}
    {configured&&unavailable&&<div className="flight-notice"><Clock3/><div><strong>Live-Status momentan nicht verfügbar</strong><p>Der statische Flugplan bleibt vollständig sichtbar. Die App versucht es später automatisch erneut.</p></div></div>}
    {configured&&lastChecked&&<p className="flight-updated">Live-Status zuletzt geprüft: {new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'}).format(new Date(lastChecked))} Uhr</p>}
    {moment.kind==='flying'&&moment.flight&&<div className="family-flight-banner"><Plane/><div><p className="eyebrow">GERADE UNTERWEGS</p><h2>Philipp & Justine sind unterwegs nach {moment.flight.arrival.city} ✈️</h2></div></div>}
    {moment.kind==='completed'&&<div className="family-flight-banner"><Plane/><div><p className="eyebrow">WIEDER ZU HAUSE</p><h2>Alle Flüge abgeschlossen</h2></div></div>}
    <FlightTimeline title="Von Hamburg auf die Malediven" flights={flights.filter(f=>f.direction==='outbound')} statuses={statuses} featuredId={featuredId}/>
    <FlightTimeline title="Von Malé zurück nach Hamburg" flights={flights.filter(f=>f.direction==='return')} statuses={statuses} featuredId={featuredId}/>
    <p className="flight-time-note">Alle Zeiten sind lokale Flughafenzeiten: Hamburg (Europe/Berlin), Dubai (Asia/Dubai), Malé (Indian/Maldives).</p>
  </div>
}
