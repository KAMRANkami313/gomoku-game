import { Bot, Users } from 'lucide-react'
import type { GameMode } from '../lib/types'

interface ModeSelectorProps {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  disabled: boolean
}

export function ModeSelector({ mode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <button
        type="button"
        className={
          'mode-selector__btn ' +
          (mode === 'ai' ? 'mode-selector__btn--active' : 'mode-selector__btn--inactive')
        }
        onClick={() => onModeChange('ai')}
        disabled={disabled}
      >
        <Bot size={16} />
        vs AI
      </button>
      <button
        type="button"
        className={
          'mode-selector__btn ' +
          (mode === 'pvp' ? 'mode-selector__btn--active' : 'mode-selector__btn--inactive')
        }
        onClick={() => onModeChange('pvp')}
        disabled={disabled}
      >
        <Users size={16} />
        2 Players
      </button>
    </div>
  )
}