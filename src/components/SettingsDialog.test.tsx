import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SettingsDialog } from './SettingsDialog'

const defaultProps = {
  open: true,
  onClose: () => {},
  boardSize: 15,
  onBoardSizeChange: () => {},
  animationsEnabled: true,
  onAnimationsChange: () => {},
}

describe('SettingsDialog', () => {
  it('renders when open is true', () => {
    const { getByText } = render(<SettingsDialog {...defaultProps} />)
    expect(getByText('Settings')).toBeTruthy()
  })

  it('does not render when open is false', () => {
    const { queryByText } = render(
      <SettingsDialog {...defaultProps} open={false} />,
    )
    expect(queryByText('Settings')).toBeNull()
  })

  it('renders all three board size options', () => {
    const { getByText } = render(<SettingsDialog {...defaultProps} />)
    expect(getByText('9×9')).toBeTruthy()
    expect(getByText('13×13')).toBeTruthy()
    expect(getByText('15×15')).toBeTruthy()
  })

  it('marks the active board size', () => {
    const { getByText } = render(
      <SettingsDialog {...defaultProps} boardSize={9} />,
    )
    const btn = getByText('9×9').closest('button')
    expect(btn?.className).toContain('dialog__size-btn--active')
  })

  it('calls onBoardSizeChange when a size is clicked', () => {
    const onBoardSizeChange = vi.fn()
    const { getByText } = render(
      <SettingsDialog {...defaultProps} onBoardSizeChange={onBoardSizeChange} />,
    )
    fireEvent.click(getByText('13×13'))
    expect(onBoardSizeChange).toHaveBeenCalledWith(13)
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    const { getByLabelText } = render(
      <SettingsDialog {...defaultProps} onClose={onClose} />,
    )
    fireEvent.click(getByLabelText('Close settings'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <SettingsDialog {...defaultProps} onClose={onClose} />,
    )
    fireEvent.click(container.querySelector('.dialog-overlay')!)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when dialog body is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <SettingsDialog {...defaultProps} onClose={onClose} />,
    )
    fireEvent.click(container.querySelector('.dialog')!)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onAnimationsChange when checkbox toggled', () => {
    const onAnimationsChange = vi.fn()
    const { container } = render(
      <SettingsDialog
        {...defaultProps}
        onAnimationsChange={onAnimationsChange}
      />,
    )
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement
    fireEvent.click(checkbox)
    expect(onAnimationsChange).toHaveBeenCalledWith(false)
  })
})