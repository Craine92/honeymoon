import { Clock3, CloudSun, Droplets, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getTripPhase } from '../../hooks/useTripPhase'
import { useResortTime } from './useResortTime'
import { weatherPresentation } from './weatherCodes'
import { useWeather } from './useWeather'

export function WeatherCard(){
  const{data,loading,error,stale}=useWeather();const{time}=useResortTime();const today=data?.daily[0];const condition=data?weatherPresentation(data.current.weatherCode):null;const phase=getTripPhase();const label=phase.phase==='during'||phase.phase==='arrival'?'WETTER HEUTE':'AKTUELL AUF IRU VELI';const update=data?new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'}).format(new Date(data.updatedAt)):''
  return <Link to="/weather" className="feature-card weather-card real-weather" aria-label="Wetterdetails und Ortszeit für Iru Veli öffnen">{loading&&!data?<><CloudSun size={34}/><div><p className="eyebrow">{label}</p><h3>Wetter wird geladen</h3><p className="resort-clock"><Clock3/> {time} Uhr Ortszeit</p></div></>:data?<><span className="weather-symbol">{condition?.icon}</span><div><p className="eyebrow">{label}</p><h3>{Math.round(data.current.temperature)} °C · {condition?.label}</h3><p className="resort-clock"><Clock3/> <strong>{time} Uhr Ortszeit</strong></p><p>{Math.round(data.current.apparentTemperature)} °C gefühlt · {today?.rainProbability??0} % Regen</p><small><Droplets/> {data.current.humidity} % <Wind/> {Math.round(data.current.windSpeed)} km/h{stale?` · Stand ${update}`:''}</small></div></>:<><CloudSun size={34}/><div><p className="eyebrow">AKTUELL AUF IRU VELI</p><h3>{error||'Wetterdaten gerade nicht verfügbar'}</h3><p className="resort-clock"><Clock3/> {time} Uhr Ortszeit</p></div></>}</Link>
}
