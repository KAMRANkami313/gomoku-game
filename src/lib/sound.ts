export type SoundType = 'place' | 'win' | 'loss' | 'draw'

let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)()
    } catch {
      return null
    }
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }
  return audioContext
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  startTime: number,
  volume: number,
  type: OscillatorType = 'sine',
): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency

  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playSound(type: SoundType): void {
  const ctx = getContext()
  if (!ctx) return

  const now = ctx.currentTime

  if (type === 'place') {
    playTone(ctx, 440, 0.12, now, 0.25, 'sine')
    playTone(ctx, 220, 0.08, now + 0.005, 0.2, 'triangle')
    return
  }

  if (type === 'win') {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      playTone(ctx, freq, 0.2, now + i * 0.12, 0.2, 'sine')
    })
    return
  }

  if (type === 'loss') {
    playTone(ctx, 220, 0.3, now, 0.2, 'sawtooth')
    playTone(ctx, 110, 0.4, now + 0.1, 0.15, 'sawtooth')
    return
  }

  if (type === 'draw') {
    playTone(ctx, 330, 0.15, now, 0.15, 'sine')
    playTone(ctx, 247, 0.2, now + 0.1, 0.15, 'sine')
  }
}

export function unlockAudio(): void {
  getContext()
}