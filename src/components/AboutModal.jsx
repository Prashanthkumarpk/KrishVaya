import { useFocusTrap } from '../hooks.js'

export default function AboutModal({ onClose }) {
  const ref = useFocusTrap(onClose)
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        ref={ref}
        tabIndex={-1}
      >
        <h2 id="about-title" className="modal-title">About KrishVaya</h2>
        <p>
          KrishVaya is a quiet place to pause. Pick the feeling closest to yours and you will get one verse from the
          Bhagavad Gita, what it can mean in everyday words, and one small thing to do today.
        </p>
        <p>
          The Sanskrit is from the Gita. The short lines, explanations and actions are written fresh for this site
          and are not taken from any translation or commentary.
        </p>
        <p className="modal-note">
          This is spiritual reflection, not a replacement for professional help. If you are struggling, please talk
          to a doctor, a counsellor or someone you trust. If you are in danger, contact your local emergency number.
        </p>
        <button type="button" className="apply-btn modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
