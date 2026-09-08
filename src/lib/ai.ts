import {
  DIRECTIONS,
  BOARD_SIZE,
  WIN_LENGTH,
  inBounds,
} from './types'
import type {
  Board,
  Player,
  Position,
  Difficulty,
} from './types'
import { detectWin, getCandidateMoves } from './logic'

const SCORE = {
  FIVE: 10_000_000,
  OPEN_FOUR: 1_000_000,
  FOUR: 100_000,
  OPEN_THREE: 10_000,
  THREE: 1_000,
  OPEN_TWO: 100,
  TWO: 10,
  ONE: 1,
} as const

function evalLine(
  board: Board,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player,
): { count: number; openEnds: number } {
  let count = 1
  let r = row + dr
  let c = col + dc
  while (inBounds(r, c) && board[r][c] === player) {
    count += 1
    r += dr
    c += dc
  }
  const forwardOpen = inBounds(r, c) && board[r][c] === 0

  r = row - dr
  c = col - dc
  while (inBounds(r, c) && board[r][c] === player) {
    count += 1
    r -= dr
    c -= dc
  }
  const backwardOpen = inBounds(r, c) && board[r][c] === 0

  const openEnds = (forwardOpen ? 1 : 0) + (backwardOpen ? 1 : 0)
  return { count, openEnds }
}

function scoreShape(count: number, openEnds: number): number {
  if (count >= WIN_LENGTH) return SCORE.FIVE
  if (count === 4) {
    if (openEnds === 2) return SCORE.OPEN_FOUR
    if (openEnds === 1) return SCORE.FOUR
    return 0
  }
  if (count === 3) {
    if (openEnds === 2) return SCORE.OPEN_THREE
    if (openEnds === 1) return SCORE.THREE
    return 0
  }
  if (count === 2) {
    if (openEnds === 2) return SCORE.OPEN_TWO
    if (openEnds === 1) return SCORE.TWO
    return 0
  }
  if (count === 1) {
    if (openEnds === 2) return SCORE.ONE
    return 0
  }
  return 0
}

export function evaluateBoard(board: Board, evaluator: Player): number {
  let scoreForEvaluator = 0
  let scoreForOpponent = 0

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c]
      if (cell === 0) continue
      const player = cell as Player

      for (const [dr, dc] of DIRECTIONS) {
        const prevR = r - dr
        const prevC = c - dc
        if (inBounds(prevR, prevC) && board[prevR][prevC] === player) {
          continue
        }
        const { count, openEnds } = evalLine(board, r, c, dr, dc, player)
        const s = scoreShape(count, openEnds)
        if (player === evaluator) scoreForEvaluator += s
        else scoreForOpponent += s
      }
    }
  }

  return scoreForEvaluator - scoreForOpponent * 1.05
}

function scoreMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
): number {
  const opponent: Player = player === 1 ? 2 : 1
  let myScore = 0
  let oppScore = 0

  board[row][col] = player
  for (const [dr, dc] of DIRECTIONS) {
    const { count, openEnds } = evalLine(board, row, col, dr, dc, player)
    myScore += scoreShape(count, openEnds)
  }

  board[row][col] = opponent
  for (const [dr, dc] of DIRECTIONS) {
    const { count, openEnds } = evalLine(board, row, col, dr, dc, opponent)
    oppScore += scoreShape(count, openEnds)
  }

  board[row][col] = 0

  return Math.max(myScore, oppScore * 0.95)
}

export function findWinningMove(
  board: Board,
  player: Player,
): Position | null {
  const candidates = getCandidateMoves(board, 1)
  for (const { row, col } of candidates) {
    board[row][col] = player
    const won = detectWin(board, row, col)
    board[row][col] = 0
    if (won) return { row, col }
  }
  return null
}

export function findOpponentWinningMove(
  board: Board,
  player: Player,
): Position | null {
  const opponent: Player = player === 1 ? 2 : 1
  return findWinningMove(board, opponent)
}

