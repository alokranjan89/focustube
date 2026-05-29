import type { RuntimeMessage, VideoBlockedMessage, BlockChannelMessage, RequestStorageStateMessage } from './runtimeMessaging'
import { getStorageState, saveAnalytics, saveSettings } from './chromeStorage'
import { recordBlockEvent } from './analytics'
import type { StorageState } from '../types'

export interface MessageHandlerDependencies {
  getStorageState: () => Promise<StorageState>
  saveSettings: (settings: StorageState['settings']) => Promise<void>
  saveAnalytics: (analytics: StorageState['analytics']) => Promise<void>
}

export async function handleRuntimeMessage(
  message: RuntimeMessage,
  deps: MessageHandlerDependencies
): Promise<unknown> {
  switch (message.type) {
    case 'REQUEST_STORAGE_STATE': {
      return deps.getStorageState()
    }
    case 'VIDEO_BLOCKED': {
      const videoMessage = message as VideoBlockedMessage
      const currentState = await deps.getStorageState()
      const nextAnalytics = recordBlockEvent(currentState.analytics, videoMessage.payload.category)
      await deps.saveAnalytics(nextAnalytics)
      return { success: true }
    }
    case 'BLOCK_CHANNEL': {
      const blockMessage = message as BlockChannelMessage
      const currentState = await deps.getStorageState()
      const existing = currentState.settings.blockedChannels
      const nextChannels = Array.from(new Set([...existing, blockMessage.payload.channel.trim()]))
      await deps.saveSettings({ ...currentState.settings, blockedChannels: nextChannels })
      return { success: true }
    }
    case 'SETTINGS_UPDATED': {
      const settings = message.payload
      await deps.saveSettings(settings)
      return { success: true }
    }
    case 'STORAGE_STATE_RESPONSE':
      return { success: true }
    default: {
      return { success: false, error: 'unknownMessageType' }
    }
  }
}
