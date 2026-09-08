import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Board,
  Difficulty,
  GameStatus,
  MoveRecord,
  Player,
  Position,
} from '../lib/types'
import { createEmptyBoard } from '../lib/types'
import { applyMove, detectWin, getGameStatus, isLegalMove } from '../lib/logic'
import { chooseAIMove } from '../lib/ai'

const AI_PLAYER: Player = 2
const HUMAN_PLAYER: Player = 1
const AI_THINK_DELAY_MS = 300

export interface GomokuState {
  board: Board
  status: GameStatus
  currentPlayer: Player
  moves: MoveRecord[]
  winningLine: Position[] | null
  lastMove: Position | null
  isAiThinking: boolean
  difficulty: Difficulty
  moveCount: number
  playerScore: number
  aiScore: number
  drawScore: number
}

export interface GomokuActions {
  playMove: (row: number, col: number) => void
  undo: () => void
  restart: () => void
  setDifficulty: (d: Difficulty) => void
}

export function useGomoku(): GomokuState & GomokuActions {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard())
  const [status, setStatus] = useState<GameStatus>('playing')
  const [currentPlayer, setCurrentPlayer] = useState<Player>(HUMAN_PLAYER)
  const [moves, setMoves] = useState<MoveRecord[]>([])
  const [winningLine, setWinningLine] = useState<Position[] | null>(null)
  const [lastMove, setLastMove] = useState<Position | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [drawScore, setDrawScore] = useState(0)

  const moveCount = moves.length
  const isAiThinking = status === 'playing' && currentPlayer === AI_PLAYER

  const difficultyRef = useRef(difficulty)
  useEffect(() => {
    difficultyRef.current = difficulty
  }, [difficulty])

  const placeStone = useCallback(
    (row: number, col: number, player: Player): boolean => {
      if (!isLegalMove(board, row, col)) return false
      if (status !== 'playing') return false

      const nextBoard = applyMove(board, row, col, player)
      const nextMoves: MoveRecord[] = [
        ...moves,
        { row, col, player, moveNumber: moves.length + 1 },
      ]
      const nextStatus = getGameStatus(nextBoard, { row, col }, nextMoves.length)

      setBoard(nextBoard)
      setMoves(nextMoves)
      setLastMove({ row, col })

      if (nextStatus === 'player_wins' || nextStatus === 'ai_wins') {
        setWinningLine(detectWin(nextBoard, row, col))
        if (nextStatus === 'player_wins') setPlayerScore((s) => s + 1)
        else setAiScore((s) => s + 1)
      } else if (nextStatus === 'draw') {
        setWinningLine(null)
        setDrawScore((s) => s + 1)
      } else {
        setWinningLine(null)
      }

      setStatus(nextStatus)
      setCurrentPlayer(
        nextStatus === 'playing' ? (player === 1 ? 2 : 1) : player,
      )
      return true
    },
    [board, moves, status],
  )

  const playMove = useCallback(
    (row: number, col: number) => {
      if (isAiThinking) return
      if (currentPlayer !== HUMAN_PLAYER) return
      placeStone(row, col, HUMAN_PLAYER)
    },
    [currentPlayer, isAiThinking, placeStone],
  )

  useEffect(() => {
    if (status !== 'playing') return
    if (currentPlayer !== AI_PLAYER) return

    const timer = setTimeout(() => {
      const working = board.map((row) => [...row])
      const move: Position = chooseAIMove(
        working,
        AI_PLAYER,
        difficultyRef.current,
      )
      placeStone(move.row, move.col, AI_PLAYER)
    }, AI_THINK_DELAY_MS)

    return () => clearTimeout(timer)
  }, [currentPlayer, status, board, placeStone])

  const undo = useCallback(() => {
    if (moves.length === 0) return
    if (status !== 'playing') return
    if (currentPlayer === AI_PLAYER) return

    const undoCount = moves[moves.length - 1].player === AI_PLAYER ? 2 : 1
    const keepCount = Math.max(0, moves.length - undoCount)

    const newBoard = createEmptyBoard()
    const kept = moves.slice(0, keepCount)
    for (const m of kept) {
      newBoard[m.row][m.col] = m.player
    }

    setBoard(newBoard)
    setMoves(kept)
    setWinningLine(null)
    setLastMove(
      kept.length > 0
        ? {
            row: kept[kept.length - 1].row,
            col: kept[kept.length - 1].col,
          }
        : null,
    )
    setStatus('playing')
    setCurrentPlayer(HUMAN_PLAYER)
  }, [moves, status, currentPlayer])

  const restart = useCallback(() => {
    setBoard(createEmptyBoard())
    setStatus('playing')
    setCurrentPlayer(HUMAN_PLAYER)
    setMoves([])
    setWinningLine(null)
    setLastMove(null)
  }, [])

  return {
    board,
    status,
    currentPlayer,
    moves,
    winningLine,
    lastMove,
    isAiThinking,
    difficulty,
    moveCount,
    playerScore,
    aiScore,
    drawScore,
    playMove,
    undo,
    restart,
    setDifficulty,
  }
}