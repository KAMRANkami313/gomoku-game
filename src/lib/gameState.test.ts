import { describe, it, expect } from 'vitest'
import {
  serializeGame,
  deserializeGame,
  buildBoardFromMoves,
} from './gameState'
import { createEmptyBoard, BOARD_SIZE } from './types'
import type { MoveRecord } from './types'

describe('serializeGame / deserializeGame', () => {
  it('round-trips a game state', () => {
    const board = createEmptyBoard()
    board[7][7] = 1
    const moves: MoveRecord[] = [
      { row: 7, col: 7, player: 1, moveNumber: 1 },
    ]
    const raw = serializeGame(board, 'playing', 2, moves, 'ai', 'medium')
    const snapshot = deserializeGame(raw)
    expect(snapshot).not.toBeNull()
    expect(snapshot?.board[7][7]).toBe(1)
    expect(snapshot?.status).toBe('playing')
    expect(snapshot?.currentPlayer).toBe(2)
    expect(snapshot?.moves).toHaveLength(1)
    expect(snapshot?.mode).toBe('ai')
    expect(snapshot?.difficulty).toBe('medium')
  })

  it('returns null for invalid JSON', () => {
    expect(deserializeGame('not json')).toBeNull()
  })

  it('returns null for missing board', () => {
    expect(deserializeGame(JSON.stringify({ moves: [] }))).toBeNull()
  })

  it('returns null for missing moves', () => {
    expect(deserializeGame(JSON.stringify({ board: [] }))).toBeNull()
  })
})

describe('buildBoardFromMoves', () => {
  it('returns empty board for 0 moves', () => {
    const board = buildBoardFromMoves([], 0)
    expect(board.every((r) => r.every((c) => c === 0))).toBe(true)
  })

  it('builds board with moves up to index', () => {
    const moves: MoveRecord[] = [
      { row: 7, col: 7, player: 1, moveNumber: 1 },
      { row: 8, col: 8, player: 2, moveNumber: 2 },
      { row: 6, col: 6, player: 1, moveNumber: 3 },
    ]
    const board = buildBoardFromMoves(moves, 2)
    expect(board[7][7]).toBe(1)
    expect(board[8][8]).toBe(2)
    expect(board[6][6]).toBe(0)
  })

  it('handles index beyond moves length', () => {
    const moves: MoveRecord[] = [
      { row: 7, col: 7, player: 1, moveNumber: 1 },
    ]
    const board = buildBoardFromMoves(moves, 10)
    expect(board[7][7]).toBe(1)
  })

  it('returns a 15x15 board', () => {
    const board = buildBoardFromMoves([], 0)
    expect(board.length).toBe(BOARD_SIZE)
    expect(board[0].length).toBe(BOARD_SIZE)
  })
})