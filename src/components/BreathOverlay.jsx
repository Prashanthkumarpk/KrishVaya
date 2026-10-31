import { useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks.js'

const TOTAL_MS = 60000
const IN_MS = 4000
const CYCLE_MS = 10000 // 4s in, 6s out

const clock = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `0:${String(s).padStart(2, '0')}`
}

export default function BreathOverlay({ slip, onDone, onFinish }) {
  const ref = useFocusTrap(onDone)
  const [elapsed, setElapsed] = useState(0)
  const finished = useRef(false)
  const finishRef = useRef(onFinish)
  finishRef.current = onFinish

  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const e = Date.now() - start
      setElapsed(Math.min(e, TOTAL_MS))
      if (e >= TOTAL_MS && !finished.current) {
        finished.current = true
        clearInterval(timer)
        finishRef.current()
      }
    }, 200)
    return () => clearInterval(timer)
  }, [])

  const complete = elapsed >= TOTAL_MS
  const inhale = elapsed % CYCLE_MS < IN_MS
  const word = complete ? 'Well done' : inhale ? 'Breathe in' : 'Breathe out'

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="breath-title" ref={ref} tabIndex={-1}>
      <h2 id="breath-title" className="overlay-title">One minute to breathe</h2>

      <div className="breath-stage" aria-hidden="true">
        <div className={`breath-circle${complete ? ' is-done' : ''}`} />
        <span className="breath-word">{word}</span>
      </div>
      <p className="breath-time" aria-hidden="true">{complete ? 'Complete' : clock(TOTAL_MS - elapsed)}</p>

      <div className="overlay-action">
        <p className="overlay-label">Today, one thing</p>
        <p className="overlay-text">{slip.action}</p>
      </div>

      <button type="button" className="apply-btn overlay-done" onClick={onDone}>
        Done
      </button>
      {!complete && <p className="overlay-hint">Stay for the full minute to save this as today&rsquo;s intention.</p>}
    </div>
  )
}
