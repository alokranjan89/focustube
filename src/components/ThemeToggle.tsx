interface ThemeToggleProps {
  theme: 'dark' | 'light'
  onChange: (theme: 'dark' | 'light') => void
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-sm text-slate-100">
      <div>
        <p className="font-semibold text-white">Theme</p>
        <p className="text-slate-400">Switch between dark and light modes for the options page.</p>
      </div>
      <div className="flex gap-2">
        {(['dark', 'light'] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={theme === option}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              theme === option
                ? 'bg-focus text-white shadow-glow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => onChange(option)}
          >
            {option === 'dark' ? 'Dark' : 'Light'}
          </button>
        ))}
      </div>
    </div>
  )
}
