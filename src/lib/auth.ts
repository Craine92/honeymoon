import type { Profile } from '../types'
export function isOwner(profile: Profile | null): boolean { return profile?.role === 'owner' }
