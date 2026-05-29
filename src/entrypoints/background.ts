import { getStorageState, saveAnalytics, saveSettings } from '../services/chromeStorage'
import { handleRuntimeMessage } from '../services/messageHandler'
import type { RuntimeMessage } from '../services/runtimeMessaging'

const messageHandlerDependencies = {
  getStorageState,
  saveSettings,
  saveAnalytics
}

chrome.runtime.onInstalled.addListener(async () => {
  const state = await getStorageState()
  await saveSettings(state.settings)
  await saveAnalytics(state.analytics)
})

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  handleRuntimeMessage(message, messageHandlerDependencies)
    .then((response) => sendResponse(response))
    .catch((error) => sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }))
  return true
})
