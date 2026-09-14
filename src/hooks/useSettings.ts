import { useCallback, useState } from 'react'
import { loadState, saveState } from '../lib/storage'
import { BOARD_SIZES } from '../lib/types'

export interface Settings {
  boardSize: number
  animationsEnabled: boolean
}

const DEFAULT_SETTINGS: Settings = {
  boardSize: 15,
  animationsEnabled: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    loadState<Settings>('settings', DEFAULT_SETTINGS),
  )

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value }
        saveState('settings', next)
        return next
      })
    },
    [],
  )

  const setBoardSize = useCallback(
    (size: number) => {
      if (!BOARD_SIZES.includes(size as typeof BOARD_SIZES[number])) return
      updateSetting('boardSize', size)
    },
    [updateSetting],
  )

  const setAnimationsEnabled = useCallback(
    (enabled: boolean) => updateSetting('animationsEnabled', enabled),
    [updateSetting],
  )

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    saveState('settings', DEFAULT_SETTINGS)
  }, [])

  return {
    settings,
    setBoardSize,
    setAnimationsEnabled,
    reset,
  }
}