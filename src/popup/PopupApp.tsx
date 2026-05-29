import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DEFAULT_ANALYTICS, DEFAULT_SETTINGS, type StorageChanges, getStorageState, saveSettings } from '../services/chromeStorage'
import { estimateTimeSaved } from '../services/analytics'
import { useTheme } from '../hooks/useTheme'
import type { AnalyticsState, FocusTubeSettings } from '../types'

export function PopupApp() {
  const [settings, setSettings] = useState<FocusTubeSettings>(DEFAULT_SETTINGS)
  const [analytics, setAnalytics] = useState<AnalyticsState>(DEFAULT_ANALYTICS)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('Loading...')

  useTheme(settings)

  useEffect(() => {
    getStorageState().then((state) => {
      setSettings(state.settings)
      setAnalytics(state.analytics)
      setReady(true)
      setMessage(state.settings.enabled ? 'FocusTube is on' : 'FocusTube is off')
    })

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      const listener = (changes: StorageChanges) => {
        if (changes.settings?.newValue) {
          const updatedSettings = changes.settings.newValue.data ?? changes.settings.newValue
          const nextSettings = { ...DEFAULT_SETTINGS, ...updatedSettings }
          setSettings(nextSettings)
          setMessage(nextSettings.enabled ? 'FocusTube is on' : 'FocusTube is off')
        }
        if (changes.analytics?.newValue) {
          const updatedAnalytics = changes.analytics.newValue.data ?? changes.analytics.newValue
          setAnalytics({ ...DEFAULT_ANALYTICS, ...updatedAnalytics })
        }
      }
      chrome.storage.onChanged.addListener(listener)
      return () => chrome.storage.onChanged.removeListener(listener)
    }
  }, [])

  const savedHours = estimateTimeSaved(analytics.videosBlocked)
  const modeLabel = useMemo(() => {
    if (!settings.enabled) return 'Off'
    if (settings.studyMode) return 'Study Mode'
    return 'Focus Mode'
  }, [settings.enabled, settings.studyMode])

  const toggleEnabled = async () => {
    const nextSettings = { ...settings, enabled: !settings.enabled }
    await saveSettings(nextSettings)
    setSettings(nextSettings)
    setMessage(nextSettings.enabled ? 'FocusTube is on' : 'FocusTube is off')
  }

  const openOptions = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open('/options.html', '_blank')
    }
  }

  return (
    <main className="min-h-screen max-h-[640px] w-[360px] bg-slate-950/95 p-4 text-slate-100">
      <div className="space-y-4">
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-focus">FocusTube</p>
                <h1 className="mt-2 text-xl font-semibold text-white">{settings.enabled ? 'Blocking active' : 'Blocking paused'}</h1>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{modeLabel}</span>
            </div>
            <p className="text-sm leading-6 text-slate-400">{settings.enabled ? 'Blocked keywords and channels are hidden on YouTube.' : 'YouTube stays normal until you turn FocusTube on.'}</p>
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-white">{analytics.videosBlocked}</div>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">Blocked videos</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-white">{savedHours}h</div>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">Saved time</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Focus streak</p>
              <p className="mt-2 text-3xl font-semibold text-white">{analytics.focusStreak}</p>
            </div>
            <CheckCircle2 size={30} className="text-focus" />
          </div>
        </Card>

        <Button variant={settings.enabled ? 'secondary' : 'primary'} onClick={toggleEnabled} className="w-full">
          {settings.enabled ? 'Turn Off' : 'Turn On'}
        </Button>

        <Button variant="ghost" onClick={openOptions} className="w-full">
          Open Settings <ArrowRight className="ml-2" />
        </Button>

        {ready ? (
          <p className="text-center text-sm text-slate-400">{message}</p>
        ) : (
          <p className="text-center text-sm text-slate-400">Loading settings...</p>
        )}
      </div>
    </main>
  )
}
