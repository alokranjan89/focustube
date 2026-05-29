import type { FocusTubeSettings, VideoMetadata } from '../types'

export type ContentCategory = 'educational' | 'productive' | 'entertainment' | 'dangerous'

export interface BlockingRule {
  raw: string
  whitelist: boolean
  pattern: RegExp
  type: 'exact' | 'partial' | 'regex' | 'wildcard'
}

export interface PageSettings extends FocusTubeSettings {
  whitelistedKeywords: string[]
}

export type VideoElement = Element

export interface ContentScriptMessage {
  type: 'VIDEO_BLOCKED' | 'BLOCK_CHANNEL'
  payload: Record<string, unknown>
}

export interface VideoBlockedPayload {
  category: ContentCategory
  title: string
  url: string
}

export interface BlockChannelPayload {
  channel: string
}
