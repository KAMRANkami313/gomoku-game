import { describe, it, expect } from 'vitest'
import { createEmptyBoard, BOARD_SIZE } from './types'
import {
  chooseAIMove,
  findWinningMove,
  findOpponentWinningMove,
  evaluateBoard,
} from './ai'

describe('findWinningMove', () => {
  it('finds a horizontal winning move', () => {
    const board = createEmptyBoard()
    for (let c = 0; c < 4; c++) board[7][c] = 2
    const move = findWinningMove(board, 2)
    expect(move).not.toBeNull()
    expect(move?.row).toBe(7)
    expect(move?.col).toBe(4)
  })

  it('finds a vertical winning move', () => {
    const board = createEmptyBoard()
    for (let r = 0; r < 4; r++) board[r][7] = 1
    const move = findWinningMove(board, 1)
    expect(move).not.toBeNull()
    expect(move?.col).toBe(7)
    expect(move?.row).toBe(4)
  })

  it('finds a diagonal winning move', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 4; i++) board[i][i] = 2
    const move = findWinningMove(board, 2)
    expect(move).not.toBeNull()
    expect(move?.row).toBe(4)
    expect(move?.col).toBe(4)
  })

  it('returns null when no winning move exists', () => {
    const board = createEmptyBoard()
    board[7][7] = 1
    expect(findWinningMove(board, 1)).toBeNull()
  })
})

describe('findOpponentWinningMove', () => {
  it('finds the opponent winning move to block', () => {
    const board = createEmptyBoard()
    for (let c = 5; c < 9; c++) board[7][c] = 1
    const move = findOpponentWinningMove(board, 2)
    expect(move).not.toBeNull()
    expect([4, 9]).toContain(move?.col)
  })
})

describe('chooseAIMove', () => {
  it('plays center on empty board', () => {
    const board = createEmptyBoard()
    const move = chooseAIMove(board, 2, 'medium')
    expect(move.row).toBe(7)
    expect(move.col).toBe(7)
  })

  it('takes an immediate win (medium)', () => {
    const board = createEmptyBoard()
    for (let c = 5; c < 9; c++) board[7][c] = 2
    const move = chooseAIMove(board, 2, 'medium')
    expect([4, 9]).toContain(move.col)
  })

  it('takes an immediate win (hard)', () => {
    const board = createEmptyBoard()
    for (let c = 5; c < 9; c++) board[7][c] = 2
    const move = chooseAIMove(board, 2, 'hard')
    expect([4, 9]).toContain(move.col)
  })

  it('blocks opponent immediate win (medium)', () => {
    const board = createEmptyBoard()
    for (let c = 5; c < 9; c++) board[7][c] = 1
    const move = chooseAIMove(board, 2, 'medium')
    expect([4, 9]).toContain(move.col)
  })

  it('blocks opponent immediate win (hard)', () => {
    const board = createEmptyBoard()
    for (let c = 5; c < 9; c++) board[7][c] = 1
    const move = chooseAIMove(board, 2, 'hard')
    expect([4, 9]).toContain(move.col)
  })

  it('blocks opponent open three (medium)', () => {
    const board = createEmptyBoard()
    board[7][5] = 1
    board[7][6] = 1
    board[7][7] = 1
    const move = chooseAIMove(board, 2, 'medium')
    expect([4, 8]).toContain(move.col)
    expect(move.row).toBe(7)
  })

  it('blocks opponent open three (hard)', () => {
    const board = createEmptyBoard()
    board[7][5] = 1
    board[7][6] = 1
    board[7][7] = 1
    const move = chooseAIMove(board, 2, 'hard')
    expect([4, 8]).toContain(move.col)
    expect(move.row).toBe(7)
  })

  it('returns a legal move at each difficulty', () => {
    const board = createEmptyBoard()
    board[7][7] = 1
    board[8][8] = 2
    const difficulties = ['easy', 'medium', 'hard'] as const
    for (const d of difficulties) {
      const move = chooseAIMove(board, 2, d)
      expect(move.row).toBeGreaterThanOrEqual(0)
      expect(move.row).toBeLessThan(BOARD_SIZE)
      expect(move.col).toBeGreaterThanOrEqual(0)
      expect(move.col).toBeLessThan(BOARD_SIZE)
      expect(board[move.row][move.col]).toBe(0)
    }
  })
})

describe('evaluateBoard', () => {
  it('returns 0 on empty board', () => {
    const board = createEmptyBoard()
    expect(evaluateBoard(board, 2)).toBe(0)
  })

  it('returns positive score when AI has open three', () => {
    const board = createEmptyBoard()
    board[7][5] = 2
    board[7][6] = 2
    board[7][7] = 2
    expect(evaluateBoard(board, 2)).toBeGreaterThan(0)
  })

  it('returns negative score when player has open three', () => {
    const board = createEmptyBoard()
    board[7][5] = 1
    board[7][6] = 1
    board[7][7] = 1
    expect(evaluateBoard(board, 2)).toBeLessThan(0)
  })

  it('returns large positive score when AI has open four', () => {
    const board = createEmptyBoard()
    board[7][5] = 2
    board[7][6] = 2
    board[7][7] = 2
    board[7][8] = 2
    expect(evaluateBoard(board, 2)).toBeGreaterThan(100000)
  })
})