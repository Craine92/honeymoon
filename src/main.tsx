import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { AuthProvider } from './contexts/AuthProvider'
import { DataProvider } from './contexts/DataProvider'
import './styles.css'

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
} else if ('serviceWorker' in navigator) {
  // Ein zuvor auf localhost installierter Production-Worker darf Vite/HMR nicht überlagern.
  void navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
  if ('caches' in window) void caches.keys().then(keys => Promise.all(keys.filter(key => key.includes('workbox-precache')).map(key => caches.delete(key))))
}
createRoot(document.getElementById('root')!).render(<StrictMode><AuthProvider><DataProvider><App/></DataProvider></AuthProvider></StrictMode>)
