import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('peerjs', () => {
  return {
    default: class MockPeer {
      on = vi.fn()
      destroy = vi.fn()
      connect = vi.fn(() => ({
        on: vi.fn(),
        send: vi.fn(),
        close: vi.fn(),
        open: false,
      }))
    },
  }
})

import { useOnlineMultiplayer } from './useOnlineMultiplayer'

describe('useOnlineMultiplayer', () => {
  const onMessage = vi.fn()
  const onConnected = vi.fn()
  const onDisconnected = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('starts in idle status', () => {
    const { result } = renderHook(() =>
      useOnlineMultiplayer({
        onMessage,
        onConnected,
        onDisconnected,
      }),
    )
    expect(result.current.status).toBe('idle')
    expect(result.current.roomCode).toBe('')
    expect(result.current.isHost).toBe(false)
  })

  it('sets hosting status when host is called', () => {
    const { result } = renderHook(() =>
      useOnlineMultiplayer({
        onMessage,
        onConnected,
        onDisconnected,
      }),
    )
    act(() => result.current.host('ABC123'))
    expect(result.current.status).toBe('hosting')
    expect(result.current.roomCode).toBe('ABC123')
    expect(result.current.isHost).toBe(true)
  })

  it('sets joining status when join is called', () => {
    const { result } = renderHook(() =>
      useOnlineMultiplayer({
        onMessage,
        onConnected,
        onDisconnected,
      }),
    )
    act(() => result.current.join('ABC123'))
    expect(result.current.status).toBe('joining')
    expect(result.current.roomCode).toBe('ABC123')
    expect(result.current.isHost).toBe(false)
  })

  it('resets to idle on disconnect', () => {
    const { result } = renderHook(() =>
      useOnlineMultiplayer({
        onMessage,
        onConnected,
        onDisconnected,
      }),
    )
    act(() => result.current.host('ABC123'))
    expect(result.current.status).toBe('hosting')
    act(() => result.current.disconnect())
    expect(result.current.status).toBe('idle')
    expect(result.current.roomCode).toBe('')
    expect(result.current.isHost).toBe(false)
  })

  it('send does not throw when not connected', () => {
    const { result } = renderHook(() =>
      useOnlineMultiplayer({
        onMessage,
        onConnected,
        onDisconnected,
      }),
    )
    expect(() =>
      result.current.send({ type: 'move', row: 7, col: 7, player: 1 }),
    ).not.toThrow()
  })
})