import type { InputHTMLAttributes } from 'react'

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Switch({ label, className = '', ...props }: SwitchProps) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/75 px-4 py-3 text-sm ${className}`}>
      <span>{label}</span>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="h-7 w-12 rounded-full bg-slate-800 p-1 transition-all duration-200 peer-checked:bg-focus">
        <span className="block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  )
}
