import { useCallback, useEffect, useRef, useState } from 'react'
import { loadState, saveState } from '../lib/storage'
import { EMPTY_STATS, recordResult } from '../lib/stats'
import type { GameStats, GameResult } from '../lib/stats'
import type { GameStatus } from '../lib/types'

const STORAGE_KEY = 'stats'

function statusToResult(status: GameStatus): GameResult | null {
  if (status === 'player_wins') return 'win'
  if (status === 'ai_wins') return 'loss'
  if (status === 'draw') return 'draw'
  return null
}

export function useStats(status: GameStatus, moveCount: number) {
  const [stats, setStats] = useState<GameStats>(() =>
    loadState<GameStats>(STORAGE_KEY, EMPTY_STATS),
  )

  const prevStatusRef = useRef<GameStatus>('playing')
  const moveCountRef = useRef(moveCount)

  useEffect(() => {
    moveCountRef.current = moveCount
  }, [moveCount])

  useEffect(() => {
    if (prevStatusRef.current === status) return
    const prev = prevStatusRef.current
    prevStatusRef.current = status

    if (prev === 'playing' && status !== 'playing') {
      const result = statusToResult(status)
      if (result) {
        setStats((prevStats) => {
          const next = recordResult(prevStats, result, moveCountRef.current)
          saveState(STORAGE_KEY, next)
          return next
        })
      }
    }
  }, [status])

  const reset = useCallback(() => {
    setStats(EMPTY_STATS)
    saveState(STORAGE_KEY, EMPTY_STATS)
  }, [])

  return { stats, reset }
}