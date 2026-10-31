const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

const make = (children) =>
  function Icon({ size = 20, className }) {
    return (
      <svg {...base} width={size} height={size} className={className}>
        {children}
      </svg>
    )
  }

export const SunIcon = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
  </>,
)
export const MoonIcon = make(<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />)
export const SpeakerOnIcon = make(
  <>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11" />
  </>,
)
export const SpeakerOffIcon = make(
  <>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </>,
)
export const BulbIcon = make(
  <>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
  </>,
)
export const RocketIcon = make(
  <>
    <path d="M12 3c3.5 1.6 5.5 5 5.5 9l-2 3.5h-7L6.5 12c0-4 2-7.4 5.5-9z" />
    <circle cx="12" cy="10" r="1.7" />
    <path d="M9 15.5L7 19M15 15.5l2 3.5M12 16v4" />
  </>,
)
export const HeartIcon = make(
  <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
)

export function LotusIcon({ size = 44 }) {
  return (
    <svg viewBox="0 0 64 44" width={size} height={(size * 44) / 64} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lotusGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#e6b34a" />
        </linearGradient>
      </defs>
      <g fill="url(#lotusGold)" stroke="#8a5f12" strokeWidth="0.8" strokeLinejoin="round">
        <path d="M32 4c6 7 8 15 0 30-8-15-6-23 0-30z" />
        <path d="M30 36C21 32 14 24 14 13c8 3 14 11 16 23z" />
        <path d="M34 36c9-4 16-12 16-23-8 3-14 11-16 23z" />
        <path d="M27 38C16 37 7 30 4 20c9 0 18 6 23 18z" />
        <path d="M37 38c11-1 20-8 23-18-9 0-18 6-23 18z" />
        <path d="M22 40h20c-4 3-8 4-10 4s-6-1-10-4z" />
      </g>
    </svg>
  )
}

// One small outline glyph per feeling. Used on tiles and as the image fallback.
export const MOOD_ICONS = {
  happy: make(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14c1 1.6 2.2 2.3 3.5 2.3s2.5-.7 3.5-2.3" />
      <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="2.4" />
    </>,
  ),
  sad: make(<path d="M12 3.5c3.2 4.2 5.5 7.2 5.5 10.2a5.5 5.5 0 0 1-11 0c0-3 2.3-6 5.5-10.2z" />),
  lazy: make(
    <>
      <path d="M5 8h5l-5 6h5" />
      <path d="M13 4h4l-4 5h4" />
      <path d="M14 15.5a4 4 0 1 0 5 4.5 5 5 0 0 1-5-4.5z" transform="translate(-1 -1)" />
    </>,
  ),
  protection: make(
    <>
      <path d="M12 3l7 2.5v5.7c0 4.4-3 7.6-7 9.3-4-1.7-7-4.9-7-9.3V5.5z" />
      <path d="M9 12l2.3 2.3L15.5 10" />
    </>,
  ),
  anger: make(
    <path d="M12 3c.5 3-2.5 4.6-2.5 7.4 0 1 .5 1.8 1.2 2.3-.2-1.2.3-2.200 1.300-3 .5 2.200 3.500 3.100 3.500 6a4.500 4.500 0 0 1-9 0c0-2 1-3.200 2-4.200C8.500 9 12 7 12 3z" />,
  ),
  peace: make(
    <>
      <path d="M12 4c2.600 2.600 3.500 5.600 0 10-3.500-4.400-2.600-7.400 0-10z" />
      <path d="M11 14.500C8.500 14 6.500 12 6 9c2.600.2 4.500 2.200 5 5.500zM13 14.500c2.500-.5 4.500-2.500 5-5.500-2.600.2-4.500 2.200-5 5.500z" />
      <path d="M4 18c2.500-1.500 5-1.500 8 0s5.500 1.500 8 0" />
    </>,
  ),
  lonely: make(
    <>
      <circle cx="12" cy="7.500" r="3" />
      <path d="M6 20c0-3.500 2.700-6 6-6s6 2.500 6 6" />
    </>,
  ),
  anxious: make(
    <>
      <path d="M4 9c2-2 3-2 5 0s3 2 5 0 3-2 6 0" />
      <path d="M4 14c2-2 3-2 5 0s3 2 5 0 3-2 6 0" />
      <path d="M4 19c2-2 3-2 5 0" />
    </>,
  ),
}
