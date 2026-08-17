import { Plane } from 'lucide-react'
import { layovers } from './flightConfig'
import { FlightCard } from './FlightCard'
import type { FlightPlan, FlightStatus } from './flightTypes'
export function FlightTimeline({title,flights,statuses,featuredId}:{title:string;flights:FlightPlan[];statuses:Record<string,FlightStatus|undefined>;featuredId?:string}){return <section className="flight-group"><div className="flight-group-title"><Plane/><div><p className="eyebrow">{flights[0].direction==='outbound'?'HINREISE':'RÜCKREISE'}</p><h2>{title}</h2></div></div><div className="flight-list">{flights.map((flight,index)=><div key={flight.id}>{index>0&&<div className="layover"><span>Zwischenstopp in Dubai</span><strong>{layovers[flight.direction]}</strong></div>}<FlightCard flight={flight} status={statuses[flight.id]} featured={featuredId===flight.id}/></div>)}</div></section>}
