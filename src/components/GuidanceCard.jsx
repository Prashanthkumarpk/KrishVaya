import { forwardRef } from 'react'
import { BulbIcon, LotusIcon, RocketIcon } from './Icons.jsx'

// phase: 'idle' | 'out' (rolling up) | 'in' (unrolling). `reveal` changes on every new slip
// so the lines remount and fade in again, 120ms apart.
const GuidanceCard = forwardRef(function GuidanceCard({ slip, phase, reveal, onApply, onDraw, onChoose }, ref) {
  const line = (i) => ({ '--i': i })
  return (
    <section className="card" ref={ref} aria-label="Gita guidance">
      <div className="card-lotus">
        <LotusIcon />
      </div>
      <div className={`sheet sheet-${phase}`}>
        <div className="sheet-body" aria-live="polite" aria-atomic="false">
          <h2 className="card-heading">Your Gita Guidance</h2>
          <div key={`${slip.id}-${reveal}`}>
            <blockquote className="verse line" style={line(0)}>
              <p className="verse-quote">{slip.quote}</p>
              <footer className="verse-ref">Bhagavad Gita {slip.ref}</footer>
            </blockquote>
            <p className="sanskrit line" lang="sa" style={line(1)}>
              {slip.devanagari}
            </p>
            <p className="iast line" lang="sa-Latn" style={line(2)}>
              {slip.iast}
            </p>
            <hr className="card-rule line" style={line(3)} />
            <h3 className="card-sub line" style={line(4)}>
              <BulbIcon size={18} /> What It Means?
            </h3>
            <p className="card-text line" style={line(5)}>
              {slip.meaning}
            </p>
            <h3 className="card-sub line" style={line(6)}>
              <RocketIcon size={18} /> What You Should Do?
            </h3>
            <p className="card-text line" style={line(7)}>
              {slip.action}
            </p>
          </div>
        </div>
        <div className="card-foot">
          <button type="button" className="apply-btn" onClick={onApply}>
            Apply This Wisdom
          </button>
          <button type="button" className="text-link" onClick={onDraw}>
            Draw another
          </button>
          <button type="button" className="text-link choose-link" onClick={onChoose}>
            Choose another feeling
          </button>
        </div>
      </div>
    </section>
  )
})

export default GuidanceCard
