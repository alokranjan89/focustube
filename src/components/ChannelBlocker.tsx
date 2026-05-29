import { useState, type FormEvent } from 'react'

interface ChannelBlockerProps {
  channels: string[]
  onAdd: (channel: string) => void
  onRemove: (channel: string) => void
}

export function ChannelBlocker({ channels, onAdd, onRemove }: ChannelBlockerProps) {
  const [channel, setChannel] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextChannel = channel.trim()
    if (!nextChannel) {
      return
    }
    onAdd(nextChannel)
    setChannel('')
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-focus"
          placeholder="Add blocked channel"
          aria-label="Add blocked channel"
          value={channel}
          onChange={(event) => setChannel(event.currentTarget.value)}
        />
        <button
          type="submit"
          className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600 disabled:opacity-50"
          disabled={!channel.trim()}
        >
          Block
        </button>
      </form>
      <div className="grid gap-2">
        {channels.map((channelItem) => (
          <div key={channelItem} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100">
            <span>{channelItem}</span>
            <button
              type="button"
              className="text-slate-400 transition hover:text-white"
              onClick={() => onRemove(channelItem)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
