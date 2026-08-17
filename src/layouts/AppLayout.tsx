import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { OfflineBadge } from '../components/OfflineBadge'
import { RouteScrollReset } from '../components/RouteScrollReset'
import { tripConfig } from '../config/trip'
import { useData } from '../hooks/useData'

export function AppLayout() {
  const { error } = useData()
  return <div className="app-shell antialiased"><RouteScrollReset/><aside className="desktop-rail"><div className="rail-mark">P<span>♡</span>J</div><div className="rail-title"><strong>{tripConfig.appName}</strong><span>{tripConfig.subtitle}</span></div><BottomNav/></aside><main><Outlet/></main><div className="mobile-nav"><BottomNav/></div><OfflineBadge/>{error&&<div className="connection-error" role="status">{error}</div>}</div>
}
