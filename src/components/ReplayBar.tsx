import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
} from 'lucide-react'

interface ReplayBarProps {
  step: number
  total: number
  playing: boolean
  onPrev: () => void
  onNext: () => void
  onFirst: () => void
  onLast: () => void
  onTogglePlay: () => void
  onExit: () => void
}

export function ReplayBar({
  step,
  total,
  playing,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onTogglePlay,
  onExit,
}: ReplayBarProps) {
  return (
    <div className="replay-bar">
      <div className="replay-bar__controls">
        <button
          type="button"
          className="replay-bar__btn"
          onClick={onFirst}
          disabled={step === 0}
          aria-label="First move"
        >
          <ChevronFirst size={16} />
        </button>
        <button
          type="button"
          className="replay-bar__btn"
          onClick={onPrev}
          disabled={step === 0}
          aria-label="Previous move"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="replay-bar__btn replay-bar__btn--play"
          onClick={onTogglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          type="button"
          className="replay-bar__btn"
          onClick={onNext}
          disabled={step >= total}
          aria-label="Next move"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          className="replay-bar__btn"
          onClick={onLast}
          disabled={step >= total}
          aria-label="Last move"
        >
          <ChevronLast size={16} />
        </button>
        <button
          type="button"
          className="replay-bar__btn replay-bar__btn--exit"
          onClick={onExit}
          aria-label="Exit replay"
        >
          <X size={16} />
        </button>
      </div>
      <div className="replay-bar__progress">
        <span className="replay-bar__step">
          {step} / {total}
        </span>
        <div className="replay-bar__track">
          <div
            className="replay-bar__fill"
            style={{ width: total === 0 ? '0%' : `${(step / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}