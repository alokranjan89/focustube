import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { useChromeStorageSync } from '../hooks/useChromeStorageSync'
import { useTheme } from '../hooks/useTheme'
import type { FocusTubeSettings } from '../types'
import { Switch } from '../components/Switch'
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard'
import { ActiveRulesCard } from '../components/dashboard/ActiveRulesCard'
import { CareerModeCard } from '../components/dashboard/CareerModeCard'
import { ChannelManagerCard } from '../components/dashboard/ChannelManagerCard'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { FocusSessionCard } from '../components/dashboard/FocusSessionCard'
import { OnboardingCard } from '../components/dashboard/OnboardingCard'
import { WeeklyProgressCard } from '../components/dashboard/WeeklyProgressCard'

export function OptionsApp() {
  const { settings, analytics, ready, updateSettings } = useChromeStorageSync()
  const { setTheme } = useTheme(settings)
  const [careerTrack, setCareerTrack] = useState('mern')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme, setTheme])

  const save = async (partial: Partial<FocusTubeSettings>) => {
    await updateSettings({ ...settings, ...partial })
    setSaved('Settings saved successfully')
    window.setTimeout(() => setSaved(''), 3000)
  }

  const handleStartFocus = async () => {
    await save({ enabled: true })
  }

  const handleToggleEnabled = async (enabled: boolean) => {
    await save({ enabled })
  }

  const handleSelectCareerTrack = async (track: string) => {
    const nextGoal = `${track.toUpperCase()} development focus`
    setCareerTrack(track)
    await save({ dailyGoal: nextGoal })
  }

  const addKeyword = async (keyword: string) => {
    if (!keyword || settings.blockedKeywords.includes(keyword)) return
    await save({ blockedKeywords: [keyword, ...settings.blockedKeywords] })
  }

  const removeKeyword = async (keyword: string) => {
    await save({ blockedKeywords: settings.blockedKeywords.filter((item) => item !== keyword) })
  }

  const addChannel = async (channel: string) => {
    if (!channel || settings.blockedChannels.includes(channel)) return
    await save({ blockedChannels: [channel, ...settings.blockedChannels] })
  }

  const removeChannel = async (channel: string) => {
    await save({ blockedChannels: settings.blockedChannels.filter((item) => item !== channel) })
  }

  const addAllowlistKeyword = async (keyword: string) => {
    if (!keyword || settings.whitelistedKeywords.includes(keyword)) return
    await save({ whitelistedKeywords: [keyword, ...settings.whitelistedKeywords] })
  }

  const removeAllowlistKeyword = async (keyword: string) => {
    await save({ whitelistedKeywords: settings.whitelistedKeywords.filter((item) => item !== keyword) })
  }

  const addSampleKeyword = () => {
    addKeyword('study session')
  }

  const addSampleChannel = () => {
    addChannel('hardcorestudy')
  }

  const hasActivity = analytics.videosBlocked > 0 || analytics.hoursSaved > 0 || analytics.focusStreak > 0
  const hasKeywords = settings.blockedKeywords.length > 0
  const hasChannels = settings.blockedChannels.length > 0
  const hasFocusMode = settings.studyMode

  if (!ready) {
    return (
      <main className="min-h-screen bg-slate-950/95 p-6 text-slate-100">
        <p className="text-center text-slate-300">Loading FocusTube settings...</p>
      </main>
    )
  }

  const openPopupPreview = () => {
    window.open('/popup.html', '_blank')
  }

  return (
    <DashboardLayout
      subtitle="Professional productivity dashboard with focus flow, rules, channels, and weekly momentum."
      actions={
        <>
          <Switch
            label={settings.enabled ? 'FocusTube on' : 'FocusTube off'}
            checked={settings.enabled}
            onChange={(event) => handleToggleEnabled(event.currentTarget.checked)}
            className="text-slate-200"
          />
          <Button variant="secondary" onClick={openPopupPreview}>
            Preview popup
          </Button>
          <Button variant={settings.enabled ? 'ghost' : 'primary'} onClick={() => handleToggleEnabled(!settings.enabled)} className="text-slate-200 hover:bg-slate-800">
            {settings.enabled ? 'Turn off' : 'Turn on'}
          </Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <FocusSessionCard settings={settings} analytics={analytics} onStartFocus={handleStartFocus} />
        <AnalyticsCard analytics={analytics} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ActiveRulesCard settings={settings} />
        <ChannelManagerCard channels={settings.blockedChannels} onAdd={addChannel} onRemove={removeChannel} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <CareerModeCard settings={settings} selectedTrack={careerTrack} onSelectTrack={handleSelectCareerTrack} />
        <WeeklyProgressCard analytics={analytics} />
      </div>

      {!hasActivity ? (
        <OnboardingCard
          hasKeywords={hasKeywords}
          hasChannels={hasChannels}
          hasFocusMode={hasFocusMode}
          onAddSampleKeyword={addSampleKeyword}
          onAddSampleChannel={addSampleChannel}
          onStartSession={handleStartFocus}
        />
      ) : null}

      {saved ? (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{saved}</div>
      ) : null}
    </DashboardLayout>
  )
}
