import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { GomokuBoard } from './GomokuBoard'
import { createEmptyBoard } from '../lib/types'
import { applyMove } from '../lib/logic'
import type { Board, Position } from '../lib/types'

function makeBoard(
  stones: Array<{ row: number; col: number; player: 1 | 2 }>,
): Board {
  let board = createEmptyBoard()
  for (const s of stones) {
    board = applyMove(board, s.row, s.col, s.player)
  }
  return board
}

const defaultProps = {
  onCellClick: () => {},
  lastMove: null as Position | null,
  winningLine: null as Position[] | null,
  disabled: false,
}

describe('GomokuBoard — structure', () => {
  it('renders an svg element', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('renders 30 grid lines (15 horizontal + 15 vertical)', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    expect(container.querySelectorAll('line').length).toBe(30)
  })

  it('renders 5 star points', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    expect(container.querySelectorAll('circle[fill="#3d2817"]').length).toBe(5)
  })

  it('renders 225 click targets', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    expect(
      container.querySelectorAll('rect[data-testid^="cell-"]').length,
    ).toBe(225)
  })
})

describe('GomokuBoard — stones', () => {
  it('renders a black stone for player 1', () => {
    const board = makeBoard([{ row: 7, col: 7, player: 1 }])
    const { container } = render(
      <GomokuBoard board={board} {...defaultProps} />,
    )
    expect(
      container.querySelectorAll('circle[fill="url(#black-stone)"]').length,
    ).toBe(1)
  })

  it('renders a white stone for player 2', () => {
    const board = makeBoard([{ row: 7, col: 7, player: 2 }])
    const { container } = render(
      <GomokuBoard board={board} {...defaultProps} />,
    )
    expect(
      container.querySelectorAll('circle[fill="url(#white-stone)"]').length,
    ).toBe(1)
  })

  it('renders the correct number of stones', () => {
    const board = makeBoard([
      { row: 7, col: 7, player: 1 },
      { row: 7, col: 8, player: 2 },
      { row: 8, col: 7, player: 1 },
    ])
    const { container } = render(
      <GomokuBoard board={board} {...defaultProps} />,
    )
    expect(
      container.querySelectorAll('circle[fill="url(#black-stone)"]').length,
    ).toBe(2)
    expect(
      container.querySelectorAll('circle[fill="url(#white-stone)"]').length,
    ).toBe(1)
  })
})

describe('GomokuBoard — click handling', () => {
  it('calls onCellClick with correct row and col', () => {
    const onCellClick = vi.fn()
    const { container } = render(
      <GomokuBoard
        board={createEmptyBoard()}
        onCellClick={onCellClick}
        lastMove={null}
        winningLine={null}
        disabled={false}
      />,
    )
    const cell = container.querySelector('[data-testid="cell-7-7"]')
    fireEvent.click(cell!)
    expect(onCellClick).toHaveBeenCalledWith(7, 7)
  })

  it('does not call onCellClick when disabled', () => {
    const onCellClick = vi.fn()
    const { container } = render(
      <GomokuBoard
        board={createEmptyBoard()}
        onCellClick={onCellClick}
        lastMove={null}
        winningLine={null}
        disabled={true}
      />,
    )
    const cell = container.querySelector('[data-testid="cell-7-7"]')
    fireEvent.click(cell!)
    expect(onCellClick).not.toHaveBeenCalled()
  })

  it('does not call onCellClick on an occupied cell', () => {
    const board = makeBoard([{ row: 7, col: 7, player: 1 }])
    const onCellClick = vi.fn()
    const { container } = render(
      <GomokuBoard
        board={board}
        onCellClick={onCellClick}
        lastMove={null}
        winningLine={null}
        disabled={false}
      />,
    )
    const cell = container.querySelector('[data-testid="cell-7-7"]')
    fireEvent.click(cell!)
    expect(onCellClick).not.toHaveBeenCalled()
  })
})

describe('GomokuBoard — last move marker', () => {
  it('shows orange dot on the last move', () => {
    const board = makeBoard([{ row: 7, col: 7, player: 1 }])
    const { container } = render(
      <GomokuBoard
        board={board}
        onCellClick={() => {}}
        lastMove={{ row: 7, col: 7 }}
        winningLine={null}
        disabled={false}
      />,
    )
    expect(container.querySelectorAll('circle[fill="#f97316"]').length).toBe(1)
  })

  it('does not show orange dot when lastMove is null', () => {
    const board = makeBoard([{ row: 7, col: 7, player: 1 }])
    const { container } = render(
      <GomokuBoard board={board} {...defaultProps} />,
    )
    expect(container.querySelectorAll('circle[fill="#f97316"]').length).toBe(0)
  })
})

describe('GomokuBoard — winning line highlight', () => {
  it('highlights 5 winning stones with green rings', () => {
    const board = makeBoard([
      { row: 7, col: 0, player: 1 },
      { row: 7, col: 1, player: 1 },
      { row: 7, col: 2, player: 1 },
      { row: 7, col: 3, player: 1 },
      { row: 7, col: 4, player: 1 },
    ])
    const winningLine: Position[] = [
      { row: 7, col: 0 },
      { row: 7, col: 1 },
      { row: 7, col: 2 },
      { row: 7, col: 3 },
      { row: 7, col: 4 },
    ]
    const { container } = render(
      <GomokuBoard
        board={board}
        onCellClick={() => {}}
        lastMove={{ row: 7, col: 4 }}
        winningLine={winningLine}
        disabled={true}
      />,
    )
    const greenRings = container.querySelectorAll(
      'circle[stroke="#22c55e"][fill="none"]',
    )
    expect(greenRings.length).toBe(5)
  })
})

describe('GomokuBoard — responsive layout', () => {
  it('has a viewBox attribute on the svg', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('viewBox')).not.toBeNull()
    expect(svg?.getAttribute('viewBox')).not.toBe('')
  })

  it('does not have a fixed width attribute on the svg', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    const svg = container.querySelector('svg')
    expect(svg?.hasAttribute('width')).toBe(false)
  })

  it('does not have a fixed height attribute on the svg', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    const svg = container.querySelector('svg')
    expect(svg?.hasAttribute('height')).toBe(false)
  })

  it('has the gomoku-board class on the wrapper div', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    expect(container.querySelector('.gomoku-board')).not.toBeNull()
  })

  it('has the gomoku-board__svg class on the svg', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    expect(container.querySelector('.gomoku-board__svg')).not.toBeNull()
  })

  it('has an aria-label on the svg for accessibility', () => {
    const { container } = render(
      <GomokuBoard board={createEmptyBoard()} {...defaultProps} />,
    )
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toBe('Gomoku game board')
  })
})