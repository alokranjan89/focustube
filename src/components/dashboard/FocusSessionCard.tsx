import type { FocusTubeSettings, AnalyticsState } from '../../types'
import { Button } from '../Button'

interface FocusSessionCardProps {
  settings: FocusTubeSettings
  analytics: AnalyticsState
  onStartFocus: () => void
}

export function FocusSessionCard({ settings, analytics, onStartFocus }: FocusSessionCardProps) {
  const statusLabel = settings.enabled ? 'FocusTube on' : 'FocusTube off'
  const goalText = settings.dailyGoal || 'Complete one focused session'

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Focus Session</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{goalText}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Start a focused YouTube session and keep distractions under control.</p>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
          {statusLabel}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Focus hours</p>
          <p className="mt-3 text-2xl font-semibold text-white">{analytics.hoursSaved}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sessions completed</p>
          <p className="mt-3 text-2xl font-semibold text-white">{analytics.productiveDays}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current streak</p>
          <p className="mt-3 text-2xl font-semibold text-white">{analytics.focusStreak} days</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="primary" onClick={onStartFocus} className="w-full sm:w-auto">
          {settings.enabled ? 'FocusTube On' : 'Turn On FocusTube'}
        </Button>
        <p className="text-sm text-slate-400">Use the popup to quickly review your focus state while browsing.</p>
      </div>
    </div>
  )
}
