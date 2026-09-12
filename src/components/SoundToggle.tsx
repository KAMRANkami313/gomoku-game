import { Volume2, VolumeX } from 'lucide-react'

interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={onToggle}
      aria-label={enabled ? 'Sound on (click to mute)' : 'Sound off (click to unmute)'}
      title={enabled ? 'Sound on (click to mute)' : 'Sound off (click to unmute)'}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  )
}