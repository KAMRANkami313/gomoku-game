import { useEffect, useRef } from 'react'
import { loadState, saveState, clearState } from '../lib/storage'
import { serializeGame, deserializeGame } from '../lib/gameState'
import type { GameSnapshot } from '../lib/gameState'
import type { Board, GameMode, GameStatus, MoveRecord, Player } from '../lib/types'

const STORAGE_KEY = 'game-state'

export function useGamePersistence(
  board: Board,
  status: GameStatus,
  currentPlayer: Player,
  moves: MoveRecord[],
  mode: GameMode,
  difficulty: string,
  onRestore: (snapshot: GameSnapshot) => void,
) {
  const hasRestoredRef = useRef(false)

  useEffect(() => {
    if (hasRestoredRef.current) return
    hasRestoredRef.current = true
    const raw = loadState<string>(STORAGE_KEY, '')
    if (!raw) return
    const snapshot = deserializeGame(raw)
    if (snapshot && snapshot.moves.length > 0) {
      onRestore(snapshot)
    }
  }, [onRestore])

  useEffect(() => {
    if (moves.length === 0 && status === 'playing') {
      clearState(STORAGE_KEY)
      return
    }
    const raw = serializeGame(board, status, currentPlayer, moves, mode, difficulty)
    saveState(STORAGE_KEY, raw)
  }, [board, status, currentPlayer, moves, mode, difficulty])

  const clear = () => clearState(STORAGE_KEY)

  return { clear }
}