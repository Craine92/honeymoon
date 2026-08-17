import { useCallback, useEffect, useState } from 'react'
import { getCachedWeather, loadWeather, type WeatherLoadResult } from './weatherApi'
export function useWeather(){const cached=getCachedWeather();const[state,setState]=useState<WeatherLoadResult>({data:cached,stale:Boolean(cached),error:null});const[loading,setLoading]=useState(!cached);const refresh=useCallback(async(force=false)=>{setLoading(true);const result=await loadWeather(force);setState(result);setLoading(false)},[]);useEffect(()=>{void Promise.resolve().then(()=>refresh(false))},[refresh]);return{...state,loading,refresh}}
