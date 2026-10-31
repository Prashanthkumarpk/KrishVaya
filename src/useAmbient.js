import { useEffect, useRef, useState } from 'react'
import { asset } from './lib.js'

const SRC = asset('audio/ambient.mp3')
const FADE_MS = 2000
const LEVEL = 0.45

// Optional ambient sound. Off by default, never autoplays, and quietly does nothing
// if public/audio/ambient.mp3 has not been added.
export function useAmbient(notify) {
  const [on, setOn] = useState(false)
  const audioRef = useRef(null)
  const fadeRef = useRef(0)
  const busyRef = useRef(false)

  const fadeTo = (target, done) => {
    clearInterval(fadeRef.current)
    const audio = audioRef.current
    const from = audio.volume
    const t0 = performance.now()
    fadeRef.current = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / FADE_MS)
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * k))
      if (k >= 1) {
        clearInterval(fadeRef.current)
        if (done) done()
      }
    }, 50)
  }

  const toggle = async () => {
    if (busyRef.current) return
    if (on) {
      setOn(false)
      fadeTo(0, () => audioRef.current.pause())
      return
    }
    busyRef.current = true
    try {
      if (!audioRef.current) {
        const head = await fetch(SRC, { method: 'HEAD' })
        const type = head.headers.get('content-type') || ''
        if (!head.ok || !type.startsWith('audio')) throw new Error('missing')
        const audio = new Audio(SRC)
        audio.loop = true
        audio.volume = 0
        audioRef.current = audio
      }
      await audioRef.current.play()
      setOn(true)
      fadeTo(LEVEL)
    } catch {
      audioRef.current = null
      notify('Ambient sound is not available yet.')
    } finally {
      busyRef.current = false
    }
  }

  useEffect(
    () => () => {
      clearInterval(fadeRef.current)
      if (audioRef.current) audioRef.current.pause()
    },
    [],
  )

  return { on, toggle }
}
