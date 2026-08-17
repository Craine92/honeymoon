import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { Profile } from '../types'
export interface AuthValue { session: Session | null; user: User | null; profile: Profile | null; loading: boolean; configured: boolean; owner: boolean; signIn(email: string, password: string): Promise<string | null>; signOut(): Promise<void> }
export const AuthContext = createContext<AuthValue | null>(null)
