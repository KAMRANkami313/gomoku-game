import type { ToastItem, ToastType } from '../hooks/useToast'

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.type}`}
          onClick={() => onDismiss(t.id)}
        >
          <span className="toast__icon">{ICONS[t.type]}</span>
          <span className="toast__message">{t.message}</span>
        </div>
      ))}
    </div>
  )
}