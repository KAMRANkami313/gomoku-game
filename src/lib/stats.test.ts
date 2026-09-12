import { describe, it, expect } from 'vitest'
import {
  EMPTY_STATS,
  recordResult,
  getAverageMovesPerWin,
  getWinRate,
} from './stats'

describe('recordResult', () => {
  it('records a win', () => {
    const next = recordResult(EMPTY_STATS, 'win', 9)
    expect(next.totalGames).toBe(1)
    expect(next.wins).toBe(1)
    expect(next.losses).toBe(0)
    expect(next.draws).toBe(0)
    expect(next.currentWinStreak).toBe(1)
    expect(next.bestWinStreak).toBe(1)
    expect(next.totalMovesInWins).toBe(9)
  })

  it('records a loss', () => {
    const next = recordResult(EMPTY_STATS, 'loss', 10)
    expect(next.totalGames).toBe(1)
    expect(next.wins).toBe(0)
    expect(next.losses).toBe(1)
    expect(next.currentWinStreak).toBe(0)
    expect(next.bestWinStreak).toBe(0)
    expect(next.totalMovesInWins).toBe(0)
  })

  it('records a draw', () => {
    const next = recordResult(EMPTY_STATS, 'draw', 225)
    expect(next.totalGames).toBe(1)
    expect(next.draws).toBe(1)
    expect(next.currentWinStreak).toBe(0)
    expect(next.totalMovesInWins).toBe(0)
  })

  it('increments streak on consecutive wins', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    expect(stats.currentWinStreak).toBe(1)
    stats = recordResult(stats, 'win', 11)
    expect(stats.currentWinStreak).toBe(2)
    stats = recordResult(stats, 'win', 7)
    expect(stats.currentWinStreak).toBe(3)
    expect(stats.bestWinStreak).toBe(3)
  })

  it('resets streak on loss', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'win', 11)
    expect(stats.currentWinStreak).toBe(2)
    stats = recordResult(stats, 'loss', 10)
    expect(stats.currentWinStreak).toBe(0)
    expect(stats.bestWinStreak).toBe(2)
  })

  it('resets streak on draw', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'draw', 225)
    expect(stats.currentWinStreak).toBe(0)
  })

  it('preserves best streak across losses', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'win', 11)
    stats = recordResult(stats, 'win', 7)
    stats = recordResult(stats, 'loss', 10)
    expect(stats.bestWinStreak).toBe(3)
    stats = recordResult(stats, 'win', 9)
    expect(stats.bestWinStreak).toBe(3)
    expect(stats.currentWinStreak).toBe(1)
  })

  it('accumulates total moves in wins', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'win', 11)
    stats = recordResult(stats, 'win', 7)
    expect(stats.totalMovesInWins).toBe(27)
  })

  it('does not modify original stats (immutability)', () => {
    const original = { ...EMPTY_STATS }
    recordResult(EMPTY_STATS, 'win', 9)
    expect(EMPTY_STATS).toEqual(original)
  })
})

describe('getAverageMovesPerWin', () => {
  it('returns 0 when no wins', () => {
    expect(getAverageMovesPerWin(EMPTY_STATS)).toBe(0)
  })

  it('returns average moves across wins', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'win', 11)
    expect(getAverageMovesPerWin(stats)).toBe(10)
  })

  it('rounds to nearest integer', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'win', 10)
    stats = recordResult(stats, 'win', 11)
    expect(getAverageMovesPerWin(stats)).toBe(10)
  })
})

describe('getWinRate', () => {
  it('returns 0 when no games', () => {
    expect(getWinRate(EMPTY_STATS)).toBe(0)
  })

  it('returns percentage of wins', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'loss', 10)
    stats = recordResult(stats, 'win', 11)
    expect(getWinRate(stats)).toBe(67)
  })

  it('returns 100 when all wins', () => {
    let stats = EMPTY_STATS
    stats = recordResult(stats, 'win', 9)
    stats = recordResult(stats, 'win', 11)
    expect(getWinRate(stats)).toBe(100)
  })
})