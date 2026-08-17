import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: { rollupOptions: { output: { manualChunks: id => id.includes('@supabase') ? 'supabase' : undefined } } },
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: { name: 'Our Honeymoon', short_name: 'Honeymoon', description: 'Philipp & Justine — Malediven 2026', lang: 'de-DE', theme_color: '#063c49', background_color: '#f5f1e8', display: 'standalone', start_url: '/', icons: [{ src: '/pwa-192.svg', sizes: '192x192', type: 'image/svg+xml' }, { src: '/pwa-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }] },
    workbox: { globPatterns: ['**/*.{js,css,html,svg,png,webp}'], maximumFileSizeToCacheInBytes: 3 * 1024 * 1024 }
  })]
})
