import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({mode})=>{
  const env=loadEnv(mode,'.','')
  const base=env.VITE_BASE_PATH||'/'
  return {
    base,
    build:{rollupOptions:{output:{manualChunks:(id:string)=>id.includes('@supabase')?'supabase':undefined}}},
    plugins:[react(),VitePWA({
      registerType:'autoUpdate',
      manifest:{name:'Our Honeymoon',short_name:'Honeymoon',description:'Philipp & Justine — Malediven 2026',lang:'de-DE',theme_color:'#063c49',background_color:'#f5f1e8',display:'standalone',start_url:base,scope:base,icons:[{src:`${base}pwa-192.svg`,sizes:'192x192',type:'image/svg+xml'},{src:`${base}pwa-512.svg`,sizes:'512x512',type:'image/svg+xml',purpose:'any maskable'}]},
      workbox:{globPatterns:['**/*.{js,css,html,svg,png,webp}'],maximumFileSizeToCacheInBytes:3*1024*1024,navigateFallback:'index.html'},
    })],
  }
})
