import { FEELINGS, SLIPS } from './data/slips.js'

export const asset = (path) => `${import.meta.env.BASE_URL}${path}`

export function findSlip(id) {
  for (const feeling of FEELINGS) {
    const slip = (SLIPS[feeling.id] || []).find((s) => s.id === id)
    if (slip) return { slip, feeling }
  }
  return null
}

// Random slip for a feeling, never the one named in excludeId (when there is a choice).
export function pickSlip(feelingId, excludeId) {
  const pool = SLIPS[feelingId] || []
  const options = pool.length > 1 ? pool.filter((s) => s.id !== excludeId) : pool
  return options[Math.floor(Math.random() * options.length)]
}

export function readStore(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage can be blocked; the app works without it */
  }
}

export const todayKey = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
