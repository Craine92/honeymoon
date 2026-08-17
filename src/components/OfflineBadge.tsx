import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => { const update = () => setOnline(navigator.onLine); addEventListener('online', update); addEventListener('offline', update); return () => { removeEventListener('online', update); removeEventListener('offline', update) } }, [])
  return online ? null : <div className="offline" role="status"><WifiOff size={14} /> Offline-Modus</div>
}
