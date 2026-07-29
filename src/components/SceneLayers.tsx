import { useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── SkyLayer ─────────────────────────────────────────────────────────────────
// Renders the sky gradient background.

export function SkyLayer() {
  return <div className="layer sky-gradient" aria-hidden />
}

// ─── StarsLayer ───────────────────────────────────────────────────────────────
// Procedurally generates hundreds of stars + Milky Way band.

interface StarDot {
  id: number
  x: number   // vw %
  y: number   // vh %
  r: number   // radius px
  opacity: number
  dur: number // twinkle duration s
  del: number // animation delay s
}

function generateStars(): StarDot[] {
  const stars: StarDot[] = []
  let id = 0

  // Scattered stars — denser toward top (sky)
  for (let i = 0; i < 420; i++) {
    const y = Math.pow(Math.random(), 0.55) * 72  // bias toward top 72% (sky)
    stars.push({
      id: id++,
      x: Math.random() * 100,
      y,
      r: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.6 + 0.15,
      dur: Math.random() * 12 + 8,
      del: Math.random() * 14,
    })
  }

  // Milky Way band — diagonal smear of denser stars
  const mwStarCount = 180
  for (let i = 0; i < mwStarCount; i++) {
    const t = i / mwStarCount
    const bx = 10 + t * 80   // band runs 10→90%
    const by = 65 - t * 50   // top-right diagonal
    const scatter = (Math.random() - 0.5) * 18
    stars.push({
      id: id++,
      x: Math.max(0, Math.min(100, bx + scatter * 1.3)),
      y: Math.max(0, Math.min(68,  by + scatter * 0.5)),
      r: Math.random() * 0.55 + 0.12,
      opacity: Math.random() * 0.28 + 0.05,
      dur: Math.random() * 16 + 10,
      del: Math.random() * 18,
    })
  }

  return stars
}

export function StarsLayer() {
  const stars = useMemo(generateStars, [])

  return (
    <div className="layer stars-layer" aria-hidden>
      {/* Milky Way glow — subtle band */}
      <div className="milky-way" />
      {stars.map(s => (
        <div
          key={s.id}
          className="star-dot"
          style={{
            left: `${s.x}%`,
            top:  `${s.y}%`,
            width:  s.r * 2,
            height: s.r * 2,
            '--op':  s.opacity,
            '--dur': `${s.dur}s`,
            '--del': `${s.del}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

// ─── MoonLayer ────────────────────────────────────────────────────────────────
export function MoonLayer() {
  return (
    <div className="layer moon-layer" aria-hidden>
      <div className="moon-glow" />
      <div className="moon-body">
        {/* Subtle surface texture via pseudo-circles */}
        <div className="moon-crater moon-crater-1" />
        <div className="moon-crater moon-crater-2" />
        <div className="moon-crater moon-crater-3" />
      </div>
    </div>
  )
}

// ─── CloudsLayer ─────────────────────────────────────────────────────────────

interface CloudProps { className: string; style?: CSSProperties }
function Cloud({ className, style }: CloudProps) {
  return <div className={`cloud ${className}`} style={style} aria-hidden />
}

export function CloudsLayer() {
  return (
    <div className="layer clouds-layer" aria-hidden>
      <Cloud className="cloud-1" />
      <Cloud className="cloud-2" />
      <Cloud className="cloud-3" />
    </div>
  )
}

// ─── MountainsLayer ──────────────────────────────────────────────────────────
export function MountainsLayer() {
  return (
    <div className="layer mountains-layer" aria-hidden>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="mountains-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Far mountains — lighter */}
        <path
          d="M0,240 L80,168 L160,200 L270,130 L390,185 L520,105 L640,160
             L760,90 L880,148 L990,80 L1100,140 L1220,95 L1340,155 L1440,110
             L1440,320 L0,320 Z"
          fill="#1a2f58"
          opacity="0.75"
        />
        {/* Distant forest silhouette */}
        <path
          d="M0,270 L40,248 L80,260 L130,240 L180,255 L230,238
             L290,252 L350,235 L420,250 L500,234 L580,248 L660,232
             L750,246 L850,230 L950,244 L1060,228 L1160,242 L1280,226
             L1380,240 L1440,228 L1440,320 L0,320 Z"
          fill="#1d3245"
          opacity="0.85"
        />
        {/* Near hills — darker */}
        <path
          d="M0,288 L120,262 L260,275 L400,258 L540,270 L680,252
             L820,266 L960,248 L1100,264 L1240,246 L1380,260 L1440,248
             L1440,320 L0,320 Z"
          fill="#13254d"
        />
      </svg>
    </div>
  )
}

// ─── TreeLayer ────────────────────────────────────────────────────────────────
export function TreeLayer() {
  return (
    <div className="layer tree-layer" aria-hidden>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="tree-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <rect x="382" y="258" width="14" height="62" fill="#1a2718" />
        {/* Canopy layers — from bottom to top for depth */}
        <ellipse cx="389" cy="258" rx="62" ry="38" fill="#253a2b" />
        <ellipse cx="389" cy="240" rx="50" ry="32" fill="#2d4535" />
        <ellipse cx="389" cy="222" rx="38" ry="28" fill="#344e3c" />
        <ellipse cx="389" cy="208" rx="26" ry="20" fill="#3a5642" />
        {/* Moonlight highlight on left side of canopy */}
        <ellipse cx="372" cy="228" rx="14" ry="22" fill="#3f6248" opacity="0.5" />
        {/* Small bushes left of tree */}
        <ellipse cx="290" cy="298" rx="28" ry="14" fill="#253a2b" />
        <ellipse cx="310" cy="292" rx="18" ry="12" fill="#2d4535" />
        {/* Small bushes right of tree */}
        <ellipse cx="500" cy="300" rx="22" ry="12" fill="#253a2b" />
        <ellipse cx="480" cy="295" rx="14" ry="10" fill="#2d4535" />
      </svg>
    </div>
  )
}

// ─── GrassLayer ───────────────────────────────────────────────────────────────
export function GrassLayer() {
  return (
    <div className="layer grass-layer" aria-hidden>
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="grass-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground fill */}
        <rect x="0" y="120" width="1440" height="80" fill="#2d4a2a" />
        {/* Rolling foreground ground */}
        <path
          d="M0,128 Q180,110 360,122 Q540,134 720,118 Q900,102 1080,120
             Q1260,138 1440,122 L1440,200 L0,200 Z"
          fill="#354d32"
        />
        {/* Moonlit grass top edge */}
        <path
          d="M0,126 Q180,108 360,120 Q540,132 720,116 Q900,100 1080,118
             Q1260,136 1440,120"
          fill="none" stroke="#4d6b4a" strokeWidth="2" opacity="0.6"
        />
        {/* Foreground detail — grass blades */}
        <g className="grass-blades" fill="#4d6b4a" opacity="0.7">
          {[30,80,140,200,260,340,420,510,590,670,760,850,940,1030,1120,1200,1280,1360].map((x, i) => (
            <g key={i}>
              <line x1={x}    y1="128" x2={x-4}  y2="112" stroke="#4d6b4a" strokeWidth="1.5" />
              <line x1={x+6}  y1="128" x2={x+10} y2="113" stroke="#4d6b4a" strokeWidth="1.5" />
              <line x1={x+14} y1="128" x2={x+12} y2="116" stroke="#4d6b4a" strokeWidth="1.5" />
            </g>
          ))}
        </g>
        {/* Flowers */}
        {[110, 240, 620, 900, 1180].map((fx, i) => (
          <g key={i}>
            <circle cx={fx} cy="122" r="2.5" fill="#d99aa4" opacity="0.8" />
            <circle cx={fx+3} cy="126" r="1.5" fill="#e8c46a" opacity="0.6" />
          </g>
        ))}
        {/* A few rocks */}
        <ellipse cx="680" cy="132" rx="12" ry="7" fill="#1a2a1a" opacity="0.5" />
        <ellipse cx="1050" cy="136" rx="9"  ry="5" fill="#1a2a1a" opacity="0.4" />
      </svg>
    </div>
  )
}

// ─── FirefliesLayer ───────────────────────────────────────────────────────────
// ~8 fireflies, each with random wandering via CSS animation

interface Firefly {
  id: number; x: number; y: number
  dur: number; del: number; scale: number
}

function makeFireflies(): Firefly[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 60 + Math.random() * 28, // lower portion of screen
    dur: Math.random() * 8 + 6,
    del: Math.random() * 10,
    scale: Math.random() * 0.6 + 0.7,
  }))
}

export function FirefliesLayer() {
  const fireflies = useMemo(makeFireflies, [])
  return (
    <div className="layer fireflies-layer" aria-hidden>
      {fireflies.map(f => (
        <div
          key={f.id}
          className="firefly"
          style={{
            left: `${f.x}%`,
            top:  `${f.y}%`,
            '--dur': `${f.dur}s`,
            '--del': `${f.del}s`,
            '--scale': f.scale,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

// ─── AtmosphericFog ──────────────────────────────────────────────────────────
export function AtmosphericFog() {
  return <div className="layer fog-layer" aria-hidden />
}

// ─── Vignette ─────────────────────────────────────────────────────────────────
export function Vignette() {
  return <div className="layer vignette-layer" aria-hidden />
}
