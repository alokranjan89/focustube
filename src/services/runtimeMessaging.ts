import type { AnalyticsState, FocusTubeSettings, StorageState } from '../types'

export type SettingsUpdatedMessage = {
  type: 'SETTINGS_UPDATED'
  payload: FocusTubeSettings
}

export type VideoBlockedMessage = {
  type: 'VIDEO_BLOCKED'
  payload: {
    category: 'educational' | 'productive' | 'entertainment' | 'dangerous'
    title: string
    url: string
  }
}

export type BlockChannelMessage = {
  type: 'BLOCK_CHANNEL'
  payload: {
    channel: string
  }
}

export type RequestStorageStateMessage = {
  type: 'REQUEST_STORAGE_STATE'
}

export type StorageStateResponseMessage = {
  type: 'STORAGE_STATE_RESPONSE'
  payload: StorageState
}

export type RuntimeMessage =
  | SettingsUpdatedMessage
  | VideoBlockedMessage
  | BlockChannelMessage
  | RequestStorageStateMessage
  | StorageStateResponseMessage

export function sendRuntimeMessage<Message extends RuntimeMessage>(message: Message): Promise<unknown> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const lastError = chrome.runtime.lastError
      if (lastError) {
        reject(lastError)
        return
      }
      resolve(response)
    })
  })
}

export type RuntimeMessageHandler = (
  message: RuntimeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) => boolean | void

export function onRuntimeMessage(handler: RuntimeMessageHandler): void {
  chrome.runtime.onMessage.addListener(handler)
}
