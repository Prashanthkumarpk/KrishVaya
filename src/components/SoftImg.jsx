import { useEffect, useRef, useState } from 'react'

// An <img> that quietly removes itself if the file is missing, so there is never a
// broken-image icon. The parent draws the CSS/SVG fallback underneath it.
export default function SoftImg({ src, alt, width, height, className, lazy = false, fade = false }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setFailed(false)
    setLoaded(false)
  }, [src])

  useEffect(() => {
    const el = ref.current
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [src])

  if (failed) return null
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className || ''}${fade ? (loaded ? ' is-loaded' : ' is-loading') : ''}`}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  )
}
