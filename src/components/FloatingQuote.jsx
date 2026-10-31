import { useEffect, useState } from 'react'

const FADE_MS = 1400
const EVERY_MS = 20000

export default function FloatingQuote({ quotes }) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(true)

  useEffect(() => {
    if (quotes.length < 2) return undefined
    let swap
    const timer = setInterval(() => {
      setShown(false)
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length)
        setShown(true)
      }, FADE_MS)
    }, EVERY_MS)
    return () => {
      clearInterval(timer)
      clearTimeout(swap)
    }
  }, [quotes.length])

  return (
    <aside className="quote-slot" aria-label="A thought for the moment">
      <div className="quote-float">
        <p className={`quote-glass${shown ? ' is-shown' : ''}`}>{quotes[index]}</p>
      </div>
    </aside>
  )
}
