import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useReducedMotion } from '../hooks.js'

// Three depth layers: far specks are small, dim and slow; near specks are larger and quicker.
const LAYERS = [
  { share: 0.45, speed: 0.45, size: [1, 1.6], alpha: 0.55 },
  { share: 0.35, speed: 0.75, size: [1.4, 2.3], alpha: 0.75 },
  { share: 0.2, speed: 1.1, size: [2, 3], alpha: 0.95 },
]

const rand = (a, b) => a + Math.random() * (b - a)

function makeSprite() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  grad.addColorStop(0, 'rgba(255,244,205,1)')
  grad.addColorStop(0.16, 'rgba(255,215,119,0.9)')
  grad.addColorStop(0.42, 'rgba(230,179,74,0.28)')
  grad.addColorStop(1, 'rgba(230,179,74,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, s, s)
  return c
}

const particleCount = (w) => (w < 700 ? 40 : Math.round(40 + ((Math.min(w, 1920) - 700) / 1220) * 50))

function spawn(w, h, layerIndex, anywhere) {
  const layer = LAYERS[layerIndex]
  return {
    layer: layerIndex,
    baseX: rand(0, w),
    y: anywhere ? rand(0, h) : h + rand(10, 80),
    rise: rand(7, 16) * layer.speed,
    drift: rand(-3, 6) * layer.speed,
    amp: rand(10, 38),
    freq: rand(0.12, 0.32),
    phase: rand(0, Math.PI * 2),
    twFreq: rand(0.35, 0.9),
    twPhase: rand(0, Math.PI * 2),
    size: rand(layer.size[0], layer.size[1]),
    ox: 0,
    oy: 0,
  }
}

function buildField(w, h) {
  const n = particleCount(w)
  const list = []
  LAYERS.forEach((l, i) => {
    const count = Math.round(n * l.share)
    for (let k = 0; k < count; k += 1) list.push(spawn(w, h, i, true))
  })
  return list
}

const Glitter = forwardRef(function Glitter(_, ref) {
  const canvasRef = useRef(null)
  const apiRef = useRef({ burst: () => {}, attract: () => {}, release: () => {} })
  const reduced = useReducedMotion()

  useImperativeHandle(ref, () => ({
    burst: (...args) => apiRef.current.burst(...args),
    attract: (...args) => apiRef.current.attract(...args),
    release: () => apiRef.current.release(),
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const sprite = makeSprite()
    let w = 0
    let h = 0
    let dpr = 1
    let particles = []
    let sparks = []
    let attractPoint = null
    let attractAmt = 0
    let raf = 0
    let last = 0
    let t = 0

    const glow = (x, y, size, alpha) => {
      const d = size * 5.2
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
      ctx.drawImage(sprite, x - d / 2, y - d / 2, d, d)
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = reduced ? [] : buildField(w, h)
      if (reduced) drawStatic()
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      // A handful of fixed specks, placed with a repeatable pattern so they don't jump on resize.
      for (let i = 0; i < 12; i += 1) {
        const x = ((i * 0.618034 + 0.13) % 1) * w
        const y = ((i * 0.381966 + 0.29) % 1) * h
        glow(x, y, 1.6 + (i % 3) * 0.7, 0.55)
      }
      ctx.globalAlpha = 1
    }

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const target = attractPoint ? 1 : 0
      attractAmt += (target - attractAmt) * Math.min(1, dt * 1.6)

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        const layer = LAYERS[p.layer]
        p.y -= p.rise * dt
        p.baseX += p.drift * dt
        if (p.y < -30 || p.baseX < -60 || p.baseX > w + 60) {
          Object.assign(p, spawn(w, h, p.layer, false))
          p.ox = 0
          p.oy = 0
        }
        let x = p.baseX + Math.sin(t * p.freq + p.phase) * p.amp + p.ox
        let y = p.y + p.oy

        if (attractPoint && attractAmt > 0.01) {
          const dx = attractPoint.x - x
          const dy = attractPoint.y - y
          const dist = Math.hypot(dx, dy)
          const reach = 260
          if (dist < reach) {
            const f = (1 - dist / reach) ** 2 * attractAmt * (0.5 + p.layer * 0.25)
            p.ox += dx * f * 0.9 * dt
            p.oy += dy * f * 0.9 * dt
          }
        }
        // offsets ease back to rest
        p.ox -= p.ox * 0.5 * dt
        p.oy -= p.oy * 0.5 * dt
        x = p.baseX + Math.sin(t * p.freq + p.phase) * p.amp + p.ox
        y = p.y + p.oy

        const twinkle = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * p.twFreq + p.twPhase))
        const edge = Math.min(1, y / (h * 0.12), (h - y) / (h * 0.08))
        glow(x, y, p.size, layer.alpha * twinkle * Math.max(0, edge))
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i]
        s.age += dt
        if (s.age < 0) continue
        if (s.age >= s.life) {
          sparks.splice(i, 1)
          continue
        }
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.vy *= 1 - 0.35 * dt
        s.vx *= 1 - 0.5 * dt
        const k = s.age / s.life
        const env = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85
        const tw = 0.75 + 0.25 * Math.sin(t * 5 + s.seed)
        glow(s.x, s.y, s.size, env * env * tw)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (raf || reduced) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    apiRef.current = {
      burst: (rect) => {
        if (reduced || !rect) return
        for (let i = 0; i < 60; i += 1) {
          sparks.push({
            x: rand(rect.left, rect.right),
            y: rand(rect.top, rect.top + rect.height * 0.45),
            vx: rand(-18, 18),
            vy: -rand(40, 130),
            size: rand(1.8, 3.6),
            life: rand(2.2, 3),
            age: -rand(0, 0.35), // staggered so the burst blooms rather than pops
            seed: rand(0, 6.28),
          })
        }
      },
      attract: (x, y) => {
        attractPoint = { x, y }
      },
      release: () => {
        attractPoint = null
      },
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    start()
    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      apiRef.current = { burst: () => {}, attract: () => {}, release: () => {} }
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="glitter" aria-hidden="true" />
})

export default Glitter
