import { useEffect, useMemo, useRef } from 'react'
import { Sparkles, Trophy, Brain } from 'lucide-react'
import { GomokuBoard } from './components/GomokuBoard'
import { GamePanel } from './components/GamePanel'
import { ToastContainer } from './components/ToastContainer'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import { StatsPanel } from './components/StatsPanel'
import { useStats } from './hooks/useStats'
import { ModeSelector } from './components/ModeSelector'
import { SoundToggle } from './components/SoundToggle'
import { useSound } from './hooks/useSound'
import { ReplayBar } from './components/ReplayBar'
import { useGamePersistence } from './hooks/useGamePersistence'
import { useReplay } from './hooks/useReplay'
import { buildBoardFromMoves } from './lib/gameState'
import { useGomoku } from './hooks/useGomoku'
import { useToast } from './hooks/useToast'
import type { GameStatus } from './lib/types'
import './styles/app.css'
import './styles/game.css'
import './styles/toast.css'

function App() {
  const game = useGomoku()
  const toast = useToast()
  const theme = useTheme()
  const sound = useSound()
  const statsHook = useStats(game.status, game.moveCount)
  const prevStatusRef = useRef<GameStatus>('playing')

  useGamePersistence(
    game.board,
    game.status,
    game.currentPlayer,
    game.moves,
    game.mode,
    game.difficulty,
    game.restore,
  )

  const gameComplete = game.status !== 'playing'
  const replay = useReplay(game.moves, gameComplete)

  const setSoundEnabled = game.setSoundEnabled
  useEffect(() => {
    setSoundEnabled(sound.enabled)
  }, [sound.enabled, setSoundEnabled])

  useEffect(() => {
    if (prevStatusRef.current === game.status) return
    const prev = prevStatusRef.current
    prevStatusRef.current = game.status

    if (prev === 'playing' && game.status === 'player_wins') {
      toast.show('Victory! Five in a row — well played.', 'success')
    } else if (prev === 'playing' && game.status === 'ai_wins') {
      toast.show('AI wins. Better luck next round!', 'error')
    } else if (prev === 'playing' && game.status === 'draw') {
      toast.show('Draw — board is full with no winner.', 'info')
    }
  }, [game.status, toast])

  const boardDisabled =
    replay.active ||
    game.status !== 'playing' ||
    game.isAiThinking ||
    (game.mode === 'ai' && game.currentPlayer !== 1)

  const modeSelectorDisabled =
    game.moveCount > 0 || game.status !== 'playing'

  const displayBoard = useMemo(() => {
    if (!replay.active) return game.board
    return buildBoardFromMoves(game.moves, replay.step)
  }, [replay.active, replay.step, game.board, game.moves])

  const displayLastMove = useMemo(() => {
    if (!replay.active) return game.lastMove
    if (replay.step === 0) return null
    const m = game.moves[replay.step - 1]
    return { row: m.row, col: m.col }
  }, [replay.active, replay.step, game.lastMove, game.moves])

  const displayWinningLine = replay.active ? null : game.winningLine

  const hint =
    game.status === 'playing'
      ? game.mode === 'pvp'
        ? game.currentPlayer === 1
          ? "Black's turn — click to place a stone."
          : "White's turn — click to place a stone."
        : game.currentPlayer === 1
          ? 'Click an empty intersection to place a black stone.'
          : 'Waiting for the AI to respond…'
      : 'Game complete. Press Restart to play again.'

  const difficultyLabel =
    game.difficulty === 'easy'
      ? 'Easy mode: heuristic play with light randomness.'
      : game.difficulty === 'medium'
        ? 'Medium mode: 2-ply minimax search with tactical shortcuts.'
        : 'Hard mode: 4-ply minimax with alpha-beta pruning and move ordering.'

  return (
    <main className="app">
      <header className="app__header">
        <div className="app__brand">
          <div className="app__logo">
            <span className="app__logo-dot" />
          </div>
          <div>
            <div className="app__title">Gomoku</div>
            <div className="app__subtitle">Five-in-a-Row vs a strategic AI</div>
          </div>
        </div>
        <div className="app__header-right">
          <div className="app__badges">
            <span className="app__badge">
              <Sparkles size={14} />
              Minimax + Alpha-Beta
            </span>
            <span className="app__badge">
              <Trophy size={14} />
              Move {game.moveCount}
            </span>
          </div>
          <ThemeToggle mode={theme.mode} onToggle={theme.toggle} />
          <SoundToggle enabled={sound.enabled} onToggle={sound.toggle} />
        </div>
      </header>

      <div className="game">
        <div className="game__board-col">
          <GomokuBoard
            board={displayBoard}
            onCellClick={game.playMove}
            lastMove={displayLastMove}
            winningLine={displayWinningLine}
            disabled={boardDisabled}
          />
          <p className="game__hint">{hint}</p>
                    {gameComplete && !replay.active && (
            <button
              type="button"
              className="game-panel__btn game-panel__btn--solid"
              onClick={replay.enter}
            >
              Watch Replay
            </button>
          )}
          {replay.active && (
            <ReplayBar
              step={replay.step}
              total={game.moves.length}
              playing={replay.playing}
              onPrev={replay.goPrev}
              onNext={replay.goNext}
              onFirst={replay.goToStart}
              onLast={replay.goToEnd}
              onTogglePlay={replay.togglePlay}
              onExit={replay.exit}
            />
          )}
        </div>
        <aside className="game__panel-col">
          <ModeSelector
            mode={game.mode}
            onModeChange={game.setMode}
            disabled={modeSelectorDisabled}
          />
          <GamePanel
            status={game.status}
            currentPlayer={game.currentPlayer}
            difficulty={game.difficulty}
            isAiThinking={game.isAiThinking}
            moves={game.moves}
            onUndo={game.undo}
            onRestart={game.restart}
            onDifficultyChange={game.setDifficulty}
            playerScore={game.playerScore}
            aiScore={game.aiScore}
            drawScore={game.drawScore}
          />
          <StatsPanel stats={statsHook.stats} onReset={statsHook.reset} />
        </aside>
      </div>

      <footer className="app__footer">
        <div className="app__footer-content">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Brain size={14} />
            {difficultyLabel}
          </span>
          <span style={{ opacity: 0.7 }}>
            Standard 15×15 board · Five-in-a-row wins
          </span>
        </div>
      </footer>

      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </main>
  )
}

export default App