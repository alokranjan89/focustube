import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'

interface KeywordListProps {
  title: string
  description: string
  placeholder: string
  buttonLabel: string
  emptyMessage: string
  keywords: string[]
  onAdd: (keyword: string) => void
  onRemove: (keyword: string) => void
}

export function KeywordList({
  title,
  description,
  placeholder,
  buttonLabel,
  emptyMessage,
  keywords,
  onAdd,
  onRemove
}: KeywordListProps) {
  const [value, setValue] = useState('')

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = value.trim()
    if (!keyword) {
      return
    }
    onAdd(keyword)
    setValue('')
  }

  const commonKeywords = ['movie', 'trending', 'viral', 'shorts', 'comedy', 'reaction']

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <p className="text-sm text-slate-300">{description}</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-focus focus:bg-slate-950"
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
        <button
          type="submit"
          className="rounded-2xl bg-focus px-6 py-3 text-sm font-semibold text-white transition hover:bg-focus/90 disabled:opacity-50"
          disabled={!value.trim()}
        >
          {buttonLabel}
        </button>
      </form>

      {keywords.length > 0 ? (
        <div className="space-y-2">
          <div className="grid gap-2">
            {keywords.map((keyword) => (
              <div
                key={keyword}
                className="group flex items-center justify-between rounded-2xl border border-focus/30 bg-focus/10 px-4 py-3 text-sm text-slate-100 transition hover:border-focus/50 hover:bg-focus/15"
              >
                <div className="flex-1">
                  <span className="font-medium">{keyword}</span>
                  <p className="mt-1 text-xs text-slate-400">{keyword}</p>
                </div>
                <button
                  type="button"
                  className="ml-3 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  onClick={() => onRemove(keyword)}
                  title={`Remove ${keyword}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-4 text-center">
          <p className="text-sm text-slate-400">{emptyMessage}</p>
          <p className="mt-2 text-xs text-slate-500">
            Quick add:{' '}
            {commonKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => onAdd(kw)}
                className="ml-2 inline-block rounded px-2 py-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-300"
              >
                {kw}
              </button>
            ))}
          </p>
        </div>
      )}
    </div>
  )
}
