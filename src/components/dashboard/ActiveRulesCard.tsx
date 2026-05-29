import { Check } from 'lucide-react'
import type { FocusTubeSettings } from '../../types'

function formatRuleType(keyword: string) {
  if (keyword.startsWith('/') && keyword.endsWith('/')) {
    return 'Regex'
  }

  if (keyword.includes(' ')) {
    return 'Exact'
  }

  return 'Partial'
}

interface ActiveRulesCardProps {
  settings: FocusTubeSettings
}

export function ActiveRulesCard({ settings }: ActiveRulesCardProps) {
  const blockedRules = settings.blockedKeywords
  const allowlistRules = settings.whitelistedKeywords

  const rules = blockedRules.map((keyword) => ({
    label: keyword,
    type: formatRuleType(keyword),
    variant: 'blocked'
  }))

  const allowlist = allowlistRules.map((keyword) => ({
    label: keyword,
    type: formatRuleType(keyword),
    variant: 'allowlist'
  }))

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Rules Preview</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Active rules</h2>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
          {blockedRules.length + allowlistRules.length} total
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
          <p className="text-slate-400">Rules are applied in real time on YouTube feeds and recommendations.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">Exact & partial matches</span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">Regex support</span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">Allowlist rules</span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">Channel-based filters</span>
          </div>
        </div>

        {rules.length + allowlist.length > 0 ? (
          <div className="grid gap-3">
            {rules.concat(allowlist).map((rule) => (
              <div key={`${rule.variant}-${rule.label}`} className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-focus/15 text-focus">{rule.type[0]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-white">{rule.label}</p>
                    <p className="text-xs text-slate-500">{rule.type} match • {rule.variant === 'allowlist' ? 'Allowlist' : 'Blocked'}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{rule.variant === 'allowlist' ? 'Keep' : 'Hide'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/70 p-5 text-sm text-slate-400">
            <p className="font-semibold text-white">No active rules yet</p>
            <p className="mt-2">Add keywords and allowlist terms to make your dashboard more useful.</p>
          </div>
        )}
      </div>
    </div>
  )
}
