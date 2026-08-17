import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'

export function ShareButton({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false)
  const share = async () => { try { const url = `${location.origin}/`; if (navigator.share) await navigator.share({ title: 'Our Honeymoon · Malediven 2026', text: 'Begleite Philipp & Justine auf ihrer Hochzeitsreise auf die Malediven 🌴', url }); else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2200) } } catch { /* Ein abgebrochener Systemdialog benötigt keine Fehlermeldung. */ } }
  return <button className={compact ? 'icon-btn' : 'button'} onClick={share} aria-label="Unsere Reise teilen">{copied ? <Check size={18} /> : <Share2 size={18} />}{!compact && <span>{copied ? 'Link kopiert' : 'Unsere Reise teilen'}</span>}</button>
}
