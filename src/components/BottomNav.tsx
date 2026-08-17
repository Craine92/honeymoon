import { Compass, Home, Images, Menu, Waves } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [{ to: '/', label: 'Start', icon: Home }, { to: '/trip', label: 'Reise', icon: Compass }, { to: '/reef', label: 'Riff', icon: Waves }, { to: '/memories', label: 'Erinnerungen', icon: Images }, { to: '/more', label: 'Mehr', icon: Menu }]
export function BottomNav() { return <nav className="bottom-nav" aria-label="Main navigation">{items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} aria-label={label}><Icon size={21} strokeWidth={1.8} /><span>{label}</span></NavLink>)}</nav> }
