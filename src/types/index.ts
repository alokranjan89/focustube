export type ContentCategory = 'educational' | 'productive' | 'entertainment' | 'dangerous'

export interface FocusTubeSettings {
  enabled: boolean
  blockedKeywords: string[]
  blockedChannels: string[]
  studyMode: boolean
  theme: 'dark' | 'light'
  showDashboard: boolean
  dailyGoal: string
  quote: string
  whitelistedKeywords: string[]
}

export interface AnalyticsState {
  videosBlocked: number
  hoursSaved: number
  focusStreak: number
  productiveDays: number
  categories: Record<ContentCategory, number>
  lastBlockedDay?: string
}

export interface VideoMetadata {
  title: string
  description: string
  channel: string
  hashtags: string[]
  url: string
}

export interface StorageState {
  settings: FocusTubeSettings
  analytics: AnalyticsState
}
