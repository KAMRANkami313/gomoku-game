import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGamePersistence } from './useGamePersistence'
import { createEmptyBoard } from '../lib/types'
import type { GameSnapshot } from '../lib/gameState'

const baseSnapshot: GameSnapshot = {
  board: (() => {
    const b = createEmptyBoard()
    b[7][7] = 1
    return b
  })(),
  status: 'playing',
  currentPlayer: 2,
  moves: [{ row: 7, col: 7, player: 1, moveNumber: 1 }],
  mode: 'ai',
  difficulty: 'medium',
}

describe('useGamePersistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('saves game state to localStorage when moves exist', () => {
    const onRestore = vi.fn()
    const { rerender } = renderHook(() =>
      useGamePersistence(
        baseSnapshot.board,
        'playing',
        2,
        baseSnapshot.moves,
        'ai',
        'medium',
        onRestore,
      ),
    )
    rerender()
    const stored = localStorage.getItem('gomoku:game-state')
    expect(stored).not.toBeNull()
  })

  it('clears localStorage when game is empty', () => {
    const onRestore = vi.fn()
    const { rerender } = renderHook(() =>
      useGamePersistence(
        createEmptyBoard(),
        'playing',
        1,
        [],
        'ai',
        'medium',
        onRestore,
      ),
    )
    rerender()
    expect(localStorage.getItem('gomoku:game-state')).toBeNull()
  })

  it('restores from localStorage on mount', () => {
    const stored = JSON.stringify({
      ...baseSnapshot,
      version: 1,
    })
    localStorage.setItem('gomoku:game-state', JSON.stringify(stored))

    const onRestore = vi.fn()
    renderHook(() =>
      useGamePersistence(
        createEmptyBoard(),
        'playing',
        1,
        [],
        'ai',
        'medium',
        onRestore,
      ),
    )

    expect(onRestore).toHaveBeenCalled()
  })

  it('does not restore when localStorage is empty', () => {
    const onRestore = vi.fn()
    renderHook(() =>
      useGamePersistence(
        createEmptyBoard(),
        'playing',
        1,
        [],
        'ai',
        'medium',
        onRestore,
      ),
    )
    expect(onRestore).not.toHaveBeenCalled()
  })
})