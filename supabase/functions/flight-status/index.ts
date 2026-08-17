import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Content-Type':'application/json',
}
const allowedFlights=new Set(['EK060|2026-08-30','EK658|2026-08-31','EK657|2026-09-10','EK061|2026-09-10'])
type NeutralStatus='scheduled'|'boarding'|'departed'|'enroute'|'landed'|'delayed'|'cancelled'|'unknown'
type JsonRecord=Record<string,unknown>

function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:corsHeaders})}
function record(value:unknown):JsonRecord{return value&&typeof value==='object'&&!Array.isArray(value)?value as JsonRecord:{}}
function text(value:unknown){return typeof value==='string'?value:undefined}
function number(value:unknown){return typeof value==='number'&&Number.isFinite(value)?value:undefined}
function movementTime(movement:JsonRecord,key:string){return text(record(movement[key]).utc)||text(record(movement[key]).local)||text(movement[key])}

function normalizeStatus(raw:unknown):NeutralStatus{
  const value=String(raw||'').toLowerCase()
  if(value.includes('cancel'))return'cancelled'
  if(value.includes('land')||value.includes('arriv'))return'landed'
  if(value.includes('en route')||value.includes('enroute')||value.includes('airborne'))return'enroute'
  if(value.includes('depart'))return'departed'
  if(value.includes('board'))return'boarding'
  if(value.includes('delay'))return'delayed'
  if(value.includes('sched')||value.includes('expected'))return'scheduled'
  return'unknown'
}

function mapProviderFlight(value:unknown,requestedNumber:string){
  const flight=record(value);const departure=record(flight.departure);const arrival=record(flight.arrival);const aircraft=record(flight.aircraft);const location=record(flight.location);const altitude=record(location.altitude);const speed=record(location.groundSpeed)
  const delay=number(departure.delayMinutes)??number(record(departure.delay).minutes)
  return{
    flightNumber:text(flight.number)||requestedNumber,status:normalizeStatus(flight.status),
    scheduledDeparture:movementTime(departure,'scheduledTime'),estimatedDeparture:movementTime(departure,'revisedTime'),actualDeparture:movementTime(departure,'runwayTime'),
    scheduledArrival:movementTime(arrival,'scheduledTime'),estimatedArrival:movementTime(arrival,'revisedTime'),actualArrival:movementTime(arrival,'runwayTime'),
    departureGate:text(departure.gate),arrivalGate:text(arrival.gate),departureTerminal:text(departure.terminal),arrivalTerminal:text(arrival.terminal),delayMinutes:delay,
    aircraft:text(aircraft.model)||text(aircraft.reg),latitude:number(location.lat),longitude:number(location.lon),altitude:number(altitude.feet),groundSpeed:number(speed.kt),
    updatedAt:text(location.reportedAtUtc)||new Date().toISOString(),
  }
}

function serviceKey(){
  const legacy=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(legacy)return legacy
  try{return record(JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}')).default as string|undefined}catch{return undefined}
}
function cacheTtl(status:NeutralStatus|undefined,flightDate:string){
  if(status==='landed'||status==='cancelled')return 24*60*60*1000
  if(status==='boarding'||status==='delayed')return 5*60*1000
  const untilDate=new Date(`${flightDate}T00:00:00Z`).getTime()-Date.now()
  if(untilDate>24*60*60*1000)return 24*60*60*1000
  if(status==='departed'||status==='enroute')return 7*60*1000
  return 12*60*1000
}

Deno.serve(async request=>{
  if(request.method==='OPTIONS')return new Response('ok',{headers:corsHeaders})
  if(request.method!=='POST')return json({error:'method_not_allowed'},405)
  const apiKey=Deno.env.get('FLIGHT_API_KEY')
  let body:JsonRecord
  try{body=record(await request.json())}catch{return json({error:'invalid_json'},400)}
  if(body.mode==='capabilities')return json({configured:Boolean(apiKey),provider:apiKey?'aerodatabox':undefined})
  const flightNumber=text(body.flightNumber)?.toUpperCase();const flightDate=text(body.flightDate)
  if(!flightNumber||!flightDate||!allowedFlights.has(`${flightNumber}|${flightDate}`))return json({error:'flight_not_allowed'},400)
  const supabaseUrl=Deno.env.get('SUPABASE_URL');const adminKey=serviceKey()
  if(!supabaseUrl||!adminKey)return json({configured:Boolean(apiKey),error:'server_configuration'},500)
  const admin=createClient(supabaseUrl,adminKey,{auth:{persistSession:false}})
  const{data:cached}=await admin.from('flight_status_cache').select('payload,fetched_at').eq('flight_number',flightNumber).eq('flight_date',flightDate).maybeSingle()
  const cachedPayload=record(cached?.payload);const cachedStatus=text(cachedPayload.status) as NeutralStatus|undefined;const ttl=cacheTtl(cachedStatus,flightDate);const age=cached?.fetched_at?Date.now()-new Date(cached.fetched_at).getTime():Infinity
  if(cached&&Object.keys(cachedPayload).length&&age<ttl)return json({configured:Boolean(apiKey),provider:'aerodatabox',status:cachedPayload,cached:true,stale:false})
  if(!apiKey)return json({configured:false,status:Object.keys(cachedPayload).length?cachedPayload:undefined,cached:Boolean(cached),stale:Boolean(cached)})
  const staleBefore=new Date(Date.now()-ttl).toISOString();const{data:claimed}=await admin.rpc('claim_flight_status_refresh',{p_flight_number:flightNumber,p_flight_date:flightDate,p_stale_before:staleBefore})
  if(!claimed)return json({configured:true,provider:'aerodatabox',status:Object.keys(cachedPayload).length?cachedPayload:undefined,cached:true,stale:true})
  try{
    const base=Deno.env.get('FLIGHT_API_BASE_URL')||'https://aerodatabox.p.rapidapi.com'
    const response=await fetch(`${base}/flights/number/${encodeURIComponent(flightNumber)}/${flightDate}?withLocation=true`,{headers:{'X-RapidAPI-Key':apiKey,'X-RapidAPI-Host':'aerodatabox.p.rapidapi.com','Accept':'application/json'}})
    if(!response.ok)throw new Error(`provider_${response.status}`)
    const providerBody=await response.json();const candidates=Array.isArray(providerBody)?providerBody:Array.isArray(record(providerBody).flights)?record(providerBody).flights as unknown[]:[]
    if(!candidates.length)throw new Error('provider_empty')
    const status=mapProviderFlight(candidates[0],flightNumber)
    const{error}=await admin.from('flight_status_cache').upsert({flight_number:flightNumber,flight_date:flightDate,payload:status,fetched_at:new Date().toISOString(),refresh_started_at:null},{onConflict:'flight_number,flight_date'})
    if(error)console.error('flight cache write failed',{code:error.code})
    return json({configured:true,provider:'aerodatabox',status,cached:false,stale:false})
  }catch(error){
    await admin.from('flight_status_cache').update({refresh_started_at:null}).eq('flight_number',flightNumber).eq('flight_date',flightDate)
    console.error('flight provider request failed',{flightNumber,type:error instanceof Error?error.message:'unknown'})
    if(Object.keys(cachedPayload).length)return json({configured:true,provider:'aerodatabox',status:cachedPayload,cached:true,stale:true})
    return json({configured:true,provider:'aerodatabox',error:'temporarily_unavailable'},502)
  }
})
