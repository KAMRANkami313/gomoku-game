import { useCallback, useState } from 'react'
import { loadState, saveState } from '../lib/storage'
import { playSound, unlockAudio } from '../lib/sound'
import type { SoundType } from '../lib/sound'

const STORAGE_KEY = 'sound-enabled'

export function useSound() {
  const [enabled, setEnabled] = useState<boolean>(() =>
    loadState<boolean>(STORAGE_KEY, true),
  )

  const play = useCallback(
    (type: SoundType) => {
      if (!enabled) return
      playSound(type)
    },
    [enabled],
  )

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      if (next) {
        unlockAudio()
        playSound('place')
      }
      saveState(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { enabled, play, toggle }
}