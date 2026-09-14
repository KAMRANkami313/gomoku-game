import { X, Grid3x3, Sparkles } from 'lucide-react'
import { BOARD_SIZES } from '../lib/types'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
  boardSize: number
  onBoardSizeChange: (size: number) => void
  animationsEnabled: boolean
  onAnimationsChange: (enabled: boolean) => void
}

export function SettingsDialog({
  open,
  onClose,
  boardSize,
  onBoardSizeChange,
  animationsEnabled,
  onAnimationsChange,
}: SettingsDialogProps) {
  if (!open) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="dialog__header">
          <h2 className="dialog__title">Settings</h2>
          <button
            type="button"
            className="dialog__close"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        <div className="dialog__body">
          <div className="dialog__section">
            <div className="dialog__section-label">
              <Grid3x3 size={14} />
              Board Size
            </div>
            <div className="dialog__size-buttons">
              {BOARD_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={
                    'dialog__size-btn ' +
                    (boardSize === size
                      ? 'dialog__size-btn--active'
                      : 'dialog__size-btn--inactive')
                  }
                  onClick={() => onBoardSizeChange(size)}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
            <p className="dialog__hint">
              Changing the board size will start a new game.
            </p>
          </div>

          <div className="dialog__section">
            <div className="dialog__section-label">
              <Sparkles size={14} />
              Animations
            </div>
            <label className="dialog__toggle">
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => onAnimationsChange(e.target.checked)}
              />
              <span>Enable stone placement animations</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}