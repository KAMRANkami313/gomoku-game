export const BOARD_SIZE = 15
export const WIN_LENGTH = 5

export type CellValue = 0 | 1 | 2

export type Player = 1 | 2

export type Board = number[][]

export type Position = {
  row: number
  col: number
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameMode = 'ai' | 'pvp'

export type GameStatus = 'playing' | 'player_wins' | 'ai_wins' | 'draw'

export type MoveRecord = {
  row: number
  col: number
  player: Player
  moveNumber: number
}

export const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0 as CellValue),
  )
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}