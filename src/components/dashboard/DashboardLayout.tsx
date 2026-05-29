import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  actions?: ReactNode
  subtitle?: string
  children: ReactNode
}

export function DashboardLayout({ actions, subtitle, children }: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950/95 p-5 sm:p-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
                FocusTube Dashboard
              </span>
              <div className="max-w-2xl space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">A smarter YouTube focus workspace.</h1>
                <p className="text-sm leading-6 text-slate-400">
                  Manage sessions, block distractions, and review meaningful focus metrics in one polished experience.
                </p>
              </div>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {subtitle ? <p className="mt-6 text-sm text-slate-400">{subtitle}</p> : null}
        </section>
        {children}
      </div>
    </main>
  )
}
