import { useState, type FormEvent } from 'react'
import { Clock3, Plane } from 'lucide-react'
import { flights, getJourneyMoment, updatesByFlight } from '../features/flights/flightConfig'
import { FlightTimeline } from '../features/flights/FlightTimeline'
import { flightStatusLabels, type FlightPlan, type FlightState } from '../features/flights/flightTypes'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'

const statusOptions=Object.entries(flightStatusLabels) as Array<[FlightState,string]>

export function FlightsPage(){
  const{owner}=useAuth();const{flightUpdates,flightUpdatesLoading,flightUpdatesStale,flightUpdatesError,saveFlightUpdate}=useData();const statuses=updatesByFlight(flightUpdates);const moment=getJourneyMoment(statuses);const featuredId=(moment.flight||moment.nextFlight)?.id;const[editing,setEditing]=useState<FlightPlan|null>(null);const[saving,setSaving]=useState(false);const[notice,setNotice]=useState<string|null>(null);const current=editing?statuses[editing.id]:undefined
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(!editing)return;const data=new FormData(event.currentTarget);setSaving(true);try{await saveFlightUpdate({id:current?.id,flightNumber:editing.flightNumber,flightDate:editing.date,status:data.get('status')as FlightState,gate:String(data.get('gate')||'').trim().toUpperCase()||undefined,estimatedDeparture:String(data.get('estimatedDeparture')||'')||undefined,estimatedArrival:String(data.get('estimatedArrival')||'')||undefined,note:String(data.get('note')||'').trim()||undefined});setEditing(null);setNotice(`${editing.flightNumber} wurde aktualisiert.`)}catch(error){setNotice(error instanceof Error?error.message:'Der Flugstatus konnte nicht gespeichert werden.')}finally{setSaving(false)}}
  return <div className="page-content page-top flights-page">
    <header className="page-hero"><p className="eyebrow">HAMBURG · DUBAI · MALÉ</p><h1>Unsere Flüge</h1><p>Vier Flüge, zwei Zwischenstopps und ein Ziel: unser kleines Paradies im Indischen Ozean.</p></header>
    {flightUpdatesLoading&&<div className="flight-loading-line"><i/><span>Gespeicherter Flugstatus wird geladen …</span></div>}
    {flightUpdatesError&&<div className="flight-notice"><Clock3/><div><strong>{flightUpdatesStale?'Letzter gespeicherter Status':'Manuelle Flugupdates nicht verfügbar'}</strong><p>{flightUpdatesError} Die festen Flugzeiten bleiben vollständig sichtbar.</p></div></div>}
    {moment.kind==='flying'&&moment.flight&&<div className="family-flight-banner"><Plane/><div><p className="eyebrow">GERADE UNTERWEGS</p><h2>Philipp & Justine sind unterwegs nach {moment.flight.arrival.city} ✈️</h2></div></div>}
    {moment.kind==='at-destination'&&<div className="family-flight-banner"><Plane/><div><p className="eyebrow">HINREISE ABGESCHLOSSEN</p><h2>Willkommen auf den Malediven 🌴</h2></div></div>}
    {moment.kind==='completed'&&<div className="family-flight-banner"><Plane/><div><p className="eyebrow">WIEDER ZU HAUSE</p><h2>Alle Flüge abgeschlossen ❤️</h2></div></div>}
    <FlightTimeline title="Von Hamburg auf die Malediven" flights={flights.filter(f=>f.direction==='outbound')} statuses={statuses} featuredId={featuredId} owner={owner} onEdit={setEditing}/>
    <FlightTimeline title="Von Malé zurück nach Hamburg" flights={flights.filter(f=>f.direction==='return')} statuses={statuses} featuredId={featuredId} owner={owner} onEdit={setEditing}/>
    <p className="flight-time-note">Alle Zeiten sind lokale Flughafenzeiten: Hamburg, Dubai und Malé werden in ihrer jeweiligen Ortszeit gezeigt.</p>
    {notice&&<div className="toast" role="status">{notice}<button onClick={()=>setNotice(null)}>×</button></div>}
    {editing&&<div className="dialog-backdrop flight-sheet"><dialog open aria-labelledby="flight-edit-title"><button className="dialog-close" disabled={saving} onClick={()=>setEditing(null)} aria-label="Schließen">×</button><form onSubmit={submit}><Plane/><p className="eyebrow">{editing.departure.code} → {editing.arrival.code}</p><h2 id="flight-edit-title">{editing.flightNumber} aktualisieren</h2><label>Status<select name="status" defaultValue={current?.status||'scheduled'}>{statusOptions.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Gate optional<input name="gate" maxLength={10} placeholder="z. B. B42" defaultValue={current?.gate}/></label><div className="field-row"><label>Erwarteter Abflug<input type="time" name="estimatedDeparture" defaultValue={current?.estimatedDeparture}/></label><label>Erwartete Ankunft<input type="time" name="estimatedArrival" defaultValue={current?.estimatedArrival}/></label></div><label>Hinweis optional<textarea name="note" maxLength={240} placeholder="z. B. Boarding beginnt um 14:55 Uhr." defaultValue={current?.note}/></label><div className="form-actions"><button type="button" disabled={saving} onClick={()=>setEditing(null)}>Abbrechen</button><button className="button" disabled={saving} type="submit">{saving?'Wird gespeichert …':'Speichern'}</button></div></form></dialog></div>}
  </div>
}
