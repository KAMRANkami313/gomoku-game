import { useState } from 'react'
import { X, Wifi, Copy, Check } from 'lucide-react'
import type { ConnectionStatus } from '../lib/online'

interface OnlineDialogProps {
  open: boolean
  onClose: () => void
  status: ConnectionStatus
  roomCode: string
  isHost: boolean
  onHost: () => void
  onJoin: (code: string) => void
  onDisconnect: () => void
}

export function OnlineDialog({
  open,
  onClose,
  status,
  roomCode,
  isHost,
  onHost,
  onJoin,
  onDisconnect,
}: OnlineDialogProps) {
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleJoin = () => {
    if (joinCode.trim().length === 6) {
      onJoin(joinCode.trim().toUpperCase())
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Online multiplayer"
      >
        <div className="dialog__header">
          <h2 className="dialog__title">
            <Wifi size={18} />
            Online Multiplayer
          </h2>
          <button
            type="button"
            className="dialog__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="dialog__body">
          {status === 'idle' && (
            <div className="online-options">
              <button
                type="button"
                className="game-panel__btn game-panel__btn--solid"
                onClick={onHost}
              >
                Create Room
              </button>
              <div className="online-divider">or join with a code</div>
              <div className="online-join">
                <input
                  type="text"
                  className="online-input"
                  placeholder="6-char code"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
                <button
                  type="button"
                  className="game-panel__btn game-panel__btn--solid"
                  onClick={handleJoin}
                  disabled={joinCode.length !== 6}
                >
                  Join
                </button>
              </div>
            </div>
          )}

          {status === 'hosting' && (
            <div className="online-connecting">
              <div className="online-room-code">
                <span className="online-room-label">Share this room code</span>
                <div className="online-room-display">
                  <span className="online-code">{roomCode}</span>
                  <button
                    type="button"
                    className="online-copy-btn"
                    onClick={handleCopy}
                    aria-label="Copy room code"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="online-spinner" />
              <p>Waiting for opponent to join…</p>
              <button
                type="button"
                className="game-panel__btn game-panel__btn--outline"
                onClick={onDisconnect}
              >
                Cancel
              </button>
            </div>
          )}

          {status === 'joining' && (
            <div className="online-connecting">
              <div className="online-spinner" />
              <p>Connecting…</p>
              <button
                type="button"
                className="game-panel__btn game-panel__btn--outline"
                onClick={onDisconnect}
              >
                Cancel
              </button>
            </div>
          )}

          {status === 'connected' && (
            <div className="online-connected">
              <div className="online-room-code">
                <span className="online-room-label">Room Code</span>
                <div className="online-room-display">
                  <span className="online-code">{roomCode}</span>
                  {isHost && (
                    <button
                      type="button"
                      className="online-copy-btn"
                      onClick={handleCopy}
                      aria-label="Copy room code"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>
              <p className="online-status-text">
                Connected! {isHost ? 'You are Black.' : 'You are White.'}
              </p>
              <button
                type="button"
                className="game-panel__btn game-panel__btn--outline"
                onClick={onDisconnect}
              >
                Leave Game
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="online-error">
              <p>Connection failed. The room may not exist or is already full.</p>
              <button
                type="button"
                className="game-panel__btn game-panel__btn--solid"
                onClick={onDisconnect}
              >
                Try Again
              </button>
            </div>
          )}

          {status === 'disconnected' && (
            <div className="online-error">
              <p>Opponent disconnected.</p>
              <button
                type="button"
                className="game-panel__btn game-panel__btn--solid"
                onClick={onDisconnect}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}