import { flightStatusLabels, type FlightUpdate } from './flightTypes'
export function FlightStatusBadge({status}:{status?:FlightUpdate}){const state=status?.status||'scheduled';return <span className={`flight-status status-${state}`}>{flightStatusLabels[state]}</span>}
