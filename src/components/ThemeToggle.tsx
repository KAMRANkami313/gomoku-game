import { Sun, Moon, Monitor } from 'lucide-react'
import type { ThemeMode } from '../hooks/useTheme'

interface ThemeToggleProps {
  mode: ThemeMode
  onToggle: () => void
}

const NEXT_LABEL: Record<ThemeMode, string> = {
  light: 'Light (click for Dark)',
  dark: 'Dark (click for System)',
  system: 'System (click for Light)',
}

function Icon({ mode }: { mode: ThemeMode }) {
  if (mode === 'light') return <Sun size={18} />
  if (mode === 'dark') return <Moon size={18} />
  return <Monitor size={18} />
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={NEXT_LABEL[mode]}
      title={NEXT_LABEL[mode]}
    >
      <Icon mode={mode} />
    </button>
  )
}