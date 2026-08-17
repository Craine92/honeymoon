import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { AuthError, Session } from '@supabase/supabase-js'
import { isOwner } from '../lib/auth'
import { isSupabaseConfigured, supabase, supabaseConfigurationError } from '../lib/supabase'
import type { Profile } from '../types'
import { AuthContext } from './AuthContext'

type ProfileLoad = { profile: Profile | null; issue: 'none' | 'query' | 'missing' | 'not_owner' }

function logAuthError(stage: string, error: AuthError | Error | { code?: string; status?: number; name?: string }) {
  if (!import.meta.env.DEV) return
  console.error(`[Supabase auth: ${stage}]`, { name: error.name, code: 'code' in error ? error.code : undefined, status: 'status' in error ? error.status : undefined })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const loadProfile = useCallback(async (current: Session | null): Promise<ProfileLoad> => {
    setSession(current)
    if (!current || !supabase) { setProfile(null); setLoading(false); return { profile: null, issue: 'none' } }
    const { data, error } = await supabase.from('profiles').select('id,display_name,role').eq('id', current.user.id).maybeSingle()
    if (error) { logAuthError('profile_query', error); setProfile(null); setLoading(false); return { profile: null, issue: 'query' } }
    if (!data) { setProfile(null); setLoading(false); return { profile: null, issue: 'missing' } }
    const loaded: Profile = { id: data.id, displayName: data.display_name ?? 'Owner', role: data.role === 'owner' ? 'owner' : 'guest' }
    setProfile(loaded); setLoading(false)
    return { profile: loaded, issue: loaded.role === 'owner' ? 'none' : 'not_owner' }
  }, [])

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data, error }) => { if (error) logAuthError('session', error); void loadProfile(data.session) })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => { void loadProfile(next) })
    return () => data.subscription.unsubscribe()
  }, [loadProfile])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return supabaseConfigurationError ?? 'Supabase ist nicht initialisiert.'
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        logAuthError('sign_in', error); setLoading(false)
        if (error.code === 'invalid_credentials' || error.status === 400) return 'E-Mail oder Passwort wurden von Supabase nicht akzeptiert.'
        if (error.status === 429) return 'Zu viele Anmeldeversuche. Bitte warte kurz und versuche es erneut.'
        return 'Supabase Auth ist gerade nicht erreichbar. Bitte prüfe Verbindung und Projektkonfiguration.'
      }
      const result = await loadProfile(data.session)
      if (result.issue === 'query') return 'Login erfolgreich, aber das Profil konnte nicht aus public.profiles geladen werden.'
      if (result.issue === 'missing') return 'Login erfolgreich, aber für diesen Auth-User fehlt ein Eintrag in public.profiles.'
      if (result.issue === 'not_owner') return 'Login erfolgreich, aber das Profil besitzt nicht die Rolle owner.'
      return null
    } catch (error) {
      logAuthError('network_or_configuration', error instanceof Error ? error : new Error('Unknown auth error')); setLoading(false)
      return 'Supabase konnte nicht erreicht werden. Bitte prüfe URL, Publishable Key und Netzwerk.'
    }
  }

  const signOut = async () => { const { error } = await supabase?.auth.signOut() ?? { error: null }; if (error) logAuthError('sign_out', error); setSession(null); setProfile(null) }
  const value = { session, user: session?.user ?? null, profile, loading, configured: isSupabaseConfigured, owner: isOwner(profile), signIn, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
