import type { ContentCategory } from './types'
import { sendRuntimeMessage } from '../services/runtimeMessaging'

export function sendVideoBlockedEvent(category: ContentCategory, title: string, url: string): void {
  sendRuntimeMessage({
    type: 'VIDEO_BLOCKED',
    payload: {
      category,
      title,
      url
    }
  }).catch(() => {
    // analytics should not block page execution
  })
}
