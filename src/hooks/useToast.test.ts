import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from './useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with no toasts', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toHaveLength(0)
  })

  it('adds a toast when show() is called', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.show('Hello', 'info')
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('Hello')
    expect(result.current.toasts[0].type).toBe('info')
  })

  it('auto-dismisses after 3 seconds', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.show('Temporary', 'success')
    })
    expect(result.current.toasts).toHaveLength(1)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.toasts).toHaveLength(0)
  })

  it('dismiss removes a specific toast by id', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.show('First', 'info')
      result.current.show('Second', 'error')
    })
    expect(result.current.toasts).toHaveLength(2)
    const firstId = result.current.toasts[0].id
    act(() => {
      result.current.dismiss(firstId)
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('Second')
  })

  it('defaults to info type', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.show('No type specified')
    })
    expect(result.current.toasts[0].type).toBe('info')
  })
})