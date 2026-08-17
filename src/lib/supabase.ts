import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const url = rawUrl?.trim()
const anonKey = rawKey?.trim()

function validateConfiguration(): string | null {
  if (!url) return 'VITE_SUPABASE_URL fehlt. Bitte .env oder .env.local korrigieren und Vite neu starten.'
  try { const parsed = new URL(url); if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) throw new Error() } catch { return 'VITE_SUPABASE_URL ist keine gültige Supabase-Projekt-URL.' }
  if (!anonKey) return 'VITE_SUPABASE_ANON_KEY fehlt. Bitte den Publishable- oder Anon-Key eintragen.'
  if (/YOUR|DEIN|PLACEHOLDER|EINFÜGEN|ANON_KEY/i.test(anonKey)) return 'VITE_SUPABASE_ANON_KEY enthält noch einen Platzhalter.'
  if (/[^\x21-\x7E]/.test(anonKey)) return 'VITE_SUPABASE_ANON_KEY enthält ungültige Leer- oder Sonderzeichen.'
  const isPublishable = anonKey.startsWith('sb_publishable_')
  const isLegacyAnon = anonKey.startsWith('eyJ') && anonKey.split('.').length === 3
  if (!isPublishable && !isLegacyAnon) return 'VITE_SUPABASE_ANON_KEY hat kein unterstütztes Publishable-/Anon-Key-Format.'
  return null
}

export const supabaseConfigurationError = validateConfiguration()
export const isSupabaseConfigured = supabaseConfigurationError === null

if (import.meta.env.DEV && supabaseConfigurationError) {
  console.error('[Supabase configuration]', { code: 'INVALID_ENV', message: supabaseConfigurationError, urlPresent: Boolean(url), keyPresent: Boolean(anonKey) })
}

// Moderne sb_publishable_…-Keys und ältere Anon-JWTs werden von supabase-js unterstützt.
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null
