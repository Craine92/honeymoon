import { ArrowRight, Plane } from 'lucide-react'
import { Link } from 'react-router-dom'
import { countdownTo, getJourneyMoment, updatesByFlight } from './flightConfig'
import { FlightStatusBadge } from './FlightStatusBadge'
import { useData } from '../../hooks/useData'

export function HomeFlightCard(){
  const{flightUpdates,flightUpdatesLoading}=useData();const statuses=updatesByFlight(flightUpdates);const moment=getJourneyMoment(statuses);const flight=moment.flight||moment.nextFlight
  if(moment.kind==='completed')return <article className="feature-card home-flight"><Plane/><p className="eyebrow">UNSERE FLÜGE</p><h3>Wieder zuhause ❤️</h3><p>Alle Flüge sind abgeschlossen – mit unvergesslichen Erinnerungen im Gepäck.</p><Link to="/flights">Flüge ansehen <ArrowRight/></Link></article>
  if(moment.kind==='at-destination')return <article className="feature-card home-flight"><Plane/><p className="eyebrow">HINREISE ABGESCHLOSSEN</p><h3>Willkommen auf den Malediven 🌴</h3><p>Der nächste Rückflug wird am Reisetag wieder hervorgehoben.</p><Link to="/flights">Flugplan ansehen <ArrowRight/></Link></article>
  if(!flight)return null
  const status=statuses[flight.id];const title=status?.status==='boarding'?`Boarding für ${flight.flightNumber} ✈️`:status?.status==='checkin'?`Check-in für ${flight.flightNumber} geöffnet`:status?.status==='delayed'?`${flight.flightNumber} verspätet`:moment.kind==='flying'?'Wir sind unterwegs ✈️':moment.kind==='layover'?'Zwischenstopp in Dubai':'Unser nächster Flug';const date=new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long'}).format(new Date(`${flight.date}T12:00:00`))
  return <article className="feature-card home-flight"><Plane/><p className="eyebrow">{title.toUpperCase()}</p><h3>{flight.flightNumber} · {flight.departure.city} → {flight.arrival.city}</h3>{moment.kind==='upcoming'&&!status&&<strong>{countdownTo(flight.departureAt)}</strong>}{moment.kind==='upcoming'&&<p>{date} · {status?.estimatedDeparture||flight.departureTime} Uhr</p>}{moment.kind==='layover'&&<p>Nächster Flug um {flight.departureTime} Uhr</p>}<FlightStatusBadge status={status}/>{status?.gate&&<p>Gate {status.gate}</p>}{status?.note&&<small className="home-flight-note">{status.note}</small>}{flightUpdatesLoading&&<i className="flight-inline-skeleton"/>}<Link to="/flights">Alle Flüge <ArrowRight/></Link></article>
}
