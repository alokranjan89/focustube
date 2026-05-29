import { describe, expect, it } from 'vitest'
import { parseBlockingRule, matchesBlockingRules, isChannelBlocked } from '../content/filters'
import type { FocusTubeSettings, VideoMetadata } from '../types'

describe('content/filters', () => {
  it('parses exact, partial, regex, and wildcard rules', () => {
    const exact = parseBlockingRule('"exactKey"')
    const partial = parseBlockingRule('partial')
    const regex = parseBlockingRule('/^rege[xX]$/')
    const wildcard = parseBlockingRule('wild*card')

    expect(exact.type).toBe('exact')
    expect(exact.pattern.test('exactKey')).toBe(true)
    expect(partial.type).toBe('partial')
    expect(partial.pattern.test('partial')).toBe(true)
    expect(regex.type).toBe('regex')
    expect(regex.pattern.test('regeX')).toBe(true)
    expect(wildcard.type).toBe('wildcard')
    expect(wildcard.pattern.test('wildanythingcard')).toBe(true)
  })

  it('matches valid blocking rules and rejects whitelisted terms', () => {
    const settings: FocusTubeSettings = {
      enabled: true,
      blockedKeywords: ['exact', 'part', 'wild*', '/regex$/'],
      blockedChannels: [],
      studyMode: false,
      theme: 'dark',
      showDashboard: false,
      dailyGoal: 'Stay focused',
      quote: 'Keep going',
      whitelistedKeywords: ['partially', 'nope'],
    }

    const exact = { title: 'exact', description: '', channel: '', hashtags: [], url: '' }
    const partial = { title: 'just partial text', description: '', channel: '', hashtags: [], url: '' }
    const wildcard = { title: 'wildanything', description: '', channel: '', hashtags: [], url: '' }
    const regex = { title: 'endsregex', description: '', channel: '', hashtags: [], url: '' }
    const whitelisted = { title: 'partially matched', description: '', channel: '', hashtags: [], url: '' }
    const blockedWhitelist = { title: 'nope', description: '', channel: '', hashtags: [], url: '' }

    expect(matchesBlockingRules(settings, exact)).toBe(true)
    expect(matchesBlockingRules(settings, partial)).toBe(true)
    expect(matchesBlockingRules(settings, wildcard)).toBe(true)
    expect(matchesBlockingRules(settings, regex)).toBe(true)
    expect(matchesBlockingRules(settings, whitelisted)).toBe(false)
    expect(matchesBlockingRules(settings, blockedWhitelist)).toBe(false)
  })

  it('detects blocked channels correctly', () => {
    const settings: FocusTubeSettings = {
      enabled: true,
      blockedKeywords: [],
      blockedChannels: ['chan/nel', 'my'],
      studyMode: false,
      theme: 'dark',
      showDashboard: false,
      dailyGoal: 'Stay focused',
      quote: 'Keep going',
      whitelistedKeywords: [],
    }

    expect(isChannelBlocked(settings, 'chan/nel')).toBe(true)
    expect(isChannelBlocked(settings, 'mychannel')).toBe(true)
    expect(isChannelBlocked(settings, 'safe')).toBe(false)
  })
})
