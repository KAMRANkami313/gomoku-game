import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSound } from './useSound'

vi.mock('../lib/sound', () => ({
  playSound: vi.fn(),
  unlockAudio: vi.fn(),
}))

import { playSound, unlockAudio } from '../lib/sound'

describe('useSound', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('starts with sound enabled by default', () => {
    const { result } = renderHook(() => useSound())
    expect(result.current.enabled).toBe(true)
  })

  it('disables sound on toggle', () => {
    const { result } = renderHook(() => useSound())
    act(() => {
      result.current.toggle()
    })
    expect(result.current.enabled).toBe(false)
  })

  it('re-enables sound on second toggle', () => {
    const { result } = renderHook(() => useSound())
    act(() => result.current.toggle())
    act(() => result.current.toggle())
    expect(result.current.enabled).toBe(true)
  })

  it('persists enabled state to localStorage', () => {
    const { result } = renderHook(() => useSound())
    act(() => result.current.toggle())
    expect(JSON.parse(localStorage.getItem('gomoku:sound-enabled') || 'true')).toBe(false)
  })

  it('loads persisted state from localStorage', () => {
    localStorage.setItem('gomoku:sound-enabled', JSON.stringify(false))
    const { result } = renderHook(() => useSound())
    expect(result.current.enabled).toBe(false)
  })

  it('calls playSound when enabled', () => {
    const { result } = renderHook(() => useSound())
    act(() => result.current.play('place'))
    expect(playSound).toHaveBeenCalledWith('place')
  })

  it('does not call playSound when disabled', () => {
    const { result } = renderHook(() => useSound())
    act(() => result.current.toggle())
    act(() => result.current.play('place'))
    expect(playSound).not.toHaveBeenCalled()
  })

  it('calls unlockAudio when re-enabling', () => {
    const { result } = renderHook(() => useSound())
    act(() => result.current.toggle())
    act(() => result.current.toggle())
    expect(unlockAudio).toHaveBeenCalled()
  })
})