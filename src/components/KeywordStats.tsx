import { useEffect, useState } from 'react'
import type { FocusTubeSettings } from '../types'

interface KeywordStats {
  keyword: string
  potential: boolean
}

interface KeywordStatsProps {
  settings: FocusTubeSettings
}

export function KeywordStats({ settings }: KeywordStatsProps) {
  const [stats, setStats] = useState<KeywordStats[]>([])

  useEffect(() => {
    // Generate stats based on custom keywords
    const customStats = settings.blockedKeywords.map(keyword => ({
      keyword,
      potential: true
    }))
    setStats(customStats)
  }, [settings.blockedKeywords])

  if (stats.length === 0) {
    return null
  }

  const commonBlockReasons = [
    'Entertainment content',
    'Distraction videos',
    'Non-educational material',
    'Channel-based blocks'
  ]

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-focus">What Gets Blocked</h3>
        <p className="mt-2 text-sm text-slate-400">Videos are blocked when they match:</p>
      </div>
      
      <div className="space-y-3">
        {commonBlockReasons.map(reason => (
          <div key={reason} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-focus flex-shrink-0" />
            <span className="text-sm text-slate-300">{reason}</span>
          </div>
        ))}
        
        {stats.length > 0 && (
          <>
            <div className="my-3 border-t border-white/10" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Your Custom Keywords</p>
            <div className="grid gap-2">
              {stats.map(stat => (
                <div key={stat.keyword} className="flex items-center gap-2 rounded-lg bg-focus/10 px-3 py-2 text-sm text-slate-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-focus" />
                  <code className="text-xs font-mono">{stat.keyword}</code>
                  <span className="ml-auto text-xs text-slate-500">Active</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
