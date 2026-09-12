import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ReplayBar } from './ReplayBar'

const defaultProps = {
  step: 3,
  total: 10,
  playing: false,
  onPrev: () => {},
  onNext: () => {},
  onFirst: () => {},
  onLast: () => {},
  onTogglePlay: () => {},
  onExit: () => {},
}

describe('ReplayBar', () => {
  it('renders all control buttons', () => {
    const { getByLabelText } = render(<ReplayBar {...defaultProps} />)
    expect(getByLabelText('First move')).toBeTruthy()
    expect(getByLabelText('Previous move')).toBeTruthy()
    expect(getByLabelText('Play')).toBeTruthy()
    expect(getByLabelText('Next move')).toBeTruthy()
    expect(getByLabelText('Last move')).toBeTruthy()
    expect(getByLabelText('Exit replay')).toBeTruthy()
  })

  it('shows step count', () => {
    const { getByText } = render(<ReplayBar {...defaultProps} />)
    expect(getByText('3 / 10')).toBeTruthy()
  })

  it('shows pause icon when playing', () => {
    const { getByLabelText } = render(
      <ReplayBar {...defaultProps} playing={true} />,
    )
    expect(getByLabelText('Pause')).toBeTruthy()
  })

  it('shows play icon when not playing', () => {
    const { getByLabelText } = render(<ReplayBar {...defaultProps} />)
    expect(getByLabelText('Play')).toBeTruthy()
  })

  it('calls onFirst when first button clicked', () => {
    const onFirst = vi.fn()
    const { getByLabelText } = render(
      <ReplayBar {...defaultProps} onFirst={onFirst} />,
    )
    fireEvent.click(getByLabelText('First move'))
    expect(onFirst).toHaveBeenCalled()
  })

  it('calls onNext when next button clicked', () => {
    const onNext = vi.fn()
    const { getByLabelText } = render(
      <ReplayBar {...defaultProps} onNext={onNext} />,
    )
    fireEvent.click(getByLabelText('Next move'))
    expect(onNext).toHaveBeenCalled()
  })

  it('calls onExit when exit button clicked', () => {
    const onExit = vi.fn()
    const { getByLabelText } = render(
      <ReplayBar {...defaultProps} onExit={onExit} />,
    )
    fireEvent.click(getByLabelText('Exit replay'))
    expect(onExit).toHaveBeenCalled()
  })

  it('disables first button when step is 0', () => {
    const { getByLabelText } = render(
      <ReplayBar {...defaultProps} step={0} />,
    )
    expect(getByLabelText('First move').closest('button')?.disabled).toBe(true)
  })

  it('disables last button when at end', () => {
    const { getByLabelText } = render(
      <ReplayBar {...defaultProps} step={10} total={10} />,
    )
    expect(getByLabelText('Last move').closest('button')?.disabled).toBe(true)
  })
})