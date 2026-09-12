import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    document.documentElement.classList.remove('dark')

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.useRealTimers()
    window.matchMedia = originalMatchMedia
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to system mode', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.mode).toBe('system')
  })

  it('toggles light -> dark -> system -> light', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.mode).toBe('system')

    act(() => result.current.toggle())
    expect(result.current.mode).toBe('light')

    act(() => result.current.toggle())
    expect(result.current.mode).toBe('dark')

    act(() => result.current.toggle())
    expect(result.current.mode).toBe('system')
  })

  it('applies dark class to documentElement when mode is dark', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setMode('dark'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when mode is light', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setMode('dark'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    act(() => result.current.setMode('light'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists mode to localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => result.current.setMode('dark'))
    expect(JSON.parse(localStorage.getItem('gomoku:theme') || '""')).toBe('dark')

    act(() => result.current.setMode('light'))
    expect(JSON.parse(localStorage.getItem('gomoku:theme') || '""')).toBe('light')
  })

  it('loads persisted mode from localStorage on init', () => {
    localStorage.setItem('gomoku:theme', JSON.stringify('dark'))
    const { result } = renderHook(() => useTheme())
    expect(result.current.mode).toBe('dark')
  })
})