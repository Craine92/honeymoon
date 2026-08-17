import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { HomePage } from './pages/HomePage'
import { MemoriesPage } from './pages/MemoriesPage'
import { MorePage } from './pages/MorePage'
import { ReefPage } from './pages/ReefPage'
import { TripPage } from './pages/TripPage'
import { WeatherPage } from './pages/WeatherPage'

export default function App() { return <BrowserRouter><Routes><Route element={<AppLayout/>}><Route index element={<HomePage/>}/><Route path="trip" element={<TripPage/>}/><Route path="reef" element={<ReefPage/>}/><Route path="memories" element={<MemoriesPage/>}/><Route path="weather" element={<WeatherPage/>}/><Route path="more" element={<MorePage/>}/><Route path="*" element={<HomePage/>}/></Route></Routes></BrowserRouter> }
