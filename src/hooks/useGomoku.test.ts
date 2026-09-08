import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGomoku } from './useGomoku'
import { BOARD_SIZE, createEmptyBoard } from '../lib/types'

describe('useGomoku — initial state', () => {
  it('starts with an empty board', () => {
    const { result } = renderHook(() => useGomoku())
    expect(result.current.board).toEqual(createEmptyBoard())
  })

  it('starts in playing status', () => {
    const { result } = renderHook(() => useGomoku())
    expect(result.current.status).toBe('playing')
  })

  it('starts with human (player 1) as current player', () => {
    const { result } = renderHook(() => useGomoku())
    expect(result.current.currentPlayer).toBe(1)
  })

  it('starts with 0 moves', () => {
    const { result } = renderHook(() => useGomoku())
    expect(result.current.moveCount).toBe(0)
  })

  it('starts with medium difficulty', () => {
    const { result } = renderHook(() => useGomoku())
    expect(result.current.difficulty).toBe('medium')
  })

  it('is not thinking initially', () => {
    const { result } = renderHook(() => useGomoku())
    expect(result.current.isAiThinking).toBe(false)
  })

  it('starts with all scores at 0', () => {
    const { result } = renderHook(() => useGomoku())
    expect(result.current.playerScore).toBe(0)
    expect(result.current.aiScore).toBe(0)
    expect(result.current.drawScore).toBe(0)
  })
})

describe('useGomoku — playMove', () => {
  it('places a black stone on the board', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    expect(result.current.board[7][7]).toBe(1)
    expect(result.current.moveCount).toBe(1)
  })

  it('switches turn to AI after human move', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    expect(result.current.currentPlayer).toBe(2)
    expect(result.current.isAiThinking).toBe(true)
  })

  it('records the move in history', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    expect(result.current.moves).toHaveLength(1)
    expect(result.current.moves[0]).toEqual({
      row: 7,
      col: 7,
      player: 1,
      moveNumber: 1,
    })
  })

  it('ignores moves on occupied cells', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    const countBefore = result.current.moveCount
    act(() => {
      result.current.playMove(7, 7)
    })
    expect(result.current.moveCount).toBe(countBefore)
  })

  it('ignores moves while AI is thinking', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    const countBefore = result.current.moveCount
    act(() => {
      result.current.playMove(0, 0)
    })
    expect(result.current.moveCount).toBe(countBefore)
  })
})

describe('useGomoku — AI response', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('AI responds after human move and switches turn back', async () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.moveCount).toBe(2)
    expect(result.current.currentPlayer).toBe(1)
    expect(result.current.isAiThinking).toBe(false)
  })

  it('AI places exactly one white stone on the board', async () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    let whiteCount = 0
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (result.current.board[r][c] === 2) whiteCount++
      }
    }
    expect(whiteCount).toBe(1)
  })

  it('AI move is recorded in move history as player 2', async () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.moves).toHaveLength(2)
    expect(result.current.moves[1].player).toBe(2)
    expect(result.current.moves[1].moveNumber).toBe(2)
  })
})

describe('useGomoku — undo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('undoes the last move pair (human + AI)', async () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.moveCount).toBe(2)
    act(() => {
      result.current.undo()
    })
    expect(result.current.moveCount).toBe(0)
    expect(result.current.board[7][7]).toBe(0)
    expect(result.current.currentPlayer).toBe(1)
  })

  it('does nothing when no moves exist', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.undo()
    })
    expect(result.current.moveCount).toBe(0)
    expect(result.current.status).toBe('playing')
  })
})

describe('useGomoku — restart', () => {
  it('resets board, moves, and status but keeps scores', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.playMove(7, 7)
    })
    act(() => {
      result.current.restart()
    })
    expect(result.current.board).toEqual(createEmptyBoard())
    expect(result.current.moveCount).toBe(0)
    expect(result.current.status).toBe('playing')
    expect(result.current.currentPlayer).toBe(1)
    expect(result.current.lastMove).toBeNull()
    expect(result.current.winningLine).toBeNull()
  })
})

describe('useGomoku — setDifficulty', () => {
  it('changes the difficulty level', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.setDifficulty('hard')
    })
    expect(result.current.difficulty).toBe('hard')
  })

  it('changes difficulty to easy', () => {
    const { result } = renderHook(() => useGomoku())
    act(() => {
      result.current.setDifficulty('easy')
    })
    expect(result.current.difficulty).toBe('easy')
  })
})