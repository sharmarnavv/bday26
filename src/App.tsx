import { useState, useEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import NumberFlow from '@number-flow/react'
import './index.css'

// ─── Types ──────────────────────────────────────────
interface StarPoint {
  id: number
  x: number; y: number
  size: number
  dur: number; del: number
  op: number
  blur: number
}

interface ShootingStar {
  id: number
  x: number; y: number   // % of viewport
  angle: number          // degrees
  len: number            // px
}

// ─── Star generation (clustered) ────────────────────
function makeStars(): StarPoint[] {
  const out: StarPoint[] = []
  let id = 0

  // Background field — dim, small, uniform scatter
  for (let i = 0; i < 110; i++) {
    out.push({
      id: id++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.9 + 0.3,
      dur: Math.random() * 7 + 4,
      del: Math.random() * 9,
      op: Math.random() * 0.22 + 0.06,
      blur: 0,
    })
  }

  // Star clusters — denser near center, fade outward
  const clusters = [
    { cx: 12, cy: 16, spread: 11, n: 20, maxSz: 1.6 },
    { cx: 80, cy: 11, spread: 14, n: 24, maxSz: 2.0 },
    { cx: 90, cy: 58, spread:  8, n: 14, maxSz: 1.5 },
    { cx: 28, cy:  7, spread: 13, n: 18, maxSz: 1.7 },
    { cx: 58, cy: 22, spread: 18, n: 22, maxSz: 1.9 },
    { cx: 42, cy: 72, spread: 10, n: 12, maxSz: 1.4 },
    { cx: 70, cy: 82, spread: 12, n: 16, maxSz: 1.5 },
  ]
  clusters.forEach(c => {
    for (let i = 0; i < c.n; i++) {
      const a = Math.random() * Math.PI * 2
      const d = Math.pow(Math.random(), 0.55) * c.spread
      out.push({
        id: id++,
        x: Math.max(0, Math.min(100, c.cx + Math.cos(a) * d)),
        y: Math.max(0, Math.min(100, c.cy + Math.sin(a) * d * 0.55)),
        size: Math.random() * c.maxSz + 0.5,
        dur: Math.random() * 4 + 2.5,
        del: Math.random() * 7,
        op: Math.random() * 0.55 + 0.22,
        blur: 0,
      })
    }
  })

  // Foreground bokeh — large, soft, barely visible
  for (let i = 0; i < 18; i++) {
    out.push({
      id: id++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 50 + 18,
      dur: Math.random() * 14 + 10,
      del: Math.random() * 12,
      op: Math.random() * 0.07 + 0.015,
      blur: Math.random() * 18 + 10,
    })
  }

  return out
}

// ─── App ─────────────────────────────────────────────
export default function App() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [phase, setPhase] = useState<0 | 1 | 2>(0)
  const [shoots, setShoots] = useState<ShootingStar[]>([])
  const stars  = useMemo(() => makeStars(), [])
  const nextId = useRef(0)

  // Countdown timer
  useEffect(() => {
    const target = new Date('2026-08-05T00:00:00')
    const tick = () => {
      const d = target.getTime() - Date.now()
      if (d <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTime({
        days:    Math.floor(d / 86400000),
        hours:   Math.floor((d % 86400000) / 3600000),
        minutes: Math.floor((d % 3600000)  / 60000),
        seconds: Math.floor((d % 60000)    / 1000),
      })
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  // Cinematic reveal: sky → countdown
  useEffect(() => {
    const t = setTimeout(() => setPhase(2), 2000)
    return () => clearTimeout(t)
  }, [])

  // Shooting stars — occasional, surprising
  useEffect(() => {
    let handle: ReturnType<typeof setTimeout>
    const schedule = () => {
      const delay = Math.random() * 14000 + 9000 // 9–23 s
      handle = setTimeout(() => {
        const id = nextId.current++
        const star: ShootingStar = {
          id,
          x:     Math.random() * 65 + 5,
          y:     Math.random() * 38 + 3,
          angle: Math.random() * 28 + 18,
          len:   Math.random() * 90 + 55,
        }
        setShoots(p => [...p.slice(-2), star])
        setTimeout(() => setShoots(p => p.filter(s => s.id !== id)), 1400)
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(handle)
  }, [])

  const flowProps = {
    format: { minimumIntegerDigits: 2, notation: 'standard' } as const,
    transformTiming: { duration: 750, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
    spinTiming:      { duration: 750, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
    opacityTiming:   { duration: 380, easing: 'ease' },
    trend: -1 as const,
  }

  return (
    <div className="scene">

      {/* ── Layer 0: Sky ── */}
      <div className="sky-gradient" />

      {/* ── Layer 1: Stars + Bokeh ── */}
      <div className="star-layer">
        {stars.map(s => (
          <div
            key={s.id}
            className="star"
            style={{
              left:   `${s.x}%`,
              top:    `${s.y}%`,
              width:  s.size,
              height: s.size,
              filter: s.blur > 0 ? `blur(${s.blur}px)` : undefined,
              '--op':  s.op,
              '--dur': `${s.dur}s`,
              '--del': `${s.del}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      {/* ── Layer 2: Ambient Glows ── */}
      <div className="ambient-center" />
      <div className="ambient-horizon" />

      {/* ── Layer 3: Shooting Stars ── */}
      {shoots.map(s => (
        <div
          key={s.id}
          className="shooting-star-wrap"
          style={{
            left:      `${s.x}%`,
            top:       `${s.y}%`,
            transform: `rotate(${s.angle}deg)`,
          }}
        >
          <div className="shooting-star" style={{ width: s.len }} />
        </div>
      ))}

      {/* ── Layer 4: Foreground Vignette ── */}
      <div className="fg-vignette" />

      {/* ── Layer 10: Content ── */}
      <div className="content">

        {/* Countdown */}
        <div className={`countdown-wrap${phase >= 2 ? ' visible' : ''}`}>
          <div className="countdown-glow" />

          <div className="timer">
            <div className="unit">
              <NumberFlow className="digit" value={time.days}    {...flowProps} />
            </div>
            <span className="sep">:</span>
            <div className="unit">
              <NumberFlow className="digit" value={time.hours}   {...flowProps} />
            </div>
            <span className="sep">:</span>
            <div className="unit">
              <NumberFlow className="digit" value={time.minutes} {...flowProps} />
            </div>
            <span className="sep">:</span>
            <div className="unit">
              <NumberFlow className="digit" value={time.seconds} {...flowProps} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
