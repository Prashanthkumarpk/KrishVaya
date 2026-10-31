import { MOOD_ICONS } from './Icons.jsx'
import SoftImg from './SoftImg.jsx'
import { asset } from '../lib.js'

function Tile({ feeling, selected, onPick, onHover }) {
  const Icon = MOOD_ICONS[feeling.id]
  const aim = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    onHover({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }
  return (
    <button
      type="button"
      className="tile"
      aria-pressed={selected}
      style={{ '--rim': feeling.rim, '--mood': feeling.tint }}
      onClick={() => onPick(feeling.id)}
      onPointerEnter={aim}
      onPointerLeave={() => onHover(null)}
      onFocus={aim}
      onBlur={() => onHover(null)}
    >
      <span className="tile-art" aria-hidden="true">
        <Icon size={64} className="tile-glyph" />
      </span>
      <SoftImg
        src={asset(feeling.image)}
        alt={`${feeling.label}: an illustration for feeling ${feeling.label.toLowerCase()}`}
        width={480}
        height={600}
        className="tile-img"
        lazy
        fade
      />
      <span className="tile-label">
        <Icon size={20} className="tile-icon" />
        <span className="tile-name">
          {feeling.label}
          <span className="tile-sa" lang="sa" aria-hidden="true">{feeling.sanskrit}</span>
        </span>
      </span>
    </button>
  )
}

export default function Tiles({ feelings, selectedId, onPick, onHover }) {
  return (
    <section className="feelings" aria-labelledby="feel-heading">
      <h2 className="feel-heading" id="feel-heading">
        <span>How are you feeling today?</span>
      </h2>
      <div className="tiles">
        {feelings.map((f) => (
          <Tile key={f.id} feeling={f} selected={selectedId === f.id} onPick={onPick} onHover={onHover} />
        ))}
      </div>
    </section>
  )
}
