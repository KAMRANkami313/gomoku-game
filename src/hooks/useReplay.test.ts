import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReplay } from './useReplay'
import type { MoveRecord } from '../lib/types'

const moves: MoveRecord[] = [
  { row: 7, col: 7, player: 1, moveNumber: 1 },
  { row: 8, col: 8, player: 2, moveNumber: 2 },
  { row: 6, col: 6, player: 1, moveNumber: 3 },
]

describe('useReplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts inactive', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    expect(result.current.active).toBe(false)
  })

  it('enters replay mode when game is complete', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    expect(result.current.active).toBe(true)
    expect(result.current.step).toBe(3)
  })

  it('does not enter when game is not complete', () => {
    const { result } = renderHook(() => useReplay(moves, false))
    act(() => result.current.enter())
    expect(result.current.active).toBe(false)
  })

  it('navigates to previous step', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goPrev())
    expect(result.current.step).toBe(2)
  })

  it('navigates to next step', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goToStart())
    act(() => result.current.goNext())
    expect(result.current.step).toBe(1)
  })

  it('navigates to start', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goToStart())
    expect(result.current.step).toBe(0)
  })

  it('navigates to end', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goToStart())
    act(() => result.current.goToEnd())
    expect(result.current.step).toBe(3)
  })

  it('does not go below 0', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goToStart())
    act(() => result.current.goPrev())
    expect(result.current.step).toBe(0)
  })

  it('does not exceed total steps', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goNext())
    act(() => result.current.goNext())
    expect(result.current.step).toBe(3)
  })

  it('auto-advances when playing', async () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goToStart())
    act(() => result.current.togglePlay())
    expect(result.current.playing).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(600)
    })
    expect(result.current.step).toBe(1)

    await act(async () => {
      vi.advanceTimersByTime(600)
    })
    expect(result.current.step).toBe(2)
  })

  it('stops playing at the end', async () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.goToStart())
    act(() => result.current.togglePlay())

    await act(async () => {
      vi.advanceTimersByTime(600)
    })
    await act(async () => {
      vi.advanceTimersByTime(600)
    })
    await act(async () => {
      vi.advanceTimersByTime(600)
    })
    expect(result.current.playing).toBe(false)
    expect(result.current.step).toBe(3)
  })

  it('exits replay mode', () => {
    const { result } = renderHook(() => useReplay(moves, true))
    act(() => result.current.enter())
    act(() => result.current.exit())
    expect(result.current.active).toBe(false)
  })
})