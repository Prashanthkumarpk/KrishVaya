import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_SLIP_ID, FEELINGS, QUOTES } from './data/slips.js'
import { asset, findSlip, pickSlip, readStore, todayKey, writeStore } from './lib.js'
import { useReducedMotion } from './hooks.js'
import { useAmbient } from './useAmbient.js'
import Glitter from './components/Glitter.jsx'
import Header from './components/Header.jsx'
import GuidanceCard from './components/GuidanceCard.jsx'
import Tiles from './components/Tiles.jsx'
import FloatingQuote from './components/FloatingQuote.jsx'
import AboutModal from './components/AboutModal.jsx'
import BreathOverlay from './components/BreathOverlay.jsx'
import SoftImg from './components/SoftImg.jsx'
import { HeartIcon } from './components/Icons.jsx'

const THEME_KEY = 'krishvaya.theme'
const INTENTION_KEY = 'krishvaya.intention'

export default function App() {
  const initial = findSlip(DEFAULT_SLIP_ID)
  const reduced = useReducedMotion()

  const [feelingId, setFeelingId] = useState(null)
  const [tint, setTint] = useState(null)
  const [slip, setSlip] = useState(initial.slip)
  const [slipFeeling, setSlipFeeling] = useState(initial.feeling.id)
  const [phase, setPhase] = useState('idle')
  const [reveal, setReveal] = useState(0)
  const [theme, setTheme] = useState(() => (readStore(THEME_KEY, 'dusk') === 'day' ? 'day' : 'dusk'))
  const [intention, setIntention] = useState(() => {
    const saved = readStore(INTENTION_KEY)
    return saved && saved.date === todayKey() && saved.action ? saved : null
  })
  const [about, setAbout] = useState(false)
  const [breathSlip, setBreathSlip] = useState(null)
  const [toast, setToast] = useState('')

  const stageRef = useRef(null)
  const cardRef = useRef(null)
  const feelingsRef = useRef(null)
  const glitterRef = useRef(null)
  const timers = useRef([])
  const toastTimer = useRef(0)

  const notify = useCallback((message) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 5000)
  }, [])

  const ambient = useAmbient(notify)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStore(THEME_KEY, theme)
  }, [theme])

  // While a dialog is open, the page behind it is inert for keyboard and screen readers.
  const dialogOpen = about || breathSlip !== null
  useEffect(() => {
    stageRef.current?.toggleAttribute('inert', dialogOpen)
    document.body.style.overflow = dialogOpen ? 'hidden' : ''
  }, [dialogOpen])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      clearTimeout(toastTimer.current)
    },
    [],
  )

  // Old parchment rolls up, new one unrolls, glitter blooms from the card.
  const swapSlip = (nextSlip, nextFeeling) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('out')
    timers.current.push(
      setTimeout(() => {
        setSlip(nextSlip)
        setSlipFeeling(nextFeeling)
        setReveal((n) => n + 1)
        setPhase('in')
        glitterRef.current?.burst(cardRef.current?.getBoundingClientRect())
        timers.current.push(setTimeout(() => setPhase('idle'), reduced ? 700 : 1250))
      }, reduced ? 350 : 600),
    )
  }

  // On stacked layouts the card can be off-screen, so bring it into view after a choice.
  const showCard = () => {
    if (!window.matchMedia('(max-width: 1100px)').matches) return
    cardRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const showFeelings = () => {
    feelingsRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const pickFeeling = (id) => {
    const feeling = FEELINGS.find((f) => f.id === id)
    setFeelingId(id)
    setTint(feeling.tint)
    swapSlip(pickSlip(id, slip.id), id)
    showCard()
    timers.current.push(setTimeout(() => glitterRef.current?.release(), 2500))
  }

  const drawAnother = () => swapSlip(pickSlip(slipFeeling, slip.id), slipFeeling)

  const hoverTile = (point) => {
    if (point) glitterRef.current?.attract(point.x, point.y)
    else glitterRef.current?.release()
  }

  const finishBreathing = () => {
    const feeling = FEELINGS.find((f) => f.id === slipFeeling)
    const saved = {
      date: todayKey(),
      id: breathSlip.id,
      ref: breathSlip.ref,
      feeling: feeling ? feeling.id : null,
      quote: breathSlip.quote,
      action: breathSlip.action,
    }
    writeStore(INTENTION_KEY, saved)
    setIntention(saved)
    notify('Intention saved')
  }

  // Today's intention leads the floating quote, so the saved slip has a visible home.
  const quotes = intention ? [`Today's intention: ${intention.action}`, ...QUOTES] : QUOTES

  return (
    <>
      <div className="stage" ref={stageRef}>
        <div className="hero">
          <div className="hero-frame">
            <SoftImg
              src={asset('images/hero.webp')}
              alt="Krishna speaking to Arjuna on the chariot at dusk, with the armies of Kurukshetra in the distance"
              width={1920}
              height={1080}
              className="hero-img"
              fade
            />
          </div>
          <h1 className="hero-brand">KrishVaya</h1>
          <p className="hero-tagline" aria-hidden="true">Guidance for Every Emotion</p>
        </div>
        <div className="shade" aria-hidden="true" />
        <div className="tint" style={{ backgroundColor: tint || '#e6b34a', opacity: tint ? undefined : 0 }} aria-hidden="true" />
        <div className="rays" aria-hidden="true" />
        <Glitter ref={glitterRef} />

        <Header
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'day' ? 'dusk' : 'day'))}
          onAbout={() => setAbout(true)}
          audioOn={ambient.on}
          onToggleAudio={ambient.toggle}
        />

        <main className="main">
          <GuidanceCard
            ref={cardRef}
            slip={slip}
            phase={phase}
            reveal={reveal}
            onApply={() => setBreathSlip(slip)}
            onDraw={drawAnother}
            onChoose={showFeelings}
          />
          <FloatingQuote quotes={quotes} />
        </main>

        <Tiles ref={feelingsRef} feelings={FEELINGS} selectedId={feelingId} onPick={pickFeeling} onHover={hoverTile} />

        <footer className="footer">
          <p className="foot-left">
            <HeartIcon size={16} /> A journey of wisdom, for a peaceful you
          </p>
          <p className="foot-mid" lang="sa">|| श्रीमद्भगवद्गीता ||</p>
          <p className="foot-right">KrishVaya, drawn from the Bhagavad Gita</p>
        </footer>
      </div>

      {about && <AboutModal onClose={() => setAbout(false)} />}
      {breathSlip && (
        <BreathOverlay slip={breathSlip} onDone={() => setBreathSlip(null)} onFinish={finishBreathing} />
      )}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && <p className="toast">{toast}</p>}
      </div>
    </>
  )
}
