import { useEffect, useRef, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

// Moves focus into the dialog, keeps Tab inside it, closes on Esc, restores focus after.
export function useFocusTrap(onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const previous = document.activeElement
    const items = () => [...node.querySelectorAll(FOCUSABLE)]
    ;(items()[0] || node).focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const list = items()
      if (!list.length) {
        e.preventDefault()
        return
      }
      const first = list[0]
      const last = list[list.length - 1]
      if (!node.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous && previous.focus) previous.focus()
    }
  }, [])

  return ref
}
