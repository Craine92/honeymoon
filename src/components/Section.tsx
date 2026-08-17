import type { ReactNode } from 'react'

export function Section({ eyebrow, title, action, children, className = '' }: { eyebrow?: string; title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`section ${className}`}><header className="section-head"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action}</header>{children}</section>
}
