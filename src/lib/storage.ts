const PREFIX = 'gomoku:'

export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // no-op: storage may be full or unavailable (private browsing)
  }
}

export function clearState(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // no-op
  }
}