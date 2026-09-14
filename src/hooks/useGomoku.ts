import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Board,
  Difficulty,
  GameMode,
  GameStatus,
  MoveRecord,
  Player,
  Position,
} from '../lib/types'
import { createEmptyBoard } from '../lib/types'
import { loadState, saveState } from '../lib/storage'
import { applyMove, detectWin, getGameStatus, isLegalMove } from '../lib/logic'
import { chooseAIMove } from '../lib/ai'
import { playSound } from '../lib/sound'
import type { SoundType } from '../lib/sound'

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
  mode: GameMode
  boardSize: number
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
  setMode: (m: GameMode) => void
  setSoundEnabled: (enabled: boolean) => void
  restore: (snapshot: {
    board: Board
    status: GameStatus
    currentPlayer: Player
    moves: MoveRecord[]
  }) => void
  changeBoardSize: (size: number) => void
}

export function useGomoku(): GomokuState & GomokuActions {
  const [boardSize, setBoardSizeState] = useState<number>(15)
  const [board, setBoard] = useState<Board>(() => createEmptyBoard(15))
  const [status, setStatus] = useState<GameStatus>('playing')
  const [currentPlayer, setCurrentPlayer] = useState<Player>(HUMAN_PLAYER)
  const [moves, setMoves] = useState<MoveRecord[]>([])
  const [winningLine, setWinningLine] = useState<Position[] | null>(null)
  const [lastMove, setLastMove] = useState<Position | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [mode, setModeState] = useState<GameMode>(() =>
    loadState<GameMode>('mode', 'ai'),
  )
  const soundEnabledRef = useRef(true)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [drawScore, setDrawScore] = useState(0)

  const moveCount = moves.length
  const isAiThinking =
    mode === 'ai' && status === 'playing' && currentPlayer === AI_PLAYER

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
        const sound: SoundType =
          nextStatus === 'player_wins' ? 'win' : 'loss'
        if (soundEnabledRef.current) playSound(sound)
      } else if (nextStatus === 'draw') {
        setWinningLine(null)
        setDrawScore((s) => s + 1)
        if (soundEnabledRef.current) playSound('draw')
      } else {
        setWinningLine(null)
        if (soundEnabledRef.current) playSound('place')
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
      if (mode === 'ai' && currentPlayer !== HUMAN_PLAYER) return
      placeStone(row, col, currentPlayer)
    },
    [currentPlayer, isAiThinking, mode, placeStone],
  )

  useEffect(() => {
    if (mode !== 'ai') return
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
  }, [mode, currentPlayer, status, board, placeStone])

    const setMode = useCallback((next: GameMode) => {
    setModeState(next)
    saveState('mode', next)
  }, [])
    const setSoundEnabled = useCallback((enabled: boolean) => {
    soundEnabledRef.current = enabled
  }, [])


  const undo = useCallback(() => {
    if (moves.length === 0) return
    if (status !== 'playing') return
    if (mode === 'ai' && currentPlayer === AI_PLAYER) return

    const undoCount =
      mode === 'ai' && moves[moves.length - 1].player === AI_PLAYER ? 2 : 1
    const keepCount = Math.max(0, moves.length - undoCount)
    const nextPlayer = moves[keepCount].player

    const newBoard = createEmptyBoard(boardSize)
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
    setCurrentPlayer(nextPlayer)
  }, [moves, status, currentPlayer, mode, boardSize])

  const restart = useCallback(() => {
    setBoard(createEmptyBoard(boardSize))
    setStatus('playing')
    setCurrentPlayer(HUMAN_PLAYER)
    setMoves([])
    setWinningLine(null)
    setLastMove(null)
  }, [boardSize])

  const changeBoardSize = useCallback((size: number) => {
    setBoardSizeState(size)
    setBoard(createEmptyBoard(size))
    setStatus('playing')
    setCurrentPlayer(HUMAN_PLAYER)
    setMoves([])
    setWinningLine(null)
    setLastMove(null)
  }, [])

  const restore = useCallback(
    (snapshot: {
      board: Board
      status: GameStatus
      currentPlayer: Player
      moves: MoveRecord[]
    }) => {
      setBoardSizeState(snapshot.board.length)
      setBoard(snapshot.board)
      setStatus(snapshot.status)
      setCurrentPlayer(snapshot.currentPlayer)
      setMoves(snapshot.moves)
      setLastMove(
        snapshot.moves.length > 0
          ? {
              row: snapshot.moves[snapshot.moves.length - 1].row,
              col: snapshot.moves[snapshot.moves.length - 1].col,
            }
          : null,
      )
      if (snapshot.status === 'player_wins' || snapshot.status === 'ai_wins') {
        setWinningLine(
          detectWin(
            snapshot.board,
            snapshot.moves[snapshot.moves.length - 1].row,
            snapshot.moves[snapshot.moves.length - 1].col,
          ),
        )
      } else {
        setWinningLine(null)
      }
    },
    [],
  )

  return {
    board,
    status,
    currentPlayer,
    moves,
    winningLine,
    lastMove,
    isAiThinking,
    difficulty,
    mode,
    boardSize,
    moveCount,
    playerScore,
    aiScore,
    drawScore,
    playMove,
    undo,
    restart,
    setDifficulty,
    setMode,
    setSoundEnabled,
    restore,
    changeBoardSize,
  }
}