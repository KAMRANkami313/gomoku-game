import { describe, it, expect } from 'vitest'
import {
  generateRoomCode,
  getPeerId,
  isValidRoomCode,
  createMoveMessage,
  createRestartMessage,
  createBoardSizeMessage,
  createSyncMessage,
  parseMessage,
} from './online'
import { createEmptyBoard } from './types'

describe('generateRoomCode', () => {
  it('generates a 6-character code', () => {
    const code = generateRoomCode()
    expect(code.length).toBe(6)
  })

  it('generates uppercase alphanumeric', () => {
    const code = generateRoomCode()
    expect(/^[A-Z0-9]{6}$/.test(code)).toBe(true)
  })

  it('generates different codes on subsequent calls', () => {
    const codes = new Set<string>()
    for (let i = 0; i < 100; i++) {
      codes.add(generateRoomCode())
    }
    expect(codes.size).toBeGreaterThan(90)
  })
})

describe('getPeerId', () => {
  it('prefixes the room code with gomoku-', () => {
    expect(getPeerId('ABC123')).toBe('gomoku-ABC123')
  })

  it('uppercases the room code', () => {
    expect(getPeerId('abc123')).toBe('gomoku-ABC123')
  })
})

describe('isValidRoomCode', () => {
  it('accepts a valid 6-character alphanumeric code', () => {
    expect(isValidRoomCode('ABC123')).toBe(true)
  })

  it('accepts lowercase', () => {
    expect(isValidRoomCode('abc123')).toBe(true)
  })

  it('rejects too short', () => {
    expect(isValidRoomCode('ABC12')).toBe(false)
  })

  it('rejects too long', () => {
    expect(isValidRoomCode('ABC1234')).toBe(false)
  })

  it('rejects special characters', () => {
    expect(isValidRoomCode('AB-123')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidRoomCode('')).toBe(false)
  })
})

describe('message factories', () => {
  it('creates a move message', () => {
    const msg = createMoveMessage(7, 7, 1)
    expect(msg).toEqual({ type: 'move', row: 7, col: 7, player: 1 })
  })

  it('creates a restart message', () => {
    const msg = createRestartMessage()
    expect(msg).toEqual({ type: 'restart' })
  })

  it('creates a board_size message', () => {
    const msg = createBoardSizeMessage(9)
    expect(msg).toEqual({ type: 'board_size', size: 9 })
  })

  it('creates a sync message', () => {
    const board = createEmptyBoard()
    const msg = createSyncMessage(board, [], 1, 'playing', 15)
    expect(msg).toEqual({
      type: 'sync',
      board,
      moves: [],
      currentPlayer: 1,
      status: 'playing',
      boardSize: 15,
    })
  })
})

describe('parseMessage', () => {
  it('parses a valid move message', () => {
    const raw = JSON.stringify({ type: 'move', row: 7, col: 7, player: 1 })
    const msg = parseMessage(raw)
    expect(msg).toEqual({ type: 'move', row: 7, col: 7, player: 1 })
  })

  it('parses a valid restart message', () => {
    const raw = JSON.stringify({ type: 'restart' })
    const msg = parseMessage(raw)
    expect(msg).toEqual({ type: 'restart' })
  })

  it('returns null for invalid JSON', () => {
    expect(parseMessage('not json')).toBeNull()
  })

  it('returns null for missing type', () => {
    expect(parseMessage(JSON.stringify({ row: 7, col: 7 }))).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseMessage('')).toBeNull()
  })
})