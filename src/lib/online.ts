import type { Board, GameStatus, MoveRecord, Player } from './types'

export type OnlineMessage =
  | { type: 'move'; row: number; col: number; player: Player }
  | { type: 'undo' }
  | { type: 'restart' }
  | { type: 'board_size'; size: number }
  | {
      type: 'sync'
      board: Board
      moves: MoveRecord[]
      currentPlayer: Player
      status: GameStatus
      boardSize: number
    }

export type ConnectionStatus =
  | 'idle'
  | 'hosting'
  | 'joining'
  | 'connected'
  | 'disconnected'
  | 'error'

const ROOM_PREFIX = 'gomoku-'
const ROOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const ROOM_LENGTH = 6

export function generateRoomCode(): string {
  let code = ''
  for (let i = 0; i < ROOM_LENGTH; i++) {
    code += ROOM_CHARS.charAt(Math.floor(Math.random() * ROOM_CHARS.length))
  }
  return code
}

export function getPeerId(roomCode: string): string {
  return ROOM_PREFIX + roomCode.toUpperCase()
}

export function isValidRoomCode(code: string): boolean {
  if (code.length !== ROOM_LENGTH) return false
  const upper = code.toUpperCase()
  for (let i = 0; i < upper.length; i++) {
    if (!ROOM_CHARS.includes(upper[i])) return false
  }
  return true
}

export function createMoveMessage(
  row: number,
  col: number,
  player: Player,
): OnlineMessage {
  return { type: 'move', row, col, player }
}

export function createRestartMessage(): OnlineMessage {
  return { type: 'restart' }
}

export function createUndoMessage(): OnlineMessage {
  return { type: 'undo' }
}

export function createBoardSizeMessage(size: number): OnlineMessage {
  return { type: 'board_size', size }
}

export function createSyncMessage(
  board: Board,
  moves: MoveRecord[],
  currentPlayer: Player,
  status: GameStatus,
  boardSize: number,
): OnlineMessage {
  return {
    type: 'sync',
    board,
    moves,
    currentPlayer,
    status,
    boardSize,
  }
}

export function parseMessage(raw: string): OnlineMessage | null {
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.type !== 'string') return null
    return parsed as OnlineMessage
  } catch {
    return null
  }
}