import { MoonIcon, SpeakerOffIcon, SpeakerOnIcon, SunIcon } from './Icons.jsx'
import SoftImg from './SoftImg.jsx'
import { asset } from '../lib.js'

export default function Header({ theme, onToggleTheme, onAbout, audioOn, onToggleAudio }) {
  const day = theme === 'day'
  return (
    <header className="header">
      <div className="brand">
        <span className="emblem">
          <span className="emblem-glyph" lang="sa" aria-hidden="true">ॐ</span>
          <SoftImg src={asset('images/om.svg')} alt="" width={56} height={56} className="emblem-img" />
        </span>
        <span className="brand-divider" aria-hidden="true" />
        <div className="brand-text">
          <h1 className="brand-title">KrishVaya</h1>
          <p className="brand-sub">Guidance for Every Emotion</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="round-btn"
          onClick={onToggleAudio}
          aria-label={audioOn ? 'Turn ambient sound off' : 'Turn ambient sound on'}
        >
          {audioOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </button>
        <button type="button" className="pill-btn" onClick={onAbout} aria-haspopup="dialog">
          About
        </button>
        <button
          type="button"
          className="round-btn"
          onClick={onToggleTheme}
          aria-label={day ? 'Switch to the dusk theme' : 'Switch to the softer day theme'}
        >
          {day ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  )
}
