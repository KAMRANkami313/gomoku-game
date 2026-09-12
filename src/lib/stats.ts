export interface GameStats {
  totalGames: number
  wins: number
  losses: number
  draws: number
  currentWinStreak: number
  bestWinStreak: number
  totalMovesInWins: number
}

export const EMPTY_STATS: GameStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
  totalMovesInWins: 0,
}

export type GameResult = 'win' | 'loss' | 'draw'

export function recordResult(
  stats: GameStats,
  result: GameResult,
  moveCount: number,
): GameStats {
  const next: GameStats = { ...stats }
  next.totalGames += 1

  if (result === 'win') {
    next.wins += 1
    next.currentWinStreak += 1
    next.bestWinStreak = Math.max(next.bestWinStreak, next.currentWinStreak)
    next.totalMovesInWins += moveCount
  } else {
    next.currentWinStreak = 0
    if (result === 'loss') {
      next.losses += 1
    } else {
      next.draws += 1
    }
  }

  return next
}

export function getAverageMovesPerWin(stats: GameStats): number {
  if (stats.wins === 0) return 0
  return Math.round(stats.totalMovesInWins / stats.wins)
}

export function getWinRate(stats: GameStats): number {
  if (stats.totalGames === 0) return 0
  return Math.round((stats.wins / stats.totalGames) * 100)
}