import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSettings } from './useSettings'

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('starts with default settings', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.boardSize).toBe(15)
    expect(result.current.settings.animationsEnabled).toBe(true)
  })

  it('changes board size', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.setBoardSize(9))
    expect(result.current.settings.boardSize).toBe(9)
  })

  it('rejects invalid board size', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.setBoardSize(10))
    expect(result.current.settings.boardSize).toBe(15)
  })

  it('toggles animations', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.setAnimationsEnabled(false))
    expect(result.current.settings.animationsEnabled).toBe(false)
  })

  it('persists settings to localStorage', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.setBoardSize(13))
    const stored = JSON.parse(localStorage.getItem('gomoku:settings') || '{}')
    expect(stored.boardSize).toBe(13)
  })

  it('loads persisted settings on init', () => {
    localStorage.setItem(
      'gomoku:settings',
      JSON.stringify({ boardSize: 9, animationsEnabled: false }),
    )
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.boardSize).toBe(9)
    expect(result.current.settings.animationsEnabled).toBe(false)
  })

  it('resets to defaults', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.setBoardSize(9))
    act(() => result.current.reset())
    expect(result.current.settings.boardSize).toBe(15)
    expect(result.current.settings.animationsEnabled).toBe(true)
  })
})