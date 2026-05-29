import { z } from 'zod'
import type { AnalyticsState, FocusTubeSettings, StorageState } from '../types'

export type StorageChanges = Record<string, chrome.storage.StorageChange>

export const DEFAULT_SETTINGS: FocusTubeSettings = {
  enabled: false,
  blockedKeywords: [
    'tmkoc',
    'taarak mehta',
    'movie',
    'full episode',
    'sitcom',
    'comedy clips',
    'reels',
    'shorts'
  ],
  blockedChannels: [],
  studyMode: false,
  theme: 'dark',
  showDashboard: false,
  dailyGoal: 'Complete one focused session',
  quote: 'Progress is a habit, not an event.',
  whitelistedKeywords: []
}

export const DEFAULT_ANALYTICS: AnalyticsState = {
  videosBlocked: 0,
  hoursSaved: 0,
  focusStreak: 0,
  productiveDays: 0,
  categories: {
    educational: 0,
    productive: 0,
    entertainment: 0,
    dangerous: 0
  }
}

const SettingsSchema = z.object({
  enabled: z.boolean(),
  blockedKeywords: z.array(z.string()),
  blockedChannels: z.array(z.string()),
  studyMode: z.boolean(),
  theme: z.enum(['dark', 'light']),
  showDashboard: z.boolean(),
  dailyGoal: z.string(),
  quote: z.string(),
  whitelistedKeywords: z.array(z.string()).optional()
})

const StoredSettingsSchema = z.object({
  version: z.literal(1),
  data: SettingsSchema
})

const AnalyticsSchema = z.object({
  videosBlocked: z.number(),
  hoursSaved: z.number(),
  focusStreak: z.number(),
  productiveDays: z.number(),
  categories: z.record(z.union([z.literal('educational'), z.literal('productive'), z.literal('entertainment'), z.literal('dangerous')]), z.number()),
  lastBlockedDay: z.string().optional()
})

const StoredAnalyticsSchema = z.object({
  version: z.literal(1),
  data: AnalyticsSchema
})

interface StorageArea {
  get(keys: unknown, callback: (result: unknown) => void): void
  set(items: Record<string, unknown>, callback?: () => void): void
}

function getStorageApi(area: 'sync' | 'local'): StorageArea {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return area === 'sync' ? chrome.storage.sync : chrome.storage.local
  }

  return {
    get: (keys, callback) => {
      const settingsJson = window.localStorage.getItem('focustube-settings')
      const analyticsJson = window.localStorage.getItem('focustube-analytics')
      const storedSettings = settingsJson ? JSON.parse(settingsJson) : null
      const storedAnalytics = analyticsJson ? JSON.parse(analyticsJson) : null
      callback({
        settings: storedSettings ?? { version: 1, data: DEFAULT_SETTINGS },
        analytics: storedAnalytics ?? { version: 1, data: DEFAULT_ANALYTICS }
      })
    },
    set: (items, callback) => {
      if (items.settings != null) {
        window.localStorage.setItem('focustube-settings', JSON.stringify(items.settings))
      }
      if (items.analytics != null) {
        window.localStorage.setItem('focustube-analytics', JSON.stringify(items.analytics))
      }
      callback?.()
    }
  }
}

function storageGet<T>(area: 'sync' | 'local', keys: unknown): Promise<T> {
  return new Promise((resolve) => {
    getStorageApi(area).get(keys, (result) => {
      if (typeof chrome !== 'undefined' && chrome.runtime?.lastError) {
        console.warn('Storage get error', chrome.runtime.lastError.message)
      }
      resolve(result as T)
    })
  })
}

function storageSet(area: 'sync' | 'local', items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    getStorageApi(area).set(items, () => {
      if (typeof chrome !== 'undefined' && chrome.runtime?.lastError) {
        console.warn('Storage set error', chrome.runtime.lastError.message)
      }
      resolve()
    })
  })
}

function parseSettings(value: unknown): FocusTubeSettings {
  const storedResult = StoredSettingsSchema.safeParse(value)
  if (storedResult.success) {
    return { ...DEFAULT_SETTINGS, ...storedResult.data.data, whitelistedKeywords: storedResult.data.data.whitelistedKeywords ?? [] }
  }

  const legacyResult = SettingsSchema.safeParse(value)
  if (legacyResult.success) {
    return { ...DEFAULT_SETTINGS, ...legacyResult.data, whitelistedKeywords: legacyResult.data.whitelistedKeywords ?? [] }
  }

  return DEFAULT_SETTINGS
}

function parseAnalytics(value: unknown): AnalyticsState {
  const storedResult = StoredAnalyticsSchema.safeParse(value)
  if (storedResult.success) {
    return { ...DEFAULT_ANALYTICS, ...storedResult.data.data }
  }

  const legacyResult = AnalyticsSchema.safeParse(value)
  if (legacyResult.success) {
    return { ...DEFAULT_ANALYTICS, ...legacyResult.data }
  }

  return DEFAULT_ANALYTICS
}

export async function getStorageState(): Promise<StorageState> {
  const [syncResult, localResult] = await Promise.all([
    storageGet<{ settings: unknown }>('sync', { settings: { version: 1, data: DEFAULT_SETTINGS } }),
    storageGet<{ analytics: unknown }>('local', { analytics: { version: 1, data: DEFAULT_ANALYTICS } })
  ])

  return {
    settings: parseSettings(syncResult.settings),
    analytics: parseAnalytics(localResult.analytics)
  }
}

export function saveSettings(settings: FocusTubeSettings): Promise<void> {
  return storageSet('sync', { settings: { version: 1, data: settings } })
}

export function saveAnalytics(analytics: AnalyticsState): Promise<void> {
  return storageSet('local', { analytics: { version: 1, data: analytics } })
}

export function onStorageChanged(
  callback: (changes: StorageChanges, areaName: string) => void
): () => void {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    const listener = (changes: StorageChanges, areaName: string) => {
      if (areaName === 'sync' || areaName === 'local') {
        callback(changes, areaName)
      }
    }

    chrome.storage.onChanged.addListener(listener)

    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }

  return () => {
    // no-op when storage API is unavailable
  }
}
