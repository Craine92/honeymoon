export type FlightState = 'scheduled'|'checkin'|'boarding'|'delayed'|'departed'|'enroute'|'landed'|'cancelled'
export const flightStatusLabels:Record<FlightState,string>={scheduled:'Geplant',checkin:'Check-in geöffnet',boarding:'Boarding',delayed:'Verspätet',departed:'Gestartet',enroute:'Unterwegs',landed:'Gelandet',cancelled:'Annulliert'}
export interface FlightUpdate { id?:string; flightNumber:string; flightDate:string; status:FlightState; gate?:string; estimatedDeparture?:string; estimatedArrival?:string; note?:string; updatedAt?:string; updatedBy?:string }
export interface Airport { code:string; city:string; name:string; terminal:string; timeZone:string }
export interface FlightPlan { id:string; direction:'outbound'|'return'; flightNumber:string; date:string; departure:Airport; arrival:Airport; departureAt:string; arrivalAt:string; departureTime:string; arrivalTime:string; arrivalDayOffset?:number; duration:string; aircraft:string; cabin:string }
export type JourneyMoment = {kind:'upcoming'|'flying'|'layover'|'at-destination'|'completed';flight?:FlightPlan;nextFlight?:FlightPlan;previousFlight?:FlightPlan}
