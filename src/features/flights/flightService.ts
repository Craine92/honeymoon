import { supabase } from '../../lib/supabase'
import type { FlightPlan, FlightStatus } from './flightTypes'

interface CapabilityResponse { configured:boolean; provider?:string }
interface StatusResponse { configured:boolean; status?:FlightStatus; cached?:boolean; stale?:boolean }

export async function getFlightCapabilities():Promise<CapabilityResponse>{
  if(!supabase)return{configured:false}
  const{data,error}=await supabase.functions.invoke<CapabilityResponse>('flight-status',{body:{mode:'capabilities'}})
  if(error){if(import.meta.env.DEV)console.warn('[Flight status capability]',{name:error.name,message:error.message});return{configured:false}}
  return data||{configured:false}
}

export async function getLiveFlightStatus(flight:FlightPlan):Promise<FlightStatus|undefined>{
  if(!supabase)return undefined
  const{data,error}=await supabase.functions.invoke<StatusResponse>('flight-status',{body:{flightNumber:flight.flightNumber,flightDate:flight.date}})
  if(error){if(import.meta.env.DEV)console.warn('[Flight status request]',{flightNumber:flight.flightNumber,name:error.name,message:error.message});return undefined}
  return data?.status?{...data.status,stale:data.stale,staleMinutes:data.stale?Math.max(1,Math.round((Date.now()-new Date(data.status.updatedAt).getTime())/60000)):undefined}:undefined
}

export function pollingInterval(flight:FlightPlan,status?:FlightStatus,now=new Date()){
  if(status&&['landed','cancelled'].includes(status.status))return null
  const untilDeparture=new Date(flight.departureAt).getTime()-now.getTime();const sinceArrival=now.getTime()-new Date(flight.arrivalAt).getTime()
  if(untilDeparture>24*60*60*1000||sinceArrival>6*60*60*1000)return null
  if(status&&['boarding','delayed'].includes(status.status))return 5*60*1000
  if(untilDeparture<=0)return 7*60*1000
  return 12*60*1000
}
