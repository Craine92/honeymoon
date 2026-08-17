import type { FlightStatus, FlightState } from './flightTypes'
const labels:Record<FlightState,string>={scheduled:'Geplant',boarding:'Boarding',departed:'Gestartet',enroute:'Unterwegs',landed:'Gelandet',delayed:'Verspätet',cancelled:'Annulliert',unknown:'Status unbekannt'}
export function FlightStatusBadge({status}:{status?:FlightStatus}){const state=status?.status||'scheduled';return <span className={`flight-status status-${state}`}>{labels[state]}</span>}
