import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { GamePanel } from './GamePanel'
import type { MoveRecord, Player } from '../lib/types'

function makeMove(
  n: number,
  row: number,
  col: number,
  player: Player,
): MoveRecord {
  return { row, col, player, moveNumber: n }
}

const defaultProps = {
  status: 'playing' as const,
  currentPlayer: 1 as Player,
  difficulty: 'medium' as const,
  isAiThinking: false,
  moves: [] as MoveRecord[],
  onUndo: () => {},
  onRestart: () => {},
  onDifficultyChange: () => {},
  playerScore: 0,
  aiScore: 0,
  drawScore: 0,
}

describe('GamePanel — status banner', () => {
  it('shows "Your turn" when player 1 is current', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} status="playing" currentPlayer={1} />,
    )
    expect(getByText('Your turn')).toBeTruthy()
    expect(getByText('Place a black stone.')).toBeTruthy()
  })

  it('shows "AI is thinking…" when isAiThinking is true', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} isAiThinking={true} currentPlayer={2} />,
    )
    expect(getByText('AI is thinking…')).toBeTruthy()
  })

  it('shows "You win!" on player_wins', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} status="player_wins" />,
    )
    expect(getByText('You win!')).toBeTruthy()
  })

  it('shows "AI wins" on ai_wins', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} status="ai_wins" />,
    )
    expect(getByText('AI wins')).toBeTruthy()
  })

  it('shows "Draw" on draw', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} status="draw" />,
    )
    expect(getByText('Draw')).toBeTruthy()
  })
})

describe('GamePanel — scoreboard', () => {
  it('renders all three score boxes', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} playerScore={3} aiScore={1} drawScore={2} />,
    )
    expect(getByText('You')).toBeTruthy()
    expect(getByText('Draws')).toBeTruthy()
    expect(getByText('AI')).toBeTruthy()
    expect(getByText('3')).toBeTruthy()
    expect(getByText('1')).toBeTruthy()
    expect(getByText('2')).toBeTruthy()
  })
})

describe('GamePanel — difficulty selector', () => {
  it('renders three difficulty buttons', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} />,
    )
    expect(getByText('Easy')).toBeTruthy()
    expect(getByText('Medium')).toBeTruthy()
    expect(getByText('Hard')).toBeTruthy()
  })

  it('calls onDifficultyChange when a difficulty is clicked', () => {
    const onDifficultyChange = vi.fn()
    const { getByText } = render(
      <GamePanel {...defaultProps} onDifficultyChange={onDifficultyChange} />,
    )
    fireEvent.click(getByText('Hard'))
    expect(onDifficultyChange).toHaveBeenCalledWith('hard')
  })

  it('shows the hint for the active difficulty', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} difficulty="hard" />,
    )
    expect(getByText('4-ply minimax + alpha-beta')).toBeTruthy()
  })
})

describe('GamePanel — controls', () => {
  it('calls onUndo when Undo is clicked', () => {
    const onUndo = vi.fn()
    const moves = [makeMove(1, 7, 7, 1)]
    const { getByText } = render(
      <GamePanel {...defaultProps} moves={moves} onUndo={onUndo} />,
    )
    fireEvent.click(getByText('Undo'))
    expect(onUndo).toHaveBeenCalled()
  })

  it('calls onRestart when Restart is clicked', () => {
    const onRestart = vi.fn()
    const { getByText } = render(
      <GamePanel {...defaultProps} onRestart={onRestart} />,
    )
    fireEvent.click(getByText('Restart'))
    expect(onRestart).toHaveBeenCalled()
  })

  it('disables Undo when there are no moves', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} moves={[]} />,
    )
    const undoBtn = getByText('Undo').closest('button')
    expect(undoBtn?.disabled).toBe(true)
  })

  it('disables Undo when AI is thinking', () => {
    const moves = [makeMove(1, 7, 7, 1)]
    const { getByText } = render(
      <GamePanel
        {...defaultProps}
        moves={moves}
        isAiThinking={true}
        currentPlayer={2}
      />,
    )
    const undoBtn = getByText('Undo').closest('button')
    expect(undoBtn?.disabled).toBe(true)
  })
})

describe('GamePanel — move history', () => {
  it('shows empty message when no moves', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} moves={[]} />,
    )
    expect(
      getByText('No moves yet. Click on the board to place your first black stone.'),
    ).toBeTruthy()
  })

  it('shows move count', () => {
    const moves = [
      makeMove(1, 7, 7, 1),
      makeMove(2, 7, 8, 2),
    ]
    const { getByText } = render(
      <GamePanel {...defaultProps} moves={moves} />,
    )
    expect(getByText('2 moves')).toBeTruthy()
  })

  it('renders moves in reverse order (newest first)', () => {
    const moves = [
      makeMove(1, 7, 7, 1),
      makeMove(2, 7, 8, 2),
      makeMove(3, 8, 8, 1),
    ]
    const { getAllByText } = render(
      <GamePanel {...defaultProps} moves={moves} />,
    )
    const moveNumbers = getAllByText(/^#\d+$/).map((el) => el.textContent)
    expect(moveNumbers).toEqual(['#3', '#2', '#1'])
  })

  it('shows coordinate label for each move', () => {
    const moves = [makeMove(1, 7, 7, 1)]
    const { getByText } = render(
      <GamePanel {...defaultProps} moves={moves} />,
    )
    expect(getByText('H8')).toBeTruthy()
  })
})

describe('GamePanel — game over state', () => {
  it('shows game over message when status is not playing', () => {
    const { getByText } = render(
      <GamePanel {...defaultProps} status="player_wins" />,
    )
    expect(getByText(/Game over/)).toBeTruthy()
  })

  it('does not show game over message when playing', () => {
    const { queryByText } = render(
      <GamePanel {...defaultProps} status="playing" />,
    )
    expect(queryByText(/Game over/)).toBeNull()
  })
})