export const VIDEO_SELECTORS = [
  'ytd-rich-item-renderer',
  'ytd-grid-video-renderer',
  'ytd-video-renderer',
  'ytd-compact-video-renderer',
  'ytd-rich-grid-media',
  'ytd-reel-shelf-renderer',
  'ytd-rich-shelf-renderer',
  'ytd-shelf-renderer'
]

export const CHANNEL_ANCHOR_SELECTORS = [
  'ytd-channel-name',
  'a#channel-name',
  'yt-formatted-string#channel-name'
]

export const CONTENT_CONTAINER_SELECTORS = [
  'ytd-rich-grid-renderer',
  'ytd-item-section-renderer',
  'ytd-browse',
  '#contents'
]

export function selectVideoElements(): Element[] {
  return Array.from(document.querySelectorAll(VIDEO_SELECTORS.join(','))).filter(
    (element) => element instanceof Element
  )
}

export function selectChannelAnchors(): Element[] {
  return Array.from(document.querySelectorAll(CHANNEL_ANCHOR_SELECTORS.join(','))).filter(
    (element) => element instanceof Element
  )
}

export function selectContentContainers(): Element[] {
  return Array.from(document.querySelectorAll(CONTENT_CONTAINER_SELECTORS.join(','))).filter(
    (element) => element instanceof Element
  )
}
