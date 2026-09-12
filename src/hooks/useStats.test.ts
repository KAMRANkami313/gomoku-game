import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStats } from './useStats'
import { EMPTY_STATS } from '../lib/stats'
import type { GameStatus } from '../lib/types'

describe('useStats', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('starts with empty stats', () => {
    const { result } = renderHook(() => useStats('playing', 0))
    expect(result.current.stats).toEqual(EMPTY_STATS)
  })

  it('records a win when status transitions to player_wins', () => {
    let status: GameStatus = 'playing'
    let moveCount = 0
    const { result, rerender } = renderHook(() => useStats(status, moveCount))

    act(() => {
      status = 'player_wins'
      moveCount = 9
      rerender()
    })

    expect(result.current.stats.totalGames).toBe(1)
    expect(result.current.stats.wins).toBe(1)
    expect(result.current.stats.currentWinStreak).toBe(1)
    expect(result.current.stats.totalMovesInWins).toBe(9)
  })

  it('records a loss when status transitions to ai_wins', () => {
    let status: GameStatus = 'playing'
    let moveCount = 0
    const { result, rerender } = renderHook(() => useStats(status, moveCount))

    act(() => {
      status = 'ai_wins'
      moveCount = 10
      rerender()
    })

    expect(result.current.stats.totalGames).toBe(1)
    expect(result.current.stats.losses).toBe(1)
    expect(result.current.stats.currentWinStreak).toBe(0)
  })

  it('records a draw when status transitions to draw', () => {
    let status: GameStatus = 'playing'
    let moveCount = 0
    const { result, rerender } = renderHook(() => useStats(status, moveCount))

    act(() => {
      status = 'draw'
      moveCount = 225
      rerender()
    })

    expect(result.current.stats.totalGames).toBe(1)
    expect(result.current.stats.draws).toBe(1)
  })

  it('does not record when status stays playing', () => {
    const status: GameStatus = 'playing'
    let moveCount = 0
    const { result, rerender } = renderHook(() => useStats(status, moveCount))

    act(() => {
      moveCount = 5
      rerender()
    })

    expect(result.current.stats).toEqual(EMPTY_STATS)
  })

  it('persists stats to localStorage', () => {
    let status: GameStatus = 'playing'
    let moveCount = 0
    const { rerender } = renderHook(() => useStats(status, moveCount))

    act(() => {
      status = 'player_wins'
      moveCount = 9
      rerender()
    })

    const stored = JSON.parse(localStorage.getItem('gomoku:stats') || 'null')
    expect(stored).not.toBeNull()
    expect(stored.wins).toBe(1)
  })

  it('loads persisted stats on init', () => {
    const saved = { ...EMPTY_STATS, wins: 5, totalGames: 8 }
    localStorage.setItem('gomoku:stats', JSON.stringify(saved))

    const { result } = renderHook(() => useStats('playing', 0))
    expect(result.current.stats.wins).toBe(5)
    expect(result.current.stats.totalGames).toBe(8)
  })

  it('resets stats to empty', () => {
    let status: GameStatus = 'playing'
    let moveCount = 0
    const { result, rerender } = renderHook(() => useStats(status, moveCount))

    act(() => {
      status = 'player_wins'
      moveCount = 9
      rerender()
    })

    expect(result.current.stats.wins).toBe(1)

    act(() => {
      result.current.reset()
    })

    expect(result.current.stats).toEqual(EMPTY_STATS)
    const stored = JSON.parse(localStorage.getItem('gomoku:stats') || 'null')
    expect(stored).toEqual(EMPTY_STATS)
  })

  it('tracks streak across multiple games', () => {
    let status: GameStatus = 'playing'
    let moveCount = 0
    const { result, rerender } = renderHook(() => useStats(status, moveCount))

    act(() => {
      status = 'player_wins'
      moveCount = 9
      rerender()
    })
    expect(result.current.stats.currentWinStreak).toBe(1)

    act(() => {
      status = 'playing'
      rerender()
    })

    act(() => {
      status = 'player_wins'
      moveCount = 11
      rerender()
    })
    expect(result.current.stats.currentWinStreak).toBe(2)
    expect(result.current.stats.wins).toBe(2)
    expect(result.current.stats.totalGames).toBe(2)
  })
})