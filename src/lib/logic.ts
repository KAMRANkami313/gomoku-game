import {
  DIRECTIONS,
  inBounds,
  getWinLength,
} from './types'
import type {
  Board,
  GameStatus,
  Player,
  Position,
} from './types'

export function isLegalMove(
  board: Board,
  row: number,
  col: number,
): boolean {
  return inBounds(row, col, board.length) && board[row][col] === 0
}

export function applyMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): Board {
  const next = board.map((row) => [...row])
  next[row][col] = player
  return next
}

function countDirection(
  board: Board,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player,
): number {
  let count = 0
  let r = row + dr
  let c = col + dc
  while (inBounds(r, c, board.length) && board[r][c] === player) {
    count += 1
    r += dr
    c += dc
  }
  return count
}

export function detectWin(
  board: Board,
  row: number,
  col: number,
): Position[] | null {
  const player = board[row][col] as Player
  if (player !== 1 && player !== 2) return null
  const winLength = getWinLength(board.length)

  for (const [dr, dc] of DIRECTIONS) {
    const forward = countDirection(board, row, col, dr, dc, player)
    const backward = countDirection(board, row, col, -dr, -dc, player)
    const total = forward + backward + 1

    if (total >= winLength) {
      const line: Position[] = [{ row, col }]

      let r = row + dr
      let c = col + dc
      while (
        inBounds(r, c, board.length) &&
        board[r][c] === player &&
        line.length < winLength
      ) {
        line.push({ row: r, col: c })
        r += dr
        c += dc
      }

      r = row - dr
      c = col - dc
      while (
        inBounds(r, c, board.length) &&
        board[r][c] === player &&
        line.length < winLength
      ) {
        line.unshift({ row: r, col: c })
        r -= dr
        c -= dc
      }

      return line
    }
  }
  return null
}

export function getGameStatus(
  board: Board,
  lastMove: Position | null,
  moveCount: number,
): GameStatus {
  if (lastMove) {
    const winLine = detectWin(board, lastMove.row, lastMove.col)
    if (winLine) {
      const winner = board[lastMove.row][lastMove.col] as Player
      return winner === 1 ? 'player_wins' : 'ai_wins'
    }
  }

  const totalCells = board.length * board.length
  if (moveCount >= totalCells) {
    return 'draw'
  }

  return 'playing'
}

export function getCandidateMoves(
  board: Board,
  radius = 2,
): Position[] {
  const candidates: Position[] = []
  const seen = new Set<string>()
  const size = board.length

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) continue

      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (!inBounds(nr, nc, size) || board[nr][nc] !== 0) continue
          const key = nr + ',' + nc
          if (seen.has(key)) continue
          seen.add(key)
          candidates.push({ row: nr, col: nc })
        }
      }
    }
  }

  if (candidates.length === 0) {
    candidates.push({
      row: Math.floor(size / 2),
      col: Math.floor(size / 2),
    })
  }

  return candidates
}