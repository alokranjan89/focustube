import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl shadow-black/20 backdrop-blur-xl ${className}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2> : null}
      {children}
    </section>
  )
}
