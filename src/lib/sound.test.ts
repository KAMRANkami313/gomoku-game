import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { playSound, unlockAudio } from './sound'

describe('sound', () => {
  const originalAudioContext = window.AudioContext

  beforeEach(() => {
    window.AudioContext = vi.fn().mockImplementation(() => ({
      currentTime: 0,
      state: 'running',
      resume: vi.fn().mockResolvedValue(undefined),
      createOscillator: vi.fn(() => ({
        type: 'sine',
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      })),
      createGain: vi.fn(() => ({
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      })),
      destination: {},
    }))
  })

  afterEach(() => {
    window.AudioContext = originalAudioContext
  })

  it('playSound does not throw for place', () => {
    expect(() => playSound('place')).not.toThrow()
  })

  it('playSound does not throw for win', () => {
    expect(() => playSound('win')).not.toThrow()
  })

  it('playSound does not throw for loss', () => {
    expect(() => playSound('loss')).not.toThrow()
  })

  it('playSound does not throw for draw', () => {
    expect(() => playSound('draw')).not.toThrow()
  })

  it('unlockAudio does not throw', () => {
    expect(() => unlockAudio()).not.toThrow()
  })

  it('playSound gracefully handles missing AudioContext', () => {
    window.AudioContext = undefined as unknown as typeof AudioContext
    expect(() => playSound('place')).not.toThrow()
  })
})