import type { ContentCategory, FocusTubeSettings, VideoMetadata } from '../types'

const PARTIAL_RULE = 'partial'
const EXACT_RULE = 'exact'
const REGEX_RULE = 'regex'
const WILDCARD_RULE = 'wildcard'

export interface BlockingRule {
  raw: string
  whitelist: boolean
  pattern: RegExp
  type: 'exact' | 'partial' | 'regex' | 'wildcard'
}

export function normalize(text: string): string {
  return text.toLowerCase().trim()
}

function createRegExpFromPattern(value: string): RegExp {
  if (value.startsWith('/') && value.lastIndexOf('/') > 0) {
    const lastSlash = value.lastIndexOf('/')
    const pattern = value.slice(1, lastSlash)
    const flags = value.slice(lastSlash + 1) || 'i'
    return new RegExp(pattern, flags)
  }

  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(escaped, 'i')
}

export function parseBlockingRule(rawRule: string): BlockingRule {
  const raw = rawRule.trim()
  const whitelist = raw.startsWith('!')
  const patternText = whitelist ? raw.slice(1).trim() : raw

  if (patternText === '') {
    return {
      raw,
      whitelist,
      type: PARTIAL_RULE,
      pattern: new RegExp('', 'i')
    }
  }

  if (patternText.startsWith('/') && patternText.lastIndexOf('/') > 0) {
    return {
      raw,
      whitelist,
      type: REGEX_RULE,
      pattern: createRegExpFromPattern(patternText)
    }
  }

  if (patternText.includes('*')) {
    const escaped = patternText.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    const wildcard = escaped.replace(/\*/g, '.*')
    return {
      raw,
      whitelist,
      type: WILDCARD_RULE,
      pattern: new RegExp(`^${wildcard}$`, 'i')
    }
  }

  const exactMatch = patternText.startsWith('"') && patternText.endsWith('"')

  if (exactMatch) {
    const phrase = patternText.slice(1, -1).trim()
    return {
      raw,
      whitelist,
      type: EXACT_RULE,
      pattern: new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    }
  }

  return {
    raw,
    whitelist,
    type: PARTIAL_RULE,
    pattern: new RegExp(`${patternText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
  }
}

export function buildBlockingRules(rawValues: string[]): BlockingRule[] {
  return rawValues
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map(parseBlockingRule)
}

export function contentMatchesRule(content: string, rule: BlockingRule): boolean {
  return rule.pattern.test(content)
}

export function matchesBlockingRules(settings: FocusTubeSettings, metadata: VideoMetadata): boolean {
  const content = normalize(`${metadata.title} ${metadata.description} ${metadata.channel} ${metadata.hashtags.join(' ')}`)
  const blockingRules = buildBlockingRules(settings.blockedKeywords)
  const whitelistRules = buildBlockingRules(settings.whitelistedKeywords ?? [])

  if (whitelistRules.some((rule) => contentMatchesRule(content, rule))) {
    return false
  }

  return blockingRules.some((rule) => contentMatchesRule(content, rule))
}

export function isChannelBlocked(settings: FocusTubeSettings, channel: string): boolean {
  if (!channel) {
    return false
  }

  const normalizedChannel = normalize(channel)
  return settings.blockedChannels.some((blockedChannel) => {
    const rule = parseBlockingRule(blockedChannel)
    return contentMatchesRule(normalizedChannel, rule)
  })
}

export function classifyVideo(data: VideoMetadata): ContentCategory {
  const combined = normalize(`${data.title} ${data.description} ${data.channel} ${data.hashtags.join(' ')}`)

  if (/tmkoc|taarak mehta|shorts|reels|clip|comedy|funny|trailer|challenge|viral|meme|episode/.test(combined)) {
    return 'entertainment'
  }

  if (/movie|full movie|film|hollywood|bollywood|netflix|prime video|hbo|full episode|sitcom/.test(combined)) {
    return 'dangerous'
  }

  if (/tutorial|learn|interview prep|dsa|system design|developer|programming|code|coding|software|development|web development|mobile development|machine learning|artificial intelligence|data science|cloud|devops|kubernetes|docker|react|vue|angular|typescript|javascript|python|java|backend|frontend|fullstack|study|productivity|career/.test(combined)) {
    return combined.includes('productivity') ? 'productive' : 'educational'
  }

  if (/podcast|lecture|masterclass|bootcamp|webinar/.test(combined)) {
    return 'educational'
  }

  if (/learn|tutorial|study|code|developer|interview/.test(combined)) {
    return 'educational'
  }

  return 'entertainment'
}

export function shouldHideVideo(settings: FocusTubeSettings, metadata: VideoMetadata): boolean {
  if (!settings.enabled) {
    return false
  }

  if (isChannelBlocked(settings, metadata.channel)) {
    return true
  }

  if (matchesBlockingRules(settings, metadata)) {
    return true
  }

  if (settings.studyMode) {
    const category = classifyVideo(metadata)
    return category !== 'educational' && category !== 'productive'
  }

  const category = classifyVideo(metadata)
  return category === 'entertainment' || category === 'dangerous'
}

export function extractVideoMetadata(element: Element): VideoMetadata {
  const fallbackText = element.textContent?.trim() ?? ''
  const titleEl = element.querySelector('#video-title, a#video-title, yt-formatted-string#title-text, h3 a, h3 span, #title a, yt-formatted-string.title')
  const channelEl = element.querySelector('ytd-channel-name, #channel-name, .ytd-channel-name, a.yt-simple-endpoint, div#channel-info, span.author')
  const descriptionEl = element.querySelector('#description-text, yt-formatted-string#description, .metadata-snippet-text, yt-formatted-string#meta, span#description, #description')
  const hashtagEls = Array.from(element.querySelectorAll('yt-formatted-string a[href*="/hashtag"]'))
  const urlEl = element.querySelector('a#video-title, a[href*="/watch"], a[href*="/shorts/"]') as HTMLAnchorElement | null

  return {
    title: titleEl?.textContent?.trim() || fallbackText,
    description: descriptionEl?.textContent?.trim() || '',
    channel: channelEl?.textContent?.trim() ?? '',
    hashtags: hashtagEls.map((node) => node.textContent?.trim() ?? ''),
    url: urlEl?.href || window.location.href
  }
}

export function isShortsElement(element: Element): boolean {
  const href = (element as HTMLAnchorElement)?.href ?? ''
  return href.includes('/shorts/') || normalize(element.textContent ?? '').includes('shorts')
}
