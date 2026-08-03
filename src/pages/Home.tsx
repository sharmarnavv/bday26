import { Countdown } from '../components/Countdown'
import type { TimeLeft } from '../components/Countdown'
import { NAME, HOME_HINT } from '../data/birthday'
import { navigate } from '../router'

// ─── Home ─────────────────────────────────────────────────────────────────────
// The original screen, plus a name and a way into the rest of the site.
// Countdown logic is untouched — this page only receives it.

interface HomeProps {
  timeLeft: TimeLeft
  isPast: boolean
}

export function Home({ timeLeft, isPast }: HomeProps) {
  return (
    <div className="pg pg-home">
      <p className="pg-eyebrow">a small corner of the sky for</p>
      <h1 className="pg-name">{NAME}</h1>

      <Countdown timeLeft={timeLeft} />

      {isPast ? (
        <button type="button" className="px-btn is-lit" onClick={() => navigate('celebrate')}>
          it&rsquo;s today — open it
        </button>
      ) : (
        <p className="pg-hint">{HOME_HINT}</p>
      )}
    </div>
  )
}
