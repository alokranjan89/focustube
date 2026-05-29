import type { ReactNode } from 'react'

interface MetricCardProps {
  value: string | number
  label: string
  icon: ReactNode
}

export function MetricCard({ value, label, icon }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-glow backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="text-3xl font-semibold text-white">{value}</div>
        <div className="text-slate-400">{icon}</div>
      </div>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  )
}
