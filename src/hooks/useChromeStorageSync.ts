import { useEffect, useState } from 'react'
import type { AnalyticsState, FocusTubeSettings, StorageState } from '../types'
import {
  DEFAULT_ANALYTICS,
  DEFAULT_SETTINGS,
  type StorageChanges,
  getStorageState,
  onStorageChanged,
  saveAnalytics,
  saveSettings
} from '../services/chromeStorage'

export function useChromeStorageSync() {
  const [settings, setSettings] = useState<FocusTubeSettings>(DEFAULT_SETTINGS)
  const [analytics, setAnalytics] = useState<AnalyticsState>(DEFAULT_ANALYTICS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    getStorageState().then((state) => {
      if (!isMounted) {
        return
      }
      setSettings(state.settings)
      setAnalytics(state.analytics)
      setReady(true)
    })

    const listener = (changes: StorageChanges, areaName: string) => {
      if (areaName !== 'sync' && areaName !== 'local') {
        return
      }

      const settingChange = changes.settings
      if (settingChange?.newValue) {
        const updatedSettings = settingChange.newValue.data ?? settingChange.newValue
        setSettings({ ...DEFAULT_SETTINGS, ...updatedSettings })
      }

      const analyticsChange = changes.analytics
      if (analyticsChange?.newValue) {
        const updatedAnalytics = analyticsChange.newValue.data ?? analyticsChange.newValue
        setAnalytics({ ...DEFAULT_ANALYTICS, ...updatedAnalytics })
      }
    }

    const unsubscribe = onStorageChanged(listener)
    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const updateSettings = async (next: FocusTubeSettings) => {
    await saveSettings(next)
    setSettings(next)
  }

  const updateAnalytics = async (next: AnalyticsState) => {
    await saveAnalytics(next)
    setAnalytics(next)
  }

  return {
    settings,
    analytics,
    ready,
    updateSettings,
    updateAnalytics
  }
}
