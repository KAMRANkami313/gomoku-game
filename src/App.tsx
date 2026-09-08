import { useState } from 'react'
import { GomokuBoard } from './components/GomokuBoard'
import { createEmptyBoard } from './lib/types'
import { applyMove } from './lib/logic'
import type { Board, Position, Player } from './lib/types'
import './styles/app.css'

function App() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard())
  const [lastMove, setLastMove] = useState<Position | null>(null)
  const [player, setPlayer] = useState<Player>(1)

  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== 0) return
    const next = applyMove(board, row, col, player)
    setBoard(next)
    setLastMove({ row, col })
    setPlayer(player === 1 ? 2 : 1)
  }

  return (
    <main className="app">
      <h1 className="app__title">Gomoku</h1>
      <p className="app__subtitle">Five-in-a-Row vs a strategic AI</p>
      <p className="app__status">Batch 5 preview — click to place stones.</p>
      <div style={{ marginTop: '2rem' }}>
        <GomokuBoard
          board={board}
          onCellClick={handleClick}
          lastMove={lastMove}
          winningLine={null}
          disabled={false}
        />
      </div>
    </main>
  )
}

export default App