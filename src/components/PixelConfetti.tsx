import { useEffect, useRef } from 'react'

// ─── PixelConfetti ────────────────────────────────────────────────────────────
// Chunky 8-bit confetti on its own canvas. Same rules as NightSky: integer
// coordinates, no smoothing, palette-limited. Respects prefers-reduced-motion.

const COLORS = ['#F5ECD8', '#E8C46A', '#D99AA4', '#FFF8DC', '#1E3E78'] as const

interface Bit {
  x: number
  y: number
  vx: number
  vy: number      // px/ms
  size: number    // 1–3 px
  color: string
  sway: number    // radians/ms
  phase: number
  life: number    // ms remaining, Infinity while raining
}

const snap = (n: number) => Math.round(n)

function spawn(w: number, fromTop: boolean, life: number): Bit {
  return {
    x: Math.random() * w,
    y: fromTop ? -Math.random() * 40 - 4 : Math.random() * 60,
    vx: (Math.random() - 0.5) * 0.04,
    vy: Math.random() * 0.06 + 0.03,
    size: Math.random() < 0.6 ? 2 : Math.random() < 0.75 ? 1 : 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    sway: (Math.PI * 2) / (Math.random() * 3200 + 1400),
    phase: Math.random() * Math.PI * 2,
    life,
  }
}

interface PixelConfettiProps {
  /** Keeps a gentle fall going forever. */
  raining?: boolean
  /** Bump this number to fire a one-off burst. */
  burst?: number
}

export function PixelConfetti({ raining = false, burst = 0 }: PixelConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bitsRef   = useRef<Bit[]>([])
  const rafRef    = useRef<number>(0)
  const lastRef   = useRef<number>(0)
  const reduced   = useRef<boolean>(false)

  // ─── Burst ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (burst <= 0 || reduced.current) return
    const w = window.innerWidth
    for (let i = 0; i < 90; i++) bitsRef.current.push(spawn(w, true, 9000))
  }, [burst])

  // ─── Loop ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width  = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width  = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
    }
    resize()
    window.addEventListener('resize', resize)

    if (raining) {
      const w = window.innerWidth
      for (let i = 0; i < 70; i++) bitsRef.current.push(spawn(w, false, Infinity))
    }

    const draw = (ts: number) => {
      const W = window.innerWidth
      const H = window.innerHeight
      const dt = Math.min(ts - (lastRef.current || ts), 48) // clamp tab-switch jumps
      lastRef.current = ts

      ctx.clearRect(0, 0, W, H)

      const bits = bitsRef.current
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i]
        b.phase += b.sway * dt
        b.x += (b.vx + Math.sin(b.phase) * 0.03) * dt
        b.y += b.vy * dt
        b.life -= dt

        if (b.y > H + 8 || b.life <= 0) {
          // Rain recycles forever; burst bits retire.
          if (b.life === Infinity) {
            bits[i] = spawn(W, true, Infinity)
          } else {
            bits.splice(i, 1)
          }
          continue
        }

        ctx.globalAlpha = b.life === Infinity ? 0.85 : Math.min(1, b.life / 1200)
        ctx.fillStyle   = b.color
        ctx.fillRect(snap(b.x), snap(b.y), b.size, b.size)
      }
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      bitsRef.current = []
      lastRef.current = 0
    }
  }, [raining])

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden />
}
