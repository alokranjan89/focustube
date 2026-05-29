import { describe, expect, it, vi } from 'vitest'
import { handleRuntimeMessage } from '../services/messageHandler'
import type { StorageState } from '../types'

const fakeState: StorageState = {
  settings: {
    enabled: true,
    blockedKeywords: [],
    blockedChannels: [],
    studyMode: false,
    theme: 'dark',
    showDashboard: true,
    dailyGoal: '',
    quote: '',
    whitelistedKeywords: [],
  },
  analytics: {
    videosBlocked: 0,
    hoursSaved: 0,
    focusStreak: 0,
    productiveDays: 0,
    categories: {
      educational: 0,
      productive: 0,
      entertainment: 0,
      dangerous: 0,
    },
  },
}

const deps = {
  getStorageState: vi.fn(async () => fakeState),
  saveSettings: vi.fn(async () => {}),
  saveAnalytics: vi.fn(async () => {}),
}

describe('services/messageHandler', () => {
  it('handles VIDEO_BLOCKED messages', async () => {
    const response = await handleRuntimeMessage({
      type: 'VIDEO_BLOCKED',
      payload: { category: 'entertainment' },
    } as any, deps)

    expect(response).toEqual({ success: true })
    expect(deps.getStorageState).toHaveBeenCalled()
    expect(deps.saveAnalytics).toHaveBeenCalled()
  })

  it('returns an error for unsupported messages', async () => {
    const result = await handleRuntimeMessage({ type: 'UNKNOWN_MESSAGE' } as any, deps)

    expect(result).toEqual({ success: false, error: 'unknownMessageType' })
  })
})
