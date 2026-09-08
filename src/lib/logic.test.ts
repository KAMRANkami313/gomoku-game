import { describe, it, expect } from 'vitest'
import { createEmptyBoard, BOARD_SIZE } from './types'
import {
  isLegalMove,
  applyMove,
  detectWin,
  getGameStatus,
  getCandidateMoves,
} from './logic'

describe('createEmptyBoard', () => {
  it('creates a 15x15 board of zeros', () => {
    const board = createEmptyBoard()
    expect(board.length).toBe(BOARD_SIZE)
    expect(board[0].length).toBe(BOARD_SIZE)
    expect(board.every((row) => row.every((cell) => cell === 0))).toBe(true)
  })
})

describe('isLegalMove', () => {
  it('accepts an empty cell within bounds', () => {
    const board = createEmptyBoard()
    expect(isLegalMove(board, 7, 7)).toBe(true)
  })

  it('rejects an occupied cell', () => {
    const board = createEmptyBoard()
    board[0][0] = 1
    expect(isLegalMove(board, 0, 0)).toBe(false)
  })

  it('rejects out-of-bounds cells', () => {
    const board = createEmptyBoard()
    expect(isLegalMove(board, -1, 0)).toBe(false)
    expect(isLegalMove(board, 0, 15)).toBe(false)
    expect(isLegalMove(board, 99, 99)).toBe(false)
  })
})

describe('applyMove', () => {
  it('places a stone and returns a new board', () => {
    const board = createEmptyBoard()
    const next = applyMove(board, 5, 5, 1)
    expect(next[5][5]).toBe(1)
    expect(board[5][5]).toBe(0)
  })
})

describe('detectWin', () => {
  it('detects horizontal five-in-a-row', () => {
    const board = createEmptyBoard()
    for (let c = 0; c < 5; c++) board[7][c] = 1
    const win = detectWin(board, 7, 4)
    expect(win).not.toBeNull()
    expect(win?.length).toBe(5)
  })

  it('detects vertical five-in-a-row', () => {
    const board = createEmptyBoard()
    for (let r = 0; r < 5; r++) board[r][7] = 2
    const win = detectWin(board, 4, 7)
    expect(win).not.toBeNull()
    expect(win?.length).toBe(5)
  })

  it('detects diagonal down-right five-in-a-row', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 5; i++) board[i][i] = 1
    const win = detectWin(board, 2, 2)
    expect(win).not.toBeNull()
    expect(win?.length).toBe(5)
  })

  it('detects diagonal down-left five-in-a-row', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 5; i++) board[i][14 - i] = 1
    const win = detectWin(board, 2, 12)
    expect(win).not.toBeNull()
    expect(win?.length).toBe(5)
  })

  it('returns null for only four in a row', () => {
    const board = createEmptyBoard()
    for (let c = 0; c < 4; c++) board[7][c] = 1
    expect(detectWin(board, 7, 3)).toBeNull()
  })

  it('returns null on an empty cell', () => {
    const board = createEmptyBoard()
    expect(detectWin(board, 7, 7)).toBeNull()
  })

  it('returns exactly 5 stones even if run is longer', () => {
    const board = createEmptyBoard()
    for (let c = 0; c < 6; c++) board[7][c] = 1
    const win = detectWin(board, 7, 3)
    expect(win).not.toBeNull()
    expect(win?.length).toBe(5)
  })
})

describe('getGameStatus', () => {
  it('returns playing when no win and board not full', () => {
    const board = createEmptyBoard()
    expect(getGameStatus(board, null, 0)).toBe('playing')
  })

  it('returns player_wins when black has five', () => {
    const board = createEmptyBoard()
    for (let c = 0; c < 5; c++) board[7][c] = 1
    expect(getGameStatus(board, { row: 7, col: 4 }, 5)).toBe('player_wins')
  })

  it('returns ai_wins when white has five', () => {
    const board = createEmptyBoard()
    for (let r = 0; r < 5; r++) board[r][0] = 2
    expect(getGameStatus(board, { row: 4, col: 0 }, 5)).toBe('ai_wins')
  })

  it('returns draw when board is full with no winner', () => {
    const board = createEmptyBoard()
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        board[r][c] = ((Math.floor(c / 2) + r) % 2) + 1
      }
    }
    expect(
      getGameStatus(board, { row: 0, col: 0 }, BOARD_SIZE * BOARD_SIZE),
    ).toBe('draw')
  })
})

describe('getCandidateMoves', () => {
  it('returns center when board is empty', () => {
    const board = createEmptyBoard()
    const moves = getCandidateMoves(board)
    expect(moves.length).toBe(1)
    expect(moves[0].row).toBe(7)
    expect(moves[0].col).toBe(7)
  })

  it('returns only empty cells near existing stones', () => {
    const board = createEmptyBoard()
    board[7][7] = 1
    const moves = getCandidateMoves(board, 1)
    expect(moves.length).toBe(8)
    moves.forEach((m) => {
      const dr = Math.abs(m.row - 7)
      const dc = Math.abs(m.col - 7)
      expect(dr <= 1 && dc <= 1).toBe(true)
    })
  })

  it('never returns occupied cells', () => {
    const board = createEmptyBoard()
    board[7][7] = 1
    const moves = getCandidateMoves(board, 2)
    expect(moves.find((m) => m.row === 7 && m.col === 7)).toBeUndefined()
  })
})