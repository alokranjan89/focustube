import { classifyVideo, extractVideoMetadata, isShortsElement, shouldHideVideo } from './filters'
import { sendVideoBlockedEvent } from './analytics'
import { selectVideoElements } from './selectors'
import type { FocusTubeSettings } from '../types'

const HIDE_CLASS = 'focustube-hidden'
let processedElements = new WeakSet<Element>()
let currentSettings: FocusTubeSettings | null = null

function hideElement(element: Element): void {
  element.classList.add(HIDE_CLASS)
}

function showElement(element: Element): void {
  element.classList.remove(HIDE_CLASS)
}

function shouldProcessElement(element: Element): boolean {
  return !processedElements.has(element)
}

export function clearProcessedElements(): void {
  processedElements = new WeakSet<Element>()
}

export function reconcileHiddenElements(settings: FocusTubeSettings): void {
  selectVideoElements().forEach((element) => {
    if (!element.classList.contains(HIDE_CLASS)) {
      return
    }

    const metadata = extractVideoMetadata(element)
    if (!shouldHideVideo(settings, metadata)) {
      showElement(element)
    }
  })
}

export async function refreshScanner(settings: FocusTubeSettings): Promise<void> {
  currentSettings = settings
  clearProcessedElements()
  reconcileHiddenElements(settings)

  if (!settings.enabled) {
    return
  }

  scanPage()
}

function updateProcessedElements(element: Element): void {
  processedElements.add(element)
}

function processVideoElement(element: Element): void {
  const metadata = extractVideoMetadata(element)

  if (!currentSettings?.enabled) {
    return
  }

  if (isShortsElement(element)) {
    hideElement(element)
    sendVideoBlockedEvent('dangerous', metadata.title || metadata.channel || 'Shorts', metadata.url)
    updateProcessedElements(element)
    return
  }

  if (shouldHideVideo(currentSettings, metadata)) {
    hideElement(element)
    const category = classifyVideo(metadata)
    sendVideoBlockedEvent(category, metadata.title || metadata.channel || 'Video', metadata.url)
  }

  updateProcessedElements(element)
}

export function scanPage(): void {
  selectVideoElements().forEach((element) => {
    if (!shouldProcessElement(element)) {
      return
    }
    processVideoElement(element)
  })
}

export async function initializeContentScanner(settings: FocusTubeSettings): Promise<void> {
  currentSettings = settings
  scanPage()
}
