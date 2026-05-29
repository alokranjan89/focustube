import type { FocusTubeSettings } from '../../types'

const careerTracks = [
  { value: 'mern', label: 'MERN' },
  { value: 'dsa', label: 'DSA' },
  { value: 'java', label: 'Java' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'devops', label: 'DevOps' },
  { value: 'placement', label: 'Placement Prep' }
]

interface CareerModeCardProps {
  settings: FocusTubeSettings
  selectedTrack: string
  onSelectTrack: (track: string) => void
}

export function CareerModeCard({ settings, selectedTrack, onSelectTrack }: CareerModeCardProps) {
  const activeTrack = careerTracks.find((track) => track.value === selectedTrack) ?? careerTracks[0]
  const goalText = settings.dailyGoal || 'Build your next career milestone'

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl shadow-black/20">
      <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Career Mode</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Filter for your next role</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Choose a career focus and align your blocked content with your goals.</p>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-300">Career focus</label>
        <select
          value={activeTrack.value}
          onChange={(event) => onSelectTrack(event.currentTarget.value)}
          className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/20"
        >
          {careerTracks.map((track) => (
            <option key={track.value} value={track.value} className="bg-slate-950 text-white">
              {track.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Currently filtering for</p>
        <p className="mt-2 text-lg font-semibold text-white">{activeTrack.label} Development</p>
        <p className="mt-3 text-sm leading-6 text-slate-400">{goalText}</p>
      </div>
    </div>
  )
}
