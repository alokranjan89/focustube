import { connectObserver } from './observer'
import { removeDashboard, startDashboardCleanup } from './dashboard'
import { refreshScanner } from './pageScanner'
import { initializeChannelActions, removeChannelActions } from './channelActions'
import { getStorageState, onStorageChanged } from '../services/chromeStorage'
import type { FocusTubeSettings } from '../types'

async function refreshApplication(settings: FocusTubeSettings): Promise<void> {
  removeDashboard()

  if (settings.enabled) {
    initializeChannelActions()
  } else {
    removeChannelActions()
  }

  await refreshScanner(settings)
}

async function initialize(): Promise<void> {
  startDashboardCleanup()

  const state = await getStorageState()
  await refreshApplication(state.settings)

  connectObserver(async () => {
    const updatedState = await getStorageState()
    await refreshApplication(updatedState.settings)
  })

  const unsubscribe = onStorageChanged((changes) => {
    if (changes.settings?.newValue) {
      const nextSettings = changes.settings.newValue.data ?? changes.settings.newValue
      refreshApplication(nextSettings as FocusTubeSettings).catch(() => {
        // Don't block page execution if refreshed fails.
      })
    }
  })

  // Clean up if this content script is reloaded or detached.
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => unsubscribe())
  }
}

initialize().catch(() => {
  // best effort only
})
