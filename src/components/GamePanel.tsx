import {
  Brain,
  Clock,
  CircleDot,
  RotateCcw,
  Sparkles,
  Trophy,
  Undo2,
} from 'lucide-react'
import { BOARD_SIZE } from '../lib/types'
import type {
  Difficulty,
  GameStatus,
  MoveRecord,
  Player,
} from '../lib/types'

interface GamePanelProps {
  status: GameStatus
  currentPlayer: Player
  difficulty: Difficulty
  isAiThinking: boolean
  moves: MoveRecord[]
  onUndo: () => void
  onRestart: () => void
  onDifficultyChange: (d: Difficulty) => void
  playerScore: number
  aiScore: number
  drawScore: number
}

const DIFFICULTY_OPTIONS: ReadonlyArray<{
  value: Difficulty
  label: string
  hint: string
}> = [
  { value: 'easy', label: 'Easy', hint: 'Casual heuristic play' },
  { value: 'medium', label: 'Medium', hint: '2-ply lookahead + tactics' },
  { value: 'hard', label: 'Hard', hint: '4-ply minimax + alpha-beta' },
]

function moveLabel(player: Player): string {
  return player === 1 ? 'Black' : 'White'
}

function coordinateLabel(row: number, col: number): string {
  const colLetter = String.fromCharCode('A'.charCodeAt(0) + col)
  const rowNum = BOARD_SIZE - row
  return `${colLetter}${rowNum}`
}

function getStatusBanner(
  status: GameStatus,
  currentPlayer: Player,
  isAiThinking: boolean,
): {
  title: string
  sub: string
  variant: string
  icon: typeof Trophy
} {
  if (status === 'player_wins') {
    return {
      title: 'You win!',
      sub: 'Five in a row — well played.',
      variant: 'win',
      icon: Trophy,
    }
  }
  if (status === 'ai_wins') {
    return {
      title: 'AI wins',
      sub: 'Better luck next round.',
      variant: 'loss',
      icon: Brain,
    }
  }
  if (status === 'draw') {
    return {
      title: 'Draw',
      sub: 'Board is full — no winner.',
      variant: 'draw',
      icon: Sparkles,
    }
  }
  if (isAiThinking) {
    return {
      title: 'AI is thinking…',
      sub: 'Calculating the optimal move.',
      variant: 'thinking',
      icon: Brain,
    }
  }
  if (currentPlayer === 1) {
    return {
      title: 'Your turn',
      sub: 'Place a black stone.',
      variant: 'player-turn',
      icon: CircleDot,
    }
  }
  return {
    title: 'AI turn',
    sub: 'Waiting on the algorithm.',
    variant: 'ai-turn',
    icon: CircleDot,
  }
}

export function GamePanel({
  status,
  currentPlayer,
  difficulty,
  isAiThinking,
  moves,
  onUndo,
  onRestart,
  onDifficultyChange,
  playerScore,
  aiScore,
  drawScore,
}: GamePanelProps) {
  const gameOver = status !== 'playing'
  const banner = getStatusBanner(status, currentPlayer, isAiThinking)
  const StatusIcon = banner.icon
  const reversedMoves = [...moves].reverse()
  const activeHint = DIFFICULTY_OPTIONS.find((o) => o.value === difficulty)?.hint

  return (
    <div className="game-panel">
      <div className={`game-panel__status game-panel__status--${banner.variant}`}>
        <div className="game-panel__status-icon">
          <StatusIcon size={20} />
        </div>
        <div>
          <div className="game-panel__status-title">{banner.title}</div>
          <div className="game-panel__status-sub">{banner.sub}</div>
        </div>
      </div>

      <div className="game-panel__scores">
        <div className="score-box score-box--player">
          <span className="score-box__label">You</span>
          <span className="score-box__value">{playerScore}</span>
        </div>
        <div className="score-box score-box--draw">
          <span className="score-box__label">Draws</span>
          <span className="score-box__value">{drawScore}</span>
        </div>
        <div className="score-box score-box--ai">
          <span className="score-box__label">AI</span>
          <span className="score-box__value">{aiScore}</span>
        </div>
      </div>

      <div className="game-panel__section">
        <div className="game-panel__section-label">
          <Brain size={14} />
          AI Difficulty
        </div>
        <div className="game-panel__difficulty-buttons">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const active = difficulty === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                className={
                  'game-panel__difficulty-btn ' +
                  (active
                    ? 'game-panel__difficulty-btn--active'
                    : 'game-panel__difficulty-btn--inactive')
                }
                onClick={() => onDifficultyChange(opt.value)}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <p className="game-panel__difficulty-hint">{activeHint}</p>
      </div>

      <div className="game-panel__controls">
        <button
          type="button"
          className="game-panel__btn game-panel__btn--outline"
          onClick={onUndo}
          disabled={moves.length === 0 || isAiThinking}
        >
          <Undo2 size={16} />
          Undo
        </button>
        <button
          type="button"
          className="game-panel__btn game-panel__btn--solid"
          onClick={onRestart}
        >
          <RotateCcw size={16} />
          Restart
        </button>
      </div>

      <div className="game-panel__history">
        <div className="game-panel__history-header">
          <span className="game-panel__history-label">
            <Clock size={14} />
            Move History
          </span>
          <span className="game-panel__history-count">{moves.length} moves</span>
        </div>
        <div className="game-panel__history-list">
          {reversedMoves.length === 0 ? (
            <div className="game-panel__history-empty">
              No moves yet. Click on the board to place your first black stone.
            </div>
          ) : (
            reversedMoves.map((m) => (
              <div
                key={`${m.moveNumber}-${m.row}-${m.col}`}
                className={
                  'game-panel__move ' +
                  (m.player === 1
                    ? 'game-panel__move--black'
                    : 'game-panel__move--white')
                }
              >
                <span className="game-panel__move-number">#{m.moveNumber}</span>
                <span
                  className={
                    'game-panel__move-stone ' +
                    (m.player === 1
                      ? 'game-panel__move-stone--black'
                      : 'game-panel__move-stone--white')
                  }
                />
                <span className="game-panel__move-player">
                  {moveLabel(m.player)}
                </span>
                <span className="game-panel__move-coord">
                  {coordinateLabel(m.row, m.col)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {gameOver && (
        <div className="game-panel__game-over">
          Game over. Press Restart to play again, or change difficulty to switch
          opponents.
        </div>
      )}
    </div>
  )
}