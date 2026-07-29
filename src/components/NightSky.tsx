import { useEffect, useRef, useCallback } from 'react'

// ─── Palette (from design.md) ────────────────────────────────────────────────
const C = {
  bg:          '#0B1736',
  bgDark:      '#060e22',
  sky2:        '#13254D',
  star:        '#F5ECD8',
  starBright:  '#FFF8DC',
  accent:      '#E8C46A',
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type StarKind = 'dot' | 'cross' | 'bright'

interface Star {
  x: number        // canvas px float value for smooth movement
  y: number
  vx: number       // horizontal drift velocity (px/ms)
  kind: StarKind
  baseAlpha: number
  alpha: number    // current alpha
  speed: number    // twinkle speed (radians/ms)
  phase: number    // current phase offset
}

interface ShootingStarState {
  active: boolean
  x: number; y: number
  vx: number; vy: number
  length: number
  progress: number  // 0→1
  duration: number  // ms
  elapsed: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Round to nearest integer — enforces pixel grid */
const snap = (n: number) => Math.round(n)

/** Draw one pixel (no anti-aliasing) */
function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha: number) {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
  ctx.fillStyle   = color
  ctx.fillRect(snap(x), snap(y), 1, 1)
}

/** Draw a cross-shaped star (5 pixels) */
function cross(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha: number) {
  const sx = snap(x), sy = snap(y)
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
  ctx.fillStyle   = color
  ctx.fillRect(sx,     sy,     1, 1) // center
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.6))
  ctx.fillRect(sx - 1, sy,     1, 1) // left
  ctx.fillRect(sx + 1, sy,     1, 1) // right
  ctx.fillRect(sx,     sy - 1, 1, 1) // top
  ctx.fillRect(sx,     sy + 1, 1, 1) // bottom
}

/** Draw a bright star (3×3 center + cross arms at half-alpha) */
function bright(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha: number) {
  const sx = snap(x), sy = snap(y)
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
  ctx.fillStyle   = color
  ctx.fillRect(sx, sy, 1, 1)
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.8))
  ctx.fillRect(sx - 1, sy,     1, 1)
  ctx.fillRect(sx + 1, sy,     1, 1)
  ctx.fillRect(sx,     sy - 1, 1, 1)
  ctx.fillRect(sx,     sy + 1, 1, 1)
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.35))
  ctx.fillRect(sx - 2, sy,     1, 1)
  ctx.fillRect(sx + 2, sy,     1, 1)
  ctx.fillRect(sx,     sy - 2, 1, 1)
  ctx.fillRect(sx,     sy + 2, 1, 1)
}

// ─── Star generation ──────────────────────────────────────────────────────────
function generateStars(w: number, h: number): Star[] {
  const stars: Star[] = []
  const count = Math.floor((w * h) / 900) // density proportional to canvas area

  for (let i = 0; i < count; i++) {
    // Cluster-aware distribution — bias toward upper 2/3
    const rx = Math.random()
    const ry = Math.pow(Math.random(), 0.7) // more stars toward top

    // Pick kind with weighted probability
    const r = Math.random()
    const kind: StarKind = r < 0.72 ? 'dot' : r < 0.92 ? 'cross' : 'bright'

    const baseAlpha = kind === 'dot'
      ? Math.random() * 0.45 + 0.12
      : kind === 'cross'
      ? Math.random() * 0.55 + 0.25
      : Math.random() * 0.4  + 0.55

    // Parallax speed based on depth/kind
    let vx = 0
    if (kind === 'dot') {
      vx = -(Math.random() * 0.003 + 0.001) // 1 to 4 px/sec
    } else if (kind === 'cross') {
      vx = -(Math.random() * 0.007 + 0.003) // 3 to 10 px/sec
    } else {
      vx = -(Math.random() * 0.012 + 0.007) // 7 to 19 px/sec
    }

    stars.push({
      x: rx * w,
      y: ry * h,
      vx,
      kind,
      baseAlpha,
      alpha: baseAlpha,
      // Very slow twinkle: one full cycle every 6–22 seconds
      speed: (Math.PI * 2) / (Math.random() * 16000 + 6000),
      phase: Math.random() * Math.PI * 2,
    })
  }

  // Add a handful of accent gold stars (rare)
  const accentCount = Math.floor(count * 0.018)
  for (let i = 0; i < accentCount; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.pow(Math.random(), 0.65) * h,
      vx: -(Math.random() * 0.01 + 0.005),
      kind: 'bright',
      baseAlpha: Math.random() * 0.35 + 0.45,
      alpha: 0.5,
      speed: (Math.PI * 2) / (Math.random() * 20000 + 10000),
      phase: Math.random() * Math.PI * 2,
    })
  }

  return stars
}

// ─── Dithering for sky gradient ───────────────────────────────────────────────
// Pre-renders the dithered sky to an offscreen canvas using ImageData for instant execution.
function createDitheredSky(w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { alpha: false })!

  const imgData = ctx.createImageData(w, h)
  const data = imgData.data

  // Bayer 4×4 matrix
  const bayer = [
    [ 0,  8,  2, 10],
    [12,  4, 14,  6],
    [ 3, 11,  1,  9],
    [15,  7, 13,  5],
  ]

  // Dithered lighter strip — upper 45% of sky
  const gradH = Math.floor(h * 0.45)

  for (let y = 0; y < h; y++) {
    const t = y < gradH ? y / gradH : 1
    const threshold = t * 16

    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      
      // Base deep navy (C.bg = #0B1736)
      let r = 11, g = 23, b = 54 

      // If within gradient height and bayer matrix passes, use solid lighter sky tone (C.sky2 = #13254D)
      if (y < gradH && bayer[y % 4][x % 4] >= threshold) {
        r = 19; g = 37; b = 77
      }

      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas
}

