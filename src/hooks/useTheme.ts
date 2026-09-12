import { useCallback, useEffect, useState } from 'react'
import { loadState, saveState } from '../lib/storage'

export type ThemeMode = 'light' | 'dark' | 'system'
type EffectiveTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getEffectiveTheme(mode: ThemeMode): EffectiveTheme {
  return mode === 'system' ? getSystemTheme() : mode
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    loadState<ThemeMode>(STORAGE_KEY, 'system'),
  )

  const effectiveTheme = getEffectiveTheme(mode)

  useEffect(() => {
    const root = document.documentElement
    if (effectiveTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    saveState(STORAGE_KEY, mode)
  }, [mode, effectiveTheme])

  useEffect(() => {
    if (mode !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const root = document.documentElement
      if (getSystemTheme() === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
  }, [])

  const toggle = useCallback(() => {
    setModeState((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }, [])

  return { mode, effectiveTheme, setMode, toggle }
}