import { useEffect, useState } from 'react'
import { Clock3, Edit3, MapPin, Plane } from 'lucide-react'
import { FlightStatusBadge } from './FlightStatusBadge'
import type { FlightPlan, FlightUpdate } from './flightTypes'

function useRelativeUpdate(value?:string){const[now,setNow]=useState(()=>Date.now());useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),60000);return()=>window.clearInterval(timer)},[]);if(!value)return undefined;const minutes=Math.max(0,Math.floor((now-new Date(value).getTime())/60000));if(minutes<1)return'gerade eben';if(minutes<60)return`vor ${minutes} ${minutes===1?'Minute':'Minuten'}`;const hours=Math.floor(minutes/60);if(hours<24)return`vor ${hours} ${hours===1?'Stunde':'Stunden'}`;return new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value))}

export function FlightCard({flight,status,featured=false,owner=false,onEdit}:{flight:FlightPlan;status?:FlightUpdate;featured?:boolean;owner?:boolean;onEdit?:(flight:FlightPlan)=>void}){
  const updated=useRelativeUpdate(status?.updatedAt)
  return <article className={`flight-card${featured?' featured':''}`}>
    <header><div><span>EMIRATES</span><h2>{flight.flightNumber}</h2></div><FlightStatusBadge status={status}/></header>
    <div className="flight-route"><div><strong>{flight.departure.code}</strong><b>{flight.departureTime}</b><small>{flight.departure.city}</small></div><span><Plane/><i/></span><div><strong>{flight.arrival.code}</strong><b>{flight.arrivalTime}{flight.arrivalDayOffset?<sup> +1</sup>:''}</b><small>{flight.arrival.city}</small></div></div>
    {(status?.estimatedDeparture||status?.estimatedArrival)&&<div className="flight-estimates">{status.estimatedDeparture&&<span>Abflug: {flight.departureTime} geplant · {status.estimatedDeparture} erwartet</span>}{status.estimatedArrival&&<span>Ankunft: {flight.arrivalTime} geplant · {status.estimatedArrival} erwartet</span>}</div>}
    <div className="flight-meta"><span><MapPin/> {flight.departure.terminal} → {flight.arrival.terminal}</span><span><Clock3/> {flight.duration}</span><span><Plane/> {flight.aircraft} · {flight.cabin}</span>{status?.gate&&<span><MapPin/> Gate {status.gate}</span>}</div>
    {status?.note&&<p className="flight-note">{status.note}</p>}
    {updated&&<small className="flight-manual-update">Zuletzt aktualisiert {updated}</small>}
    {owner&&<button className="flight-edit" onClick={()=>onEdit?.(flight)}><Edit3/> Status aktualisieren</button>}
  </article>
}
