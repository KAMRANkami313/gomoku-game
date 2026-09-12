import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { StatsPanel } from './StatsPanel'
import { EMPTY_STATS } from '../lib/stats'
import type { GameStats } from '../lib/stats'

const sampleStats: GameStats = {
  totalGames: 10,
  wins: 6,
  losses: 3,
  draws: 1,
  currentWinStreak: 2,
  bestWinStreak: 4,
  totalMovesInWins: 54,
}

describe('StatsPanel', () => {
  it('shows empty message when no games played', () => {
    const { getByText } = render(
      <StatsPanel stats={EMPTY_STATS} onReset={() => {}} />,
    )
    expect(
      getByText('No games played yet. Complete a game to see your stats.'),
    ).toBeTruthy()
  })

  it('shows total games when stats exist', () => {
    const { getByText } = render(
      <StatsPanel stats={sampleStats} onReset={() => {}} />,
    )
    expect(getByText('Games')).toBeTruthy()
    expect(getByText('10')).toBeTruthy()
  })

  it('shows win rate percentage', () => {
    const { getByText } = render(
      <StatsPanel stats={sampleStats} onReset={() => {}} />,
    )
    expect(getByText('Win Rate')).toBeTruthy()
    expect(getByText('60%')).toBeTruthy()
  })

  it('shows average moves per win', () => {
    const { getByText } = render(
      <StatsPanel stats={sampleStats} onReset={() => {}} />,
    )
    expect(getByText('Avg Moves/Win')).toBeTruthy()
    expect(getByText('9')).toBeTruthy()
  })

  it('shows wins, losses, and draws', () => {
    const { getByText } = render(
      <StatsPanel stats={sampleStats} onReset={() => {}} />,
    )
    expect(getByText('Wins')).toBeTruthy()
    expect(getByText('Losses')).toBeTruthy()
    expect(getByText('Draws')).toBeTruthy()
  })

  it('shows current and best streak', () => {
    const { getByText } = render(
      <StatsPanel stats={sampleStats} onReset={() => {}} />,
    )
    expect(getByText('Current Streak')).toBeTruthy()
    expect(getByText('Best Streak')).toBeTruthy()
  })

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn()
    const { getByText } = render(
      <StatsPanel stats={sampleStats} onReset={onReset} />,
    )
    fireEvent.click(getByText('Reset'))
    expect(onReset).toHaveBeenCalled()
  })
})