import type { AnalyticsState, ContentCategory } from '../types'

export function estimateTimeSaved(videosBlocked: number): number {
  return Math.min(999, Number((videosBlocked * 0.1).toFixed(2)))
}

export function recordBlockEvent(
  analytics: AnalyticsState,
  category: ContentCategory
): AnalyticsState {
  const next = { ...analytics, categories: { ...analytics.categories } }
  next.videosBlocked += 1
  next.hoursSaved = Number((next.hoursSaved + 0.1).toFixed(2))
  next.categories[category] = (next.categories[category] || 0) + 1

  const today = new Date().toISOString().slice(0, 10)
  if (analytics.lastBlockedDay !== today) {
    next.lastBlockedDay = today
    next.focusStreak = analytics.lastBlockedDay === today ? analytics.focusStreak : analytics.focusStreak + 1
    next.productiveDays += 1
  }

  return next
}
