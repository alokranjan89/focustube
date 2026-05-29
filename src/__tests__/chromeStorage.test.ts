import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import * as chromeStorage from '../services/chromeStorage'

const fakeStorage: Record<string, any> = {}

function makeStorageArea() {
  return {
    get: vi.fn((keys: unknown, callback: (result: Record<string, unknown>) => void) => {
      const result: Record<string, unknown> = {}
      if (typeof keys === 'string') {
        result[keys] = fakeStorage[keys]
      } else if (Array.isArray(keys)) {
        keys.forEach((key) => { result[key] = fakeStorage[key] })
      } else {
        Object.assign(result, fakeStorage)
        Object.entries(keys as Record<string, unknown>).forEach(([key, value]) => {
          if (result[key] === undefined) {
            result[key] = value
          }
        })
      }
      callback(result)
    }),
    set: vi.fn((items: Record<string, unknown>, callback?: () => void) => {
      Object.assign(fakeStorage, items)
      callback?.()
    }),
  }
}

beforeEach(() => {
  fakeStorage['settings'] = undefined
  fakeStorage['analytics'] = undefined

  globalThis.chrome = {
    storage: {
      sync: makeStorageArea(),
      local: makeStorageArea(),
    },
  } as any
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('services/chromeStorage', () => {
  it('returns default settings when storage is empty', async () => {
    const state = await chromeStorage.getStorageState()
    expect(state.settings.blockedChannels).toEqual([])
    expect(state.settings.blockedKeywords).toContain('tmkoc')
    expect(state.analytics.videosBlocked).toBe(0)
  })

  it('saves and loads valid settings', async () => {
    const customSettings = {
      enabled: true,
      blockedKeywords: ['focus'],
      blockedChannels: ['blocked-channel'],
      studyMode: false,
      theme: 'dark' as const,
      showDashboard: true,
      dailyGoal: 'Stay focused',
      quote: 'Keep moving',
      whitelistedKeywords: [],
    }

    await chromeStorage.saveSettings(customSettings)
    const state = await chromeStorage.getStorageState()

    expect(state.settings.blockedKeywords).toEqual(['focus'])
    expect(state.settings.blockedChannels).toEqual(['blocked-channel'])
    expect(state.settings.showDashboard).toBe(true)
  })
})
