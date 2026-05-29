import type { ContentCategory, FocusTubeSettings, VideoMetadata } from '../types'

const STANDARD_KEYWORDS = [
  'tmkoc',
  'taarak mehta',
  'movie',
  'full movie',
  'full episode',
  'film',
  'hollywood',
  'bollywood',
  'netflix',
  'prime video',
  'hbo',
  'sitcom',
  'comedy clips',
  'reels',
  'shorts',
  'viral',
  'meme',
  'funny',
  'trailer',
  'challenge',
  'reaction',
  'buzz',
  'binge'
]

const PRODUCTIVE_KEYWORDS = [
  'tutorial',
  'learn',
  'interview prep',
  'dsa',
  'system design',
  'developer',
  'programming',
  'code',
  'coding',
  'software',
  'development',
  'web development',
  'mobile development',
  'machine learning',
  'artificial intelligence',
  'data science',
  'cloud',
  'devops',
  'kubernetes',
  'docker',
  'react',
  'vue',
  'angular',
  'typescript',
  'javascript',
  'python',
  'java',
  'backend',
  'frontend',
  'fullstack',
  'study',
  'productivity',
  'career'
]

export const defaultKeywords = STANDARD_KEYWORDS

export function normalize(text: string): string {
  return text.toLowerCase().trim()
}

export function classifyVideo(data: VideoMetadata): ContentCategory {
  const combined = normalize(`${data.title} ${data.description} ${data.channel} ${data.hashtags.join(' ')}`)

  if (/tmkoc|taarak|taarak mehta|taarak mehta ka ooltah chashmah|shorts|reels|clip|comedy|funny|trailer|challenge|viral|meme|episode/.test(combined)) {
    return 'entertainment'
  }

  if (/movie|full movie|film|hollywood|bollywood|netflix|prime video|hbo|full episode|sitcom/.test(combined)) {
    return 'dangerous'
  }

  if (PRODUCTIVE_KEYWORDS.some((keyword) => combined.includes(keyword))) {
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

export function matchesKeyword(settings: FocusTubeSettings, data: VideoMetadata): boolean {
  const content = normalize(`${data.title} ${data.description} ${data.channel} ${data.hashtags.join(' ')}`)
  return settings.blockedKeywords.some((keyword) => content.includes(normalize(keyword)))
}

export function isChannelBlocked(settings: FocusTubeSettings, channel: string): boolean {
  if (!channel) return false
  return settings.blockedChannels.some((blocked) => normalize(channel).includes(normalize(blocked)))
}

export function shouldHideVideo(settings: FocusTubeSettings, data: VideoMetadata): boolean {
  if (!settings.enabled) {
    return false
  }

  const category = classifyVideo(data)
  const hasKeyword = matchesKeyword(settings, data)
  const blockedChannel = isChannelBlocked(settings, data.channel)

  if (blockedChannel || hasKeyword) {
    return true
  }

  if (settings.studyMode) {
    return category !== 'educational' && category !== 'productive'
  }

  return category === 'entertainment' || category === 'dangerous'
}

export function extractVideoMetadata(element: Element): VideoMetadata {
  const fallbackText = element.textContent?.trim() ?? ''
  const titleEl = element.querySelector('#video-title, a#video-title, yt-formatted-string#title-text, h3 a, h3 span, #title a, yt-formatted-string.title')
  const channelEl = element.querySelector('ytd-channel-name, #channel-name, .ytd-channel-name, a.yt-simple-endpoint, div#channel-info, span.author')
  const descriptionEl = element.querySelector('#description-text, yt-formatted-string#description, .metadata-snippet-text, yt-formatted-string#meta, span#description')
  const hashtagEls = Array.from(element.querySelectorAll('yt-formatted-string a[href*="/hashtag"]'))
  const urlEl = element.querySelector('a#video-title, a[href*="/watch"], a[href*="/shorts/"]') as HTMLAnchorElement | null

  return {
    title: titleEl?.textContent?.trim() || fallbackText,
    description: descriptionEl?.textContent?.trim() || fallbackText,
    channel: channelEl?.textContent?.trim() ?? '',
    hashtags: hashtagEls.map((node) => node.textContent?.trim() ?? ''),
    url: urlEl?.href || window.location.href
  }
}

export function isShortsElement(element: Element): boolean {
  const href = (element as HTMLAnchorElement).href || ''
  return !!href.includes('/shorts/') || normalize(element.textContent || '').includes('shorts')
}
