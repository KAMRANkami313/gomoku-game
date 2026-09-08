import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'
import { BOARD_SIZE } from '../lib/types'
import type { Board, Position } from '../lib/types'

interface GomokuBoardProps {
  board: Board
  onCellClick: (row: number, col: number) => void
  lastMove: Position | null
  winningLine: Position[] | null
  disabled: boolean
}

const CELL = 38
const PADDING = 24
const BOARD_PX = (BOARD_SIZE - 1) * CELL + PADDING * 2
const STONE_RADIUS = CELL * 0.42

const STAR_POINTS: ReadonlyArray<readonly [number, number]> = [
  [3, 3],
  [3, 11],
  [11, 3],
  [11, 11],
  [7, 7],
]

function GomokuBoardImpl({
  board,
  onCellClick,
  lastMove,
  winningLine,
  disabled,
}: GomokuBoardProps) {
  const winSet = useMemo(() => {
    const s = new Set<string>()
    if (winningLine) {
      for (const p of winningLine) s.add(`${p.row},${p.col}`)
    }
    return s
  }, [winningLine])

  const toXY = (row: number, col: number) => ({
    x: PADDING + col * CELL,
    y: PADDING + row * CELL,
  })

  const lines: ReactNode[] = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    const hStart = toXY(i, 0)
    const hEnd = toXY(i, BOARD_SIZE - 1)
    lines.push(
      <line
        key={`h-${i}`}
        x1={hStart.x}
        y1={hStart.y}
        x2={hEnd.x}
        y2={hEnd.y}
        stroke="#3d2817"
        strokeWidth={1}
      />,
    )
    const vStart = toXY(0, i)
    const vEnd = toXY(BOARD_SIZE - 1, i)
    lines.push(
      <line
        key={`v-${i}`}
        x1={vStart.x}
        y1={vStart.y}
        x2={vEnd.x}
        y2={vEnd.y}
        stroke="#3d2817"
        strokeWidth={1}
      />,
    )
  }

  const stars = STAR_POINTS.map(([r, c]) => {
    const { x, y } = toXY(r, c)
    return <circle key={`star-${r}-${c}`} cx={x} cy={y} r={3.4} fill="#3d2817" />
  })

  const stones: ReactNode[] = []
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const v = board[r][c]
      if (v === 0) continue
      const { x, y } = toXY(r, c)
      const isWinCell = winSet.has(`${r},${c}`)
      const isLast = !!lastMove && lastMove.row === r && lastMove.col === c

      stones.push(
        <g key={`stone-${r}-${c}`}>
          <circle
            cx={x}
            cy={y}
            r={STONE_RADIUS}
            fill={v === 1 ? 'url(#black-stone)' : 'url(#white-stone)'}
            stroke={
              isWinCell
                ? '#22c55e'
                : v === 1
                  ? 'rgba(0,0,0,0.45)'
                  : 'rgba(0,0,0,0.25)'
            }
            strokeWidth={isWinCell ? 2.5 : 0.5}
          />
          {isLast && (
            <circle
              cx={x}
              cy={y}
              r={STONE_RADIUS * 0.28}
              fill="#f97316"
              opacity={0.9}
            />
          )}
          {isWinCell && (
            <circle
              cx={x}
              cy={y}
              r={STONE_RADIUS + 2}
              fill="none"
              stroke="#22c55e"
              strokeWidth={2}
              opacity={0.9}
            />
          )}
        </g>,
      )
    }
  }

  const clickTargets: ReactNode[] = []
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const { x, y } = toXY(r, c)
      const isEmpty = board[r][c] === 0
      clickTargets.push(
        <rect
          key={`click-${r}-${c}`}
          x={x - CELL / 2}
          y={y - CELL / 2}
          width={CELL}
          height={CELL}
          fill="transparent"
          pointerEvents="all"
          data-testid={`cell-${r}-${c}`}
          style={{ cursor: isEmpty && !disabled ? 'pointer' : 'default' }}
          onClick={() => {
            if (disabled) return
            if (!isEmpty) return
            onCellClick(r, c)
          }}
        />,
      )
    }
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #e6c489 0%, #d4a96a 40%, #c08948 100%)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        userSelect: 'none',
        width: 'fit-content',
      }}
    >
      <svg
        width={BOARD_PX}
        height={BOARD_PX}
        viewBox={`0 0 ${BOARD_PX} ${BOARD_PX}`}
        style={{ display: 'block' }}
      >
        <defs>
          <radialGradient id="black-stone" cx="0.35" cy="0.35" r="0.7">
            <stop offset="0%" stopColor="#6a6a6a" />
            <stop offset="40%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="white-stone" cx="0.35" cy="0.35" r="0.7">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f2efe7" />
            <stop offset="100%" stopColor="#cfc8b3" />
          </radialGradient>
        </defs>
        {lines}
        {stars}
        {stones}
        {clickTargets}
      </svg>
    </div>
  )
}

export const GomokuBoard = memo(GomokuBoardImpl)