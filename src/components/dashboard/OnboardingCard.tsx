import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

interface OnboardingCardProps {
  hasKeywords: boolean
  hasChannels: boolean
  hasFocusMode: boolean
  onAddSampleKeyword: () => void
  onAddSampleChannel: () => void
  onStartSession: () => void
}

export function OnboardingCard({
  hasKeywords,
  hasChannels,
  hasFocusMode,
  onAddSampleKeyword,
  onAddSampleChannel,
  onStartSession
}: OnboardingCardProps) {
  return (
    <div className="rounded-[28px] border border-focus/15 bg-purple-950/10 p-6 shadow-xl shadow-black/15">
      <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/90 p-5">
        <Sparkles className="text-focus" size={26} />
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Welcome to FocusTube</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Get started with your first focus flow</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: 'Add distraction keywords',
            completed: hasKeywords,
            action: onAddSampleKeyword,
            button: 'Add suggested keyword'
          },
          {
            title: 'Block channels',
            completed: hasChannels,
            action: onAddSampleChannel,
            button: 'Add blocked channel'
          },
          {
            title: 'Start focus session',
            completed: hasFocusMode,
            action: onStartSession,
            button: 'Begin session'
          },
          {
            title: 'Review analytics',
            completed: false,
            action: onStartSession,
            button: 'Open dashboard'
          }
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/90 p-5">
            <div className="flex items-start gap-3">
              <span className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl ${item.completed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                <CheckCircle2 size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.completed ? 'Completed' : 'Recommended next step'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={item.action}
              className="mt-5 inline-flex items-center gap-2 rounded-3xl bg-focus px-4 py-3 text-sm font-semibold text-white transition hover:bg-focus/90"
            >
              {item.button}
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