// ─── NightSky Canvas Component ────────────────────────────────────────────────
interface NightSkyProps { className?: string }

export function NightSky({ className = '' }: NightSkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const starsRef  = useRef<Star[]>([])
  const shootRef  = useRef<ShootingStarState>({
    active: false, x:0, y:0, vx:0, vy:0, length:0, progress:0, duration:0, elapsed:0,
  })
  const rafRef    = useRef<number>(0)
  const lastRef   = useRef<number>(0)
  const nextShootRef = useRef<number>(scheduleNextShoot())

  function scheduleNextShoot(): number {
    return Date.now() + Math.random() * 20000 + 20000 // 20–40 s
  }

  // ─── Resize handler ────────────────────────────────────────────────────────
  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio, 2)
    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width  = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    canvas.style.width  = `${W}px`
    canvas.style.height = `${H}px`
    const ctx = canvas.getContext('2d')!
    // Disable all smoothing for authentic pixel art
    ctx.imageSmoothingEnabled = false
    ctx.scale(dpr, dpr)
    // Pre-render the background
    bgCanvasRef.current = createDitheredSky(W, H)
    // Regenerate stars for new size
    starsRef.current = generateStars(W, H)
  }, [])

  // ─── Animation loop ────────────────────────────────────────────────────────
  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false

    const W = window.innerWidth
    const H = window.innerHeight
    const dt = ts - (lastRef.current || ts)
    lastRef.current = ts

    // ── Background ──
    if (bgCanvasRef.current) {
      ctx.globalAlpha = 1 // Ensure background is drawn completely opaque
      ctx.drawImage(bgCanvasRef.current, 0, 0)
    }

    // ── Stars ──
    const stars = starsRef.current
    for (const s of stars) {
      // Apply movement drift based on vx
      s.x += s.vx * dt

      // Reset seamlessly when moving off-canvas (wrap around to the right)
      if (s.x < -8) {
        s.x = W + 8
        s.y = Math.random() * H // Randomize Y slightly to keep composition dynamic
      }

      s.phase += s.speed * dt
      // Smooth sine-based brightness — no blinking, just gentle breathing
      const factor = (Math.sin(s.phase) + 1) / 2  // 0→1
      // Stars dim to 15% of base, brighten to 130%
      s.alpha = s.baseAlpha * (0.15 + factor * 1.15)

      const color = s.kind === 'bright' ? C.starBright : C.star
      if (s.kind === 'dot') {
        px(ctx, s.x, s.y, color, s.alpha)
      } else if (s.kind === 'cross') {
        cross(ctx, s.x, s.y, color, s.alpha)
      } else {
        bright(ctx, s.x, s.y, C.starBright, s.alpha)
      }
    }

    // ── Shooting star ──
    const now = Date.now()
    const shoot = shootRef.current

    if (!shoot.active && now >= nextShootRef.current) {
      // Spawn a new shooting star
      const angle = (Math.random() * 20 + 20) * (Math.PI / 180) // 20–40° below horizontal
      const speed  = Math.random() * 180 + 120 // px/s
      shoot.x       = snap(Math.random() * W * 0.7)
      shoot.y       = snap(Math.random() * H * 0.45)
      shoot.vx      = Math.cos(angle) * speed
      shoot.vy      = Math.sin(angle) * speed
      shoot.length  = Math.random() * 60 + 40
      shoot.duration = (shoot.length / speed) * 1000 * 2.5 // fade in+out
      shoot.elapsed  = 0
      shoot.progress  = 0
      shoot.active    = true
    }

    if (shoot.active) {
      shoot.elapsed += dt
      shoot.progress = Math.min(1, shoot.elapsed / shoot.duration)

      // Fade: in for first 20%, hold at 70%, out at last 30%
      const p = shoot.progress
      const alpha = p < 0.2 ? p / 0.2
        : p < 0.7 ? 1
        : 1 - (p - 0.7) / 0.3

      // Draw pixel trail
      const trailLen = snap(shoot.length * Math.min(1, p * 3))
      const nx = shoot.x + shoot.vx * (shoot.elapsed / 1000)
      const ny = shoot.y + shoot.vy * (shoot.elapsed / 1000)

      for (let i = 0; i < trailLen; i++) {
        const t   = i / trailLen
        const tx  = snap(nx - Math.cos(Math.atan2(shoot.vy, shoot.vx)) * i)
        const ty  = snap(ny - Math.sin(Math.atan2(shoot.vy, shoot.vx)) * i)
        const ta  = alpha * (1 - t) * 0.85
        ctx.globalAlpha = ta
        ctx.fillStyle   = C.starBright
        ctx.fillRect(tx, ty, 1, 1)
      }
      ctx.globalAlpha = 1

      if (shoot.progress >= 1) {
        shoot.active = false
        nextShootRef.current = scheduleNextShoot()
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [resize, draw])

  return (
    <canvas
      ref={canvasRef}
      className={`night-sky-canvas ${className}`}
      aria-hidden
    />
  )
}
