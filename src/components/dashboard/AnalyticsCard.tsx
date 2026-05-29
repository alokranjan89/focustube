import { CheckCircle2, Sparkles } from 'lucide-react'
import type { AnalyticsState } from '../../types'

interface AnalyticsCardProps {
  analytics: AnalyticsState
}

function smallMetric(label: string, value: string | number) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

export function AnalyticsCard({ analytics }: AnalyticsCardProps) {
  const hasActivity = analytics.videosBlocked > 0 || analytics.hoursSaved > 0 || analytics.focusStreak > 0
  const categoryCount = Object.entries(analytics.categories).filter(([, value]) => value > 0).length
  const topCategory = Object.entries(analytics.categories).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Focus'

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Insights</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Meaningful analytics</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">FocusTube turns blocked content into useful habits and focus signals.</p>
        </div>
        <div className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">{categoryCount} filters live</div>
      </div>

      {hasActivity ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {smallMetric('Videos blocked', analytics.videosBlocked)}
          {smallMetric('Streak', `${analytics.focusStreak} days`)}
          {smallMetric('Productive days', analytics.productiveDays)}
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-700/80 bg-slate-900/70 p-6">
          <div className="flex items-center gap-3 text-slate-200">
            <Sparkles size={20} />
            <h3 className="text-lg font-semibold text-white">No activity yet</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">FocusTube is ready to help you build better browsing habits. Start by adding your first keyword, blocking a channel, and starting a session.</p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
              <CheckCircle2 size={18} className="text-focus" />
              Add first keyword
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
              <CheckCircle2 size={18} className="text-focus" />
              Block first channel
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
              <CheckCircle2 size={18} className="text-focus" />
              Start focus session
            </div>
          </div>
        </div>
      )}

      {hasActivity ? (
        <div className="mt-6 grid gap-3 rounded-[24px] border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-300">
          <p>
            Top focus signal: <span className="font-semibold text-white">{topCategory}</span>
          </p>
          <p>Use the dashboard to tune your filters for stronger momentum.</p>
        </div>
      ) : null}
    </div>
  )
}
