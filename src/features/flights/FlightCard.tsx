import { Clock3, MapPin, Plane } from 'lucide-react'
import { formatFlightTime } from './flightConfig'
import { FlightStatusBadge } from './FlightStatusBadge'
import type { FlightPlan, FlightStatus } from './flightTypes'

export function FlightCard({flight,status,featured=false}:{flight:FlightPlan;status?:FlightStatus;featured?:boolean}){
  const expectedDeparture=formatFlightTime(status?.estimatedDeparture,flight.departure.timeZone)
  const expectedArrival=formatFlightTime(status?.estimatedArrival,flight.arrival.timeZone)
  return <article className={`flight-card${featured?' featured':''}`}>
    <header><div><span>EMIRATES</span><h2>{flight.flightNumber}</h2></div><FlightStatusBadge status={status}/></header>
    <div className="flight-route"><div><strong>{flight.departure.code}</strong><b>{flight.departureTime}</b><small>{flight.departure.city}</small></div><span><Plane/><i/></span><div><strong>{flight.arrival.code}</strong><b>{flight.arrivalTime}{flight.arrivalDayOffset?<sup> +1</sup>:''}</b><small>{flight.arrival.city}</small></div></div>
    {status?.delayMinutes!==undefined&&<div className={`delay-line ${status.delayMinutes>0?'late':'on-time'}`}>{status.delayMinutes>0?`+${status.delayMinutes} Min.`:'Pünktlich'}</div>}
    {(expectedDeparture||expectedArrival)&&<div className="flight-estimates">{expectedDeparture&&expectedDeparture!==flight.departureTime&&<span>{flight.departureTime} geplant · {expectedDeparture} erwartet</span>}{expectedArrival&&expectedArrival!==flight.arrivalTime&&<span>Ankunft {expectedArrival} erwartet</span>}</div>}
    <div className="flight-meta"><span><MapPin/> {status?.departureTerminal||flight.departure.terminal} → {status?.arrivalTerminal||flight.arrival.terminal}</span><span><Clock3/> {flight.duration}</span><span><Plane/> {status?.aircraft||flight.aircraft} · {flight.cabin}</span></div>
    {status?.stale&&<small className="stale-status">Zuletzt aktualisiert vor {status.staleMinutes||1} {status.staleMinutes===1?'Minute':'Minuten'} · momentan nicht verfügbar</small>}
    {status?.latitude!==undefined&&status.longitude!==undefined&&<div className="live-position"><strong>Live-Position</strong><span>{status.latitude.toFixed(3)}, {status.longitude.toFixed(3)}</span>{status.altitude!==undefined&&<span>{Math.round(status.altitude).toLocaleString('de-DE')} ft</span>}{status.groundSpeed!==undefined&&<span>{Math.round(status.groundSpeed)} kt</span>}</div>}
  </article>
}
