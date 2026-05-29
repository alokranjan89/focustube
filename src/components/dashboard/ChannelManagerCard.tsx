import { useMemo, useState, type FormEvent } from 'react'
import { Search, Trash2 } from 'lucide-react'

interface ChannelManagerCardProps {
  channels: string[]
  onAdd: (channel: string) => void
  onRemove: (channel: string) => void
}

export function ChannelManagerCard({ channels, onAdd, onRemove }: ChannelManagerCardProps) {
  const [search, setSearch] = useState('')
  const [value, setValue] = useState('')

  const filteredChannels = useMemo(
    () => channels.filter((channel) => channel.toLowerCase().includes(search.toLowerCase())),
    [channels, search]
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextChannel = value.trim()
    if (!nextChannel) return
    onAdd(nextChannel)
    setValue('')
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Channels</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Blocked channels</h2>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">{channels.length}</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="Add a blocked channel"
          aria-label="Add a blocked channel"
          className="min-w-0 flex-1 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/20"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-3xl bg-focus px-5 py-3 text-sm font-semibold text-white transition hover:bg-focus/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Block
        </button>
      </form>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
        <label className="sr-only" htmlFor="channel-search">
          Search blocked channels
        </label>
        <div className="flex items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/90 px-4 py-3 text-slate-300">
          <Search size={16} />
          <input
            id="channel-search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search channels"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel, index) => (
            <div key={channel} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-800 text-sm font-semibold text-white">
                {channel.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{channel}</p>
                <p className="mt-1 text-xs text-slate-500">Blocked channel</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(channel)}
                className="rounded-2xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label={`Remove ${channel}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/70 p-5 text-sm text-slate-400">
            <p className="font-semibold text-white">No blocked channels yet</p>
            <p className="mt-2">Block a channel to keep your recommendations focused and clean.</p>
          </div>
        )}
      </div>
    </div>
  )
}