const INF = 1e18

interface SearchResult {
  score: number
  move: Position | null
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  aiPlayer: Player,
  currentPlayer: Player,
  lastMove: Position | null,
): SearchResult {
  if (lastMove) {
    const winLine = detectWin(board, lastMove.row, lastMove.col)
    if (winLine) {
      const winner = board[lastMove.row][lastMove.col] as Player
      const sign = winner === aiPlayer ? 1 : -1
      return { score: sign * (SCORE.FIVE - depth), move: null }
    }
  }

  if (depth === 0) {
    return { score: evaluateBoard(board, aiPlayer), move: null }
  }

  const candidates = getCandidateMoves(board, 1)
  if (candidates.length === 0) {
    return { score: evaluateBoard(board, aiPlayer), move: null }
  }

  const scored = candidates.map((m) => ({
    move: m,
    heuristic: scoreMove(board, m.row, m.col, currentPlayer),
  }))
  scored.sort((a, b) => b.heuristic - a.heuristic)

  const branchLimit = 10
  const considered = scored.slice(0, branchLimit)

  const maximizing = currentPlayer === aiPlayer
  let bestMove: Position | null = null

  if (maximizing) {
    let value = -INF
    for (const { move } of considered) {
      board[move.row][move.col] = currentPlayer
      const nextPlayer: Player = currentPlayer === 1 ? 2 : 1
      const child = minimax(board, depth - 1, alpha, beta, aiPlayer, nextPlayer, move)
      board[move.row][move.col] = 0

      if (child.score > value) {
        value = child.score
        bestMove = move
      }
      alpha = Math.max(alpha, value)
      if (alpha >= beta) break
    }
    return { score: value, move: bestMove }
  } else {
    let value = INF
    for (const { move } of considered) {
      board[move.row][move.col] = currentPlayer
      const nextPlayer: Player = currentPlayer === 1 ? 2 : 1
      const child = minimax(board, depth - 1, alpha, beta, aiPlayer, nextPlayer, move)
      board[move.row][move.col] = 0

      if (child.score < value) {
        value = child.score
        bestMove = move
      }
      beta = Math.min(beta, value)
      if (alpha >= beta) break
    }
    return { score: value, move: bestMove }
  }
}

export function chooseAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty,
): Position {
  let anyStone = false
  for (let r = 0; r < BOARD_SIZE && !anyStone; r++) {
    for (let c = 0; c < BOARD_SIZE && !anyStone; c++) {
      if (board[r][c] !== 0) anyStone = true
    }
  }
  if (!anyStone) {
    return {
      row: Math.floor(BOARD_SIZE / 2),
      col: Math.floor(BOARD_SIZE / 2),
    }
  }

  const winNow = findWinningMove(board, aiPlayer)
  if (winNow) return winNow

  const blockNow = findOpponentWinningMove(board, aiPlayer)
  if (blockNow) return blockNow

  if (difficulty === 'easy') {
    const candidates = getCandidateMoves(board, 1)
    const scored = candidates.map((m) => ({
      move: m,
      score: scoreMove(board, m.row, m.col, aiPlayer),
    }))
    scored.sort((a, b) => b.score - a.score)

    const topN = Math.min(scored.length, 4)
    if (topN === 0) return candidates[0]

    const r = Math.random()
    if (r < 0.7) return scored[0].move
    const idx = 1 + Math.floor(Math.random() * (topN - 1))
    return scored[idx].move
  }

  const depth = difficulty === 'medium' ? 2 : 4
  const workingBoard = board.map((row) => [...row])
  const result = minimax(
    workingBoard,
    depth,
    -INF,
    INF,
    aiPlayer,
    aiPlayer,
    null,
  )

  if (result.move) return result.move

  const candidates = getCandidateMoves(board, 1)
  const scored = candidates.map((m) => ({
    move: m,
    score: scoreMove(board, m.row, m.col, aiPlayer),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored[0]?.move ?? candidates[0]
}