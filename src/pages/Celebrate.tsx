import { useState } from 'react'
import { PixelConfetti } from '../components/PixelConfetti'
import { PixelPanel } from '../components/PixelPanel'
import { NAME } from '../data/birthday'
import { navigate } from '../router'

// ─── Celebrate ────────────────────────────────────────────────────────────────
// The payoff page. Letters drop in one at a time, confetti keeps falling, and
// tapping the name throws more of it.

interface DropInProps { text: string; offset: number }

function DropIn({ text, offset }: DropInProps) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="cel-ch"
          style={{ animationDelay: `${(offset + i) * 60}ms` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  )
}

export function Celebrate() {
  const [burst, setBurst] = useState(0)

  return (
    <div className="pg pg-celebrate">
      <PixelConfetti raining burst={burst} />

      <p className="pg-eyebrow">the sky ran out of waiting</p>

      <h2 className="cel-title">
        <span className="cel-line"><DropIn text="happy" offset={0} /></span>
        <span className="cel-line"><DropIn text="birthday" offset={5} /></span>
        <button
          type="button"
          className="cel-name"
          onClick={() => setBurst(b => b + 1)}
          aria-label={`${NAME} — tap for more confetti`}
        >
          <DropIn text={NAME} offset={13} />
        </button>
      </h2>

      <PixelPanel title="from everyone" className="cel-note">
        <p>
          we have been thinking about you all day — about how far you have come,
          and how much further you are going.
        </p>
        <p>
          you carry all of us with you, even when you do not know it. and we carry you.
        </p>
        <p>no matter where any of this goes: you will never celebrate alone.</p>
      </PixelPanel>

      <div className="cel-actions">
        <button type="button" className="px-btn" onClick={() => navigate('wishes')}>
          read the letters
        </button>
        <button type="button" className="px-btn" onClick={() => navigate('cake')}>
          go blow out the candles
        </button>
      </div>
    </div>
  )
}
