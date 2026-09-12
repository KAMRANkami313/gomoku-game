import { BarChart3, Flame, Target, TrendingUp } from 'lucide-react'
import { getAverageMovesPerWin, getWinRate } from '../lib/stats'
import type { GameStats } from '../lib/stats'

interface StatsPanelProps {
  stats: GameStats
  onReset: () => void
}

export function StatsPanel({ stats, onReset }: StatsPanelProps) {
  const winRate = getWinRate(stats)
  const avgMoves = getAverageMovesPerWin(stats)

  return (
    <div className="stats-panel">
      <div className="stats-panel__header">
        <span className="stats-panel__title">
          <BarChart3 size={14} />
          Statistics
        </span>
        <button
          type="button"
          className="stats-panel__reset"
          onClick={onReset}
          title="Reset statistics"
        >
          Reset
        </button>
      </div>

      {stats.totalGames === 0 ? (
        <p className="stats-panel__empty">
          No games played yet. Complete a game to see your stats.
        </p>
      ) : (
        <>
          <div className="stats-panel__grid">
            <div className="stats-panel__stat">
              <span className="stats-panel__stat-label">Games</span>
              <span className="stats-panel__stat-value">{stats.totalGames}</span>
            </div>
            <div className="stats-panel__stat">
              <span className="stats-panel__stat-label">Win Rate</span>
              <span className="stats-panel__stat-value">{winRate}%</span>
            </div>
            <div className="stats-panel__stat">
              <span className="stats-panel__stat-label">Avg Moves/Win</span>
              <span className="stats-panel__stat-value">{avgMoves}</span>
            </div>
          </div>

          <div className="stats-panel__row">
            <div className="stats-panel__detail">
              <span className="stats-panel__detail-icon wins">
                <Target size={14} />
              </span>
              <span className="stats-panel__detail-label">Wins</span>
              <span className="stats-panel__detail-value">{stats.wins}</span>
            </div>
            <div className="stats-panel__detail">
              <span className="stats-panel__detail-icon losses">
                <Target size={14} />
              </span>
              <span className="stats-panel__detail-label">Losses</span>
              <span className="stats-panel__detail-value">{stats.losses}</span>
            </div>
            <div className="stats-panel__detail">
              <span className="stats-panel__detail-icon draws">
                <Target size={14} />
              </span>
              <span className="stats-panel__detail-label">Draws</span>
              <span className="stats-panel__detail-value">{stats.draws}</span>
            </div>
          </div>

          <div className="stats-panel__row">
            <div className="stats-panel__detail">
              <span className="stats-panel__detail-icon streak">
                <Flame size={14} />
              </span>
              <span className="stats-panel__detail-label">Current Streak</span>
              <span className="stats-panel__detail-value">
                {stats.currentWinStreak}
              </span>
            </div>
            <div className="stats-panel__detail">
              <span className="stats-panel__detail-icon best">
                <TrendingUp size={14} />
              </span>
              <span className="stats-panel__detail-label">Best Streak</span>
              <span className="stats-panel__detail-value">
                {stats.bestWinStreak}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}