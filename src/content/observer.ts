import { selectContentContainers } from './selectors'

const DEBOUNCE_MS = 250
let observer: MutationObserver | null = null
let timeoutId: number | null = null
let lastRun = 0

function scheduleIdleCallback(callback: () => void): void {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, { timeout: 500 })
    return
  }

  window.setTimeout(callback, 200)
}

function debounceScan(callback: () => void): void {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId)
  }

  timeoutId = window.setTimeout(() => {
    const now = Date.now()
    if (now - lastRun < DEBOUNCE_MS) {
      return debounceScan(callback)
    }
    lastRun = now
    scheduleIdleCallback(() => callback())
  }, DEBOUNCE_MS)
}

export function connectObserver(onUpdate: () => void): void {
  if (observer) {
    return
  }

  const containers = selectContentContainers()
  const targets = containers.length > 0 ? containers : [document.body]

  observer = new MutationObserver((mutations) => {
    if (mutations.length === 0) {
      return
    }
    debounceScan(onUpdate)
  })

  for (const target of targets) {
    observer.observe(target, { childList: true, subtree: true })
  }
}

export function disconnectObserver(): void {
  if (!observer) {
    return
  }

  observer.disconnect()
  observer = null

  if (timeoutId !== null) {
    window.clearTimeout(timeoutId)
    timeoutId = null
  }
}
