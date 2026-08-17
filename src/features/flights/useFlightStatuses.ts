import { useEffect, useState } from 'react'
import { flights, getJourneyMoment } from './flightConfig'
import { getFlightCapabilities, getLiveFlightStatus, pollingInterval } from './flightService'
import type { FlightStatus } from './flightTypes'

export function useFlightStatuses(){
  const[statuses,setStatuses]=useState<Record<string,FlightStatus|undefined>>({});const[configured,setConfigured]=useState<boolean|null>(null);const[loading,setLoading]=useState(true);const[unavailable,setUnavailable]=useState(false);const[lastChecked,setLastChecked]=useState<string>()
  useEffect(()=>{let active=true;let timer:number|undefined
    const run=async(current:Record<string,FlightStatus|undefined>)=>{const moment=getJourneyMoment(current);const flight=moment.flight||moment.nextFlight;if(!flight){if(active)setLoading(false);return}const interval=pollingInterval(flight,current[flight.id]);if(interval===null){if(active)setLoading(false);return}const status=await getLiveFlightStatus(flight);const next=status?{...current,[flight.id]:status}:current;if(active){setStatuses(next);setUnavailable(!status);setLastChecked(new Date().toISOString());setLoading(false);timer=window.setTimeout(()=>void run(next),pollingInterval(flight,status)||15*60*1000)}}
    void getFlightCapabilities().then(capability=>{if(!active)return;setConfigured(capability.configured);if(capability.configured)void run({});else setLoading(false)})
    return()=>{active=false;if(timer)window.clearTimeout(timer)}
  },[])
  return{statuses,configured,loading,unavailable,lastChecked,flights}
}
