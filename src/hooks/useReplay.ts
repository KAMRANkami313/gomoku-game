import { useCallback, useEffect, useRef, useState } from 'react'
import type { MoveRecord } from '../lib/types'

export function useReplay(moves: MoveRecord[], isComplete: boolean) {
  const [userActive, setUserActive] = useState(false)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalSteps = moves.length
  const active = userActive && isComplete

  const enter = useCallback(() => {
    if (!isComplete || totalSteps === 0) return
    setUserActive(true)
    setStep(totalSteps)
  }, [isComplete, totalSteps])

  const exit = useCallback(() => {
    setUserActive(false)
    setPlaying(false)
    setStep(0)
  }, [])

  const goPrev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const goNext = useCallback(() => {
    setStep((s) => Math.min(totalSteps, s + 1))
  }, [totalSteps])

  const goToStart = useCallback(() => {
    setStep(0)
    setPlaying(false)
  }, [])

  const goToEnd = useCallback(() => {
    setStep(totalSteps)
    setPlaying(false)
  }, [totalSteps])

  const togglePlay = useCallback(() => {
    setStep((s) => {
      if (s >= totalSteps) return 0
      return s
    })
    setPlaying((p) => !p)
  }, [totalSteps])

  useEffect(() => {
    if (!active || !playing) return
    if (step >= totalSteps) return

    timerRef.current = setTimeout(() => {
      const nextStep = Math.min(totalSteps, step + 1)
      setStep(nextStep)
      if (nextStep >= totalSteps) {
        setPlaying(false)
      }
    }, 600)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, playing, step, totalSteps])

  if (!active) {
    return {
      active: false as const,
      step: 0,
      playing: false,
      enter,
      exit,
      goPrev,
      goNext,
      goToStart,
      goToEnd,
      togglePlay,
    }
  }

  return {
    active: true as const,
    step,
    playing,
    enter,
    exit,
    goPrev,
    goNext,
    goToStart,
    goToEnd,
    togglePlay,
  }
}