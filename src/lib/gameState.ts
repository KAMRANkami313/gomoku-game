import { createEmptyBoard } from './types'
import type { Board, GameMode, GameStatus, MoveRecord, Player } from './types'

export interface GameSnapshot {
  board: Board
  status: GameStatus
  currentPlayer: Player
  moves: MoveRecord[]
  mode: GameMode
  difficulty: string
}

export function serializeGame(
  board: Board,
  status: GameStatus,
  currentPlayer: Player,
  moves: MoveRecord[],
  mode: GameMode,
  difficulty: string,
): string {
  return JSON.stringify({
    board,
    status,
    currentPlayer,
    moves,
    mode,
    difficulty,
    version: 1,
  })
}

export function deserializeGame(raw: string): GameSnapshot | null {
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.board) || !Array.isArray(parsed.moves)) {
      return null
    }
    return {
      board: parsed.board,
      status: parsed.status,
      currentPlayer: parsed.currentPlayer,
      moves: parsed.moves,
      mode: parsed.mode,
      difficulty: parsed.difficulty,
    }
  } catch {
    return null
  }
}

export function buildBoardFromMoves(
  moves: MoveRecord[],
  upToIndex: number,
  boardSize: number = 15,
): Board {
  const board = createEmptyBoard(boardSize)
  const limit = Math.min(upToIndex, moves.length)
  for (let i = 0; i < limit; i++) {
    const m = moves[i]
    board[m.row][m.col] = m.player
  }
  return board
}