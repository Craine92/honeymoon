import { useEffect, useState } from 'react'

const timeZone='Indian/Maldives'
const timeFormatter=new Intl.DateTimeFormat('de-DE',{timeZone,hour:'2-digit',minute:'2-digit'})
const dateFormatter=new Intl.DateTimeFormat('de-DE',{timeZone,weekday:'long',day:'numeric',month:'long'})

export function formatResortTime(date:Date){return timeFormatter.format(date)}
export function formatResortDate(date:Date){return dateFormatter.format(date)}

export function useResortTime(){
  const[now,setNow]=useState(()=>new Date())
  useEffect(()=>{const timer=window.setInterval(()=>setNow(new Date()),30000);return()=>window.clearInterval(timer)},[])
  const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone,hour:'2-digit',hourCycle:'h23'}).format(now))
  const greeting=hour<11?'Guten Morgen von Iru Veli':hour<17?'Ein sonniger Gruß von Iru Veli':hour<21?'Guten Abend aus dem Paradies':'Gute Nacht von Iru Veli'
  return{time:formatResortTime(now),date:formatResortDate(now),timeZone,greeting}
}
