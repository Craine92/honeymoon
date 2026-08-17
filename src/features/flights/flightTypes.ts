export type FlightState = 'scheduled'|'boarding'|'departed'|'enroute'|'landed'|'delayed'|'cancelled'|'unknown'
export interface FlightStatus {
  flightNumber:string; status:FlightState; scheduledDeparture?:string; estimatedDeparture?:string; actualDeparture?:string;
  scheduledArrival?:string; estimatedArrival?:string; actualArrival?:string; departureGate?:string; arrivalGate?:string;
  departureTerminal?:string; arrivalTerminal?:string; delayMinutes?:number; aircraft?:string;
  latitude?:number; longitude?:number; altitude?:number; groundSpeed?:number; updatedAt:string; stale?:boolean; staleMinutes?:number
}
export interface Airport { code:string; city:string; name:string; terminal:string; timeZone:string }
export interface FlightPlan { id:string; direction:'outbound'|'return'; flightNumber:string; date:string; departure:Airport; arrival:Airport; departureAt:string; arrivalAt:string; departureTime:string; arrivalTime:string; arrivalDayOffset?:number; duration:string; aircraft:string; cabin:string }
export type JourneyMoment = {kind:'upcoming'|'flying'|'layover'|'completed';flight?:FlightPlan;nextFlight?:FlightPlan;previousFlight?:FlightPlan}
