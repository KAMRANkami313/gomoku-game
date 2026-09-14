import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { OnlineDialog } from './OnlineDialog'

const defaultProps = {
  open: true,
  onClose: () => {},
  status: 'idle' as const,
  roomCode: '',
  isHost: false,
  onHost: () => {},
  onJoin: () => {},
  onDisconnect: () => {},
}

describe('OnlineDialog', () => {
  it('renders when open', () => {
    const { getByText } = render(<OnlineDialog {...defaultProps} />)
    expect(getByText('Online Multiplayer')).toBeTruthy()
  })

  it('does not render when closed', () => {
    const { queryByText } = render(
      <OnlineDialog {...defaultProps} open={false} />,
    )
    expect(queryByText('Online Multiplayer')).toBeNull()
  })

  it('shows create/join options when idle', () => {
    const { getByText, getByPlaceholderText } = render(
      <OnlineDialog {...defaultProps} status="idle" />,
    )
    expect(getByText('Create Room')).toBeTruthy()
    expect(getByPlaceholderText('6-char code')).toBeTruthy()
    expect(getByText('Join')).toBeTruthy()
  })

  it('calls onHost when Create Room clicked', () => {
    const onHost = vi.fn()
    const { getByText } = render(
      <OnlineDialog {...defaultProps} onHost={onHost} />,
    )
    fireEvent.click(getByText('Create Room'))
    expect(onHost).toHaveBeenCalled()
  })

  it('disables Join button when code is too short', () => {
    const { getByText } = render(
      <OnlineDialog {...defaultProps} status="idle" />,
    )
    const joinBtn = getByText('Join').closest('button')
    expect(joinBtn?.disabled).toBe(true)
  })

  it('shows room code when connected', () => {
    const { getByText } = render(
      <OnlineDialog
        {...defaultProps}
        status="connected"
        roomCode="ABC123"
        isHost={true}
      />,
    )
    expect(getByText('ABC123')).toBeTruthy()
    expect(getByText(/Connected/)).toBeTruthy()
  })

  it('shows waiting message when hosting', () => {
    const { getByText } = render(
      <OnlineDialog {...defaultProps} status="hosting" />,
    )
    expect(getByText('Waiting for opponent to join…')).toBeTruthy()
  })

  it('shows connecting message when joining', () => {
    const { getByText } = render(
      <OnlineDialog {...defaultProps} status="joining" />,
    )
    expect(getByText('Connecting…')).toBeTruthy()
  })

  it('shows error message on error status', () => {
    const { getByText } = render(
      <OnlineDialog {...defaultProps} status="error" />,
    )
    expect(getByText(/Connection failed/)).toBeTruthy()
  })

  it('calls onDisconnect when Leave Game clicked', () => {
    const onDisconnect = vi.fn()
    const { getByText } = render(
      <OnlineDialog
        {...defaultProps}
        status="connected"
        roomCode="ABC123"
        onDisconnect={onDisconnect}
      />,
    )
    fireEvent.click(getByText('Leave Game'))
    expect(onDisconnect).toHaveBeenCalled()
  })

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <OnlineDialog {...defaultProps} onClose={onClose} />,
    )
    fireEvent.click(container.querySelector('.dialog-overlay')!)
    expect(onClose).toHaveBeenCalled()
  })
})