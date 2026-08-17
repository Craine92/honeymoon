import type { FlightPlan, FlightUpdate, JourneyMoment } from './flightTypes'

const HAM={code:'HAM',city:'Hamburg',name:'Hamburg Airport',terminal:'Terminal 1',timeZone:'Europe/Berlin'} as const
const DXB={code:'DXB',city:'Dubai',name:'Dubai International',terminal:'Terminal 3',timeZone:'Asia/Dubai'} as const
const MLE={code:'MLE',city:'Malé',name:'Velana International',terminal:'Terminal 1',timeZone:'Indian/Maldives'} as const

export const flights:FlightPlan[]=[
  {id:'EK060-2026-08-30',direction:'outbound',flightNumber:'EK060',date:'2026-08-30',departure:HAM,arrival:DXB,departureAt:'2026-08-30T15:30:00+02:00',arrivalAt:'2026-08-31T00:30:00+04:00',departureTime:'15:30',arrivalTime:'00:30',arrivalDayOffset:1,duration:'7 Stunden',aircraft:'Boeing 777-300ER',cabin:'Economy Saver'},
  {id:'EK658-2026-08-31',direction:'outbound',flightNumber:'EK658',date:'2026-08-31',departure:DXB,arrival:MLE,departureAt:'2026-08-31T04:20:00+04:00',arrivalAt:'2026-08-31T09:30:00+05:00',departureTime:'04:20',arrivalTime:'09:30',duration:'4 Stunden 10 Minuten',aircraft:'Boeing 777-300ER',cabin:'Economy Saver'},
  {id:'EK657-2026-09-10',direction:'return',flightNumber:'EK657',date:'2026-09-10',departure:MLE,arrival:DXB,departureAt:'2026-09-10T09:15:00+05:00',arrivalAt:'2026-09-10T12:15:00+04:00',departureTime:'09:15',arrivalTime:'12:15',duration:'4 Stunden',aircraft:'Boeing 777-300ER',cabin:'Economy Saver'},
  {id:'EK061-2026-09-10',direction:'return',flightNumber:'EK061',date:'2026-09-10',departure:DXB,arrival:HAM,departureAt:'2026-09-10T15:00:00+04:00',arrivalAt:'2026-09-10T19:45:00+02:00',departureTime:'15:00',arrivalTime:'19:45',duration:'6 Stunden 45 Minuten',aircraft:'Airbus A350-900',cabin:'Economy Saver'},
]

export const layovers={outbound:'3 Stunden 50 Minuten',return:'2 Stunden 45 Minuten'} as const
const terminalStates=new Set(['landed','cancelled'])

export function updatesByFlight(items:FlightUpdate[]){return Object.fromEntries(flights.map(flight=>[flight.id,items.find(item=>item.flightNumber===flight.flightNumber&&item.flightDate===flight.date)]))as Record<string,FlightUpdate|undefined>}

export function getJourneyMoment(statuses:Record<string,FlightUpdate|undefined>,now=new Date()):JourneyMoment{
  const nowMs=now.getTime()
  const live=flights.find(f=>{const status=statuses[f.id]?.status;return status&&['departed','enroute'].includes(status)})
  if(live)return{kind:'flying',flight:live}
  const manuallyActive=flights.find(f=>{const status=statuses[f.id]?.status;return status&&['checkin','boarding','delayed'].includes(status)})
  if(manuallyActive)return{kind:'upcoming',nextFlight:manuallyActive}
  const next=flights.find(f=>!terminalStates.has(statuses[f.id]?.status||'')&&new Date(f.arrivalAt).getTime()>nowMs)
  if(!next)return{kind:'completed',previousFlight:flights.at(-1)}
  const index=flights.indexOf(next);const previous=index>0?flights[index-1]:undefined
  const outboundComplete=['EK060-2026-08-30','EK658-2026-08-31'].every(id=>statuses[id]?.status==='landed')
  if(outboundComplete&&next.direction==='return'&&new Date(next.departureAt).getTime()-nowMs>24*60*60*1000)return{kind:'at-destination',nextFlight:next,previousFlight:previous}
  if(previous&&nowMs>=new Date(previous.arrivalAt).getTime()&&nowMs<new Date(next.departureAt).getTime())return{kind:'layover',nextFlight:next,previousFlight:previous}
  if(nowMs>=new Date(next.departureAt).getTime())return{kind:'flying',flight:next}
  return{kind:'upcoming',nextFlight:next,previousFlight:previous}
}

export function countdownTo(iso:string,now=new Date()){
  const minutes=Math.max(0,Math.floor((new Date(iso).getTime()-now.getTime())/60000));const days=Math.floor(minutes/1440);const hours=Math.floor((minutes%1440)/60)
  if(days>0)return `Noch ${days} ${days===1?'Tag':'Tage'}${hours?` und ${hours} Std.`:''}`
  if(hours>0)return `Noch ${hours} ${hours===1?'Stunde':'Stunden'}`
  return `Noch ${Math.max(1,minutes)} Minuten`
}
