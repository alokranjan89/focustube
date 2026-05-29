import { useEffect, useState } from 'react'
import type { FocusTubeSettings } from '../types'

export function useTheme(settings: FocusTubeSettings) {
  const [theme, setTheme] = useState<FocusTubeSettings['theme']>(settings.theme)

  useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme])

  useEffect(() => {
    const classList = document.documentElement.classList
    classList.toggle('dark', theme === 'dark')
    classList.toggle('light', theme === 'light')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return {
    theme,
    setTheme
  }
}
