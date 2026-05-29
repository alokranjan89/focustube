import { sendRuntimeMessage } from '../services/runtimeMessaging'
import { selectChannelAnchors, VIDEO_SELECTORS } from './selectors'

const BUTTON_CLASS = 'focustube-channel-block-button'
const PROCESSED_ATTR = 'data-focustube-channel-action'

function createBlockButton(channelName: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = BUTTON_CLASS
  button.textContent = 'Block channel'
  button.style.cssText = 'margin-left:8px;padding:6px 10px;border:none;border-radius:999px;background:rgba(124,58,237,.92);color:#fff;font-size:11px;cursor:pointer;'
  button.addEventListener('click', (event) => {
    event.stopPropagation()
    sendRuntimeMessage({
      type: 'BLOCK_CHANNEL',
      payload: { channel: channelName }
    }).catch(() => {
      // Do not block page execution on error.
    })
  })
  return button
}

function getVideoCard(anchor: Element): Element | null {
  return anchor.closest(VIDEO_SELECTORS.join(','))
}

export function initializeChannelActions(): void {
  selectChannelAnchors().forEach((anchor) => {
    if (anchor.getAttribute(PROCESSED_ATTR) === 'true') {
      return
    }

    const channelName = anchor.textContent?.trim()
    if (!channelName) {
      anchor.setAttribute(PROCESSED_ATTR, 'true')
      return
    }

    const container = getVideoCard(anchor) ?? anchor.parentElement
    if (!container || container.querySelector(`button.${BUTTON_CLASS}`)) {
      anchor.setAttribute(PROCESSED_ATTR, 'true')
      return
    }

    const button = createBlockButton(channelName)
    container.appendChild(button)
    anchor.setAttribute(PROCESSED_ATTR, 'true')
  })
}

export function removeChannelActions(): void {
  document.querySelectorAll(`button.${BUTTON_CLASS}`).forEach((button) => button.remove())
  document.querySelectorAll(`[${PROCESSED_ATTR}]`).forEach((element) => element.removeAttribute(PROCESSED_ATTR))
}
