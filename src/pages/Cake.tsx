import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { PixelConfetti } from '../components/PixelConfetti'
import { NAME } from '../data/birthday'

// ─── Cake ─────────────────────────────────────────────────────────────────────
// A procedurally drawn 8-bit cake. Everything is rendered onto a 64×48 grid and
// then blitted up at an integer scale with smoothing off — so every pixel is a
// real pixel, at any screen size.

const GW = 64
const GH = 48
const SCALE = 8

const C = {
  frost:      '#F5ECD8',
  frostShade: '#D9CDB4',
  sponge:     '#D99AA4',
  spongeDark: '#B8808A',
  plate:      '#1E3E78',
  plateDark:  '#13254D',
  candle:     '#E8C46A',
  candleAlt:  '#F5ECD8',
  flame:      '#E8C46A',
  flameCore:  '#FFF8DC',
  smoke:      '#9AA6C4',
} as const

const CANDLE_XS = [17, 25, 32, 39, 46] // left edge of each 3px-wide candle
const CANDLE_TOP = 12
const CANDLE_H = 8

interface Candle { x: number; lit: boolean; outAt: number }

// ─── Primitives ───────────────────────────────────────────────────────────────
type Ctx = CanvasRenderingContext2D

function rect(g: Ctx, x: number, y: number, w: number, h: number, color: string) {
  g.fillStyle = color
  g.fillRect(x, y, w, h)
}

/** Frosting drips hanging off a tier — deterministic, so they never shimmer. */
function drips(g: Ctx, x0: number, w: number, y: number) {
  for (let i = 0; i < w; i++) {
    const depth = 1 + ((i * 7) % 3) + (i % 2)
    rect(g, x0 + i, y, 1, depth, C.frost)
    rect(g, x0 + i, y + depth, 1, 1, C.frostShade)
  }
}

const SPRINKLES: [number, number][] = [
  [19, 26], [24, 28], [31, 25], [37, 27], [44, 26],
  [11, 38], [17, 36], [23, 39], [29, 37], [35, 40], [41, 36], [48, 38], [53, 37],
]

