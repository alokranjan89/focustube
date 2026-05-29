import { BarChart2, TrendingUp } from 'lucide-react'
import type { AnalyticsState } from '../../types'

interface WeeklyProgressCardProps {
  analytics: AnalyticsState
}

const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function buildSparkline(values: number[]) {
  const max = Math.max(...values, 1)
  const points = values.map((value, index) => {
    const x = 12 + index * 12
    const y = 52 - (value / max) * 40
    return `${x},${y}`
  })
  return points.join(' ')
}

export function WeeklyProgressCard({ analytics }: WeeklyProgressCardProps) {
  const hasActivity = analytics.videosBlocked > 0 || analytics.hoursSaved > 0
  const weeklyActivity = hasActivity
    ? [Math.max(0, analytics.videosBlocked - 5), Math.max(0, analytics.videosBlocked - 3), 2, 3, 4, 5, analytics.videosBlocked]
    : [0, 0, 0, 0, 0, 0, 0]
  const trend = analytics.focusStreak > 3 ? 'Improving' : analytics.focusStreak > 0 ? 'On track' : 'Starting'

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Weekly Progress</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Momentum trends</h2>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">{trend}</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Videos blocked</p>
              <p className="mt-3 text-3xl font-semibold text-white">{analytics.videosBlocked}</p>
            </div>
            <BarChart2 className="text-focus" />
          </div>
          <div className="mt-6 overflow-hidden rounded-[18px] bg-slate-950 p-3">
            <svg viewBox="0 0 96 56" className="h-28 w-full" aria-hidden="true">
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildSparkline(weeklyActivity)}
              />
            </svg>
            <div className="mt-3 grid grid-cols-7 gap-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
              {trendLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
          <div className="flex items-center gap-3 text-white">
            <TrendingUp />
            <p className="font-semibold">Productivity trend</p>
          </div>
          <p className="mt-4 leading-6">
            {hasActivity
              ? 'Your focus rhythm is becoming more consistent. Keep refining your filters to turn blocked content into productive time.'
              : 'No progress chart yet. Add a keyword, block a channel, and start a session to populate your weekly story.'}
          </p>
        </div>
      </div>
    </div>
  )
}