function drawCake(g: Ctx, candles: Candle[], ts: number) {
  g.clearRect(0, 0, GW, GH)

  // ── Plate ──
  rect(g, 2, 44, 60, 2, C.plate)
  rect(g, 8, 46, 48, 1, C.plateDark)

  // ── Bottom tier ──
  rect(g, 6, 32, 52, 12, C.sponge)
  rect(g, 6, 41, 52, 3, C.spongeDark)
  rect(g, 6, 32, 52, 3, C.frost)
  drips(g, 6, 52, 35)

  // ── Top tier ──
  rect(g, 14, 20, 36, 12, C.sponge)
  rect(g, 14, 29, 36, 3, C.spongeDark)
  rect(g, 14, 20, 36, 3, C.frost)
  drips(g, 14, 36, 23)

  // ── Sprinkles ──
  for (const [sx, sy] of SPRINKLES) rect(g, sx, sy, 1, 1, C.frost)

  // ── Candles ──
  candles.forEach((candle, i) => {
    const { x } = candle
    const cx = x + 1

    for (let row = 0; row < CANDLE_H; row++) {
      const y = CANDLE_TOP + row
      rect(g, x, y, 3, 1, row % 2 === 0 ? C.candle : C.candleAlt)
    }

    if (candle.lit) {
      // Independent flicker per candle — no synchronised blinking.
      const flick = Math.sin(ts / 140 + i * 1.7) > 0.35
      const tall  = Math.sin(ts / 90 + i * 2.3) > 0.6

      rect(g, cx, CANDLE_TOP - 1, 1, 1, C.flameCore)
      rect(g, cx - 1, CANDLE_TOP - 2, 1, 1, C.flame)
      rect(g, cx, CANDLE_TOP - 2, 1, 1, C.flameCore)
      rect(g, cx + 1, CANDLE_TOP - 2, 1, 1, C.flame)
      if (flick) rect(g, cx, CANDLE_TOP - 3, 1, 1, C.flame)
      if (tall)  rect(g, cx, CANDLE_TOP - 4, 1, 1, C.flame)
    } else if (candle.outAt > 0) {
      // A wisp of smoke for a moment and a half after it goes out.
      const age = ts - candle.outAt
      if (age < 1600) {
        for (let p = 0; p < 3; p++) {
          const t = age - p * 220
          if (t < 0) continue
          const y = CANDLE_TOP - 1 - Math.floor(t / 130)
          const sx = cx + Math.round(Math.sin(t / 260 + p))
          g.globalAlpha = Math.max(0, 0.55 - t / 2600)
          rect(g, sx, y, 1, 1, C.smoke)
        }
        g.globalAlpha = 1
      }
    }
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function Cake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef   = useRef<HTMLCanvasElement | null>(null)
  const rafRef    = useRef<number>(0)
  const candlesRef = useRef<Candle[]>(CANDLE_XS.map(x => ({ x, lit: true, outAt: 0 })))

  const [litCount, setLitCount] = useState(CANDLE_XS.length)
  const [burst, setBurst] = useState(0)

  // ─── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width  = GW * SCALE
    canvas.height = GH * SCALE

    const out = canvas.getContext('2d')!
    out.imageSmoothingEnabled = false

    const grid = document.createElement('canvas')
    grid.width  = GW
    grid.height = GH
    gridRef.current = grid
    const g = grid.getContext('2d')!
    g.imageSmoothingEnabled = false

    const loop = (ts: number) => {
      drawCake(g, candlesRef.current, ts)
      out.imageSmoothingEnabled = false
      out.clearRect(0, 0, canvas.width, canvas.height)
      out.drawImage(grid, 0, 0, GW, GH, 0, 0, canvas.width, canvas.height)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // ─── Blowing out ───────────────────────────────────────────────────────────
  const blowOut = (indices: number[]) => {
    let extinguished = 0
    for (const i of indices) {
      const candle = candlesRef.current[i]
      if (!candle || !candle.lit) continue
      candle.lit = false
      candle.outAt = performance.now()
      extinguished++
    }
    if (!extinguished) return

    const remaining = candlesRef.current.filter(c => c.lit).length
    setLitCount(remaining)
    if (remaining === 0) setBurst(b => b + 1)
  }

  const onCanvasClick = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const rectBox = e.currentTarget.getBoundingClientRect()
    const gx = ((e.clientX - rectBox.left) / rectBox.width) * GW
    const gy = ((e.clientY - rectBox.top) / rectBox.height) * GH
    if (gy > CANDLE_TOP + CANDLE_H) return // clicked the cake, not a candle

    const hit = candlesRef.current.findIndex(c => Math.abs(gx - (c.x + 1)) <= 4)
    if (hit >= 0) blowOut([hit])
  }

  const relight = () => {
    candlesRef.current.forEach(c => { c.lit = true; c.outAt = 0 })
    setLitCount(CANDLE_XS.length)
  }

  const allOut = litCount === 0

  return (
    <div className="pg pg-cake">
      <PixelConfetti burst={burst} />

      <h2 className="pg-title">make a wish</h2>
      <p className="pg-sub">
        {allOut
          ? 'every candle is out. it counts now.'
          : `tap the candles — ${litCount} still lit`}
      </p>

      <canvas
        ref={canvasRef}
        className="cake-canvas"
        onClick={onCanvasClick}
        role="img"
        aria-label={allOut ? 'a birthday cake, candles blown out' : `a birthday cake with ${litCount} lit candles`}
      />

      <div className="cake-controls">
        {allOut ? (
          <>
            <p className="cake-wish">happy birthday, {NAME}.</p>
            <button type="button" className="px-btn" onClick={relight}>light them again</button>
          </>
        ) : (
          <button
            type="button"
            className="px-btn is-lit"
            onClick={() => blowOut(candlesRef.current.map((_, i) => i))}
          >
            blow them all out
          </button>
        )}
      </div>
    </div>
  )
}
