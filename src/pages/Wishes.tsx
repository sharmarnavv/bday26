import { useEffect, useState } from 'react'
import { PixelPanel } from '../components/PixelPanel'
import { WISHES } from '../data/wishes'
import type { Wish } from '../data/wishes'

// ─── Wishes ───────────────────────────────────────────────────────────────────
// Sealed pixel envelopes. Open one and it types itself out.

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// The hook holds no reset logic — each letter is mounted with its own key, so
// switching letters starts a fresh typewriter.
function useTypewriter(text: string, charsPerSecond = 55) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0))

  useEffect(() => {
    if (prefersReducedMotion()) return
    const iv = setInterval(() => {
      setCount(c => {
        if (c >= text.length) {
          clearInterval(iv)
          return c
        }
        return c + 1
      })
    }, 1000 / charsPerSecond)
    return () => clearInterval(iv)
  }, [text.length, charsPerSecond])

  return {
    shown: text.slice(0, count),
    done: count >= text.length,
    reveal: () => setCount(text.length),
  }
}

interface LetterProps {
  wish: Wish
  onClose: () => void
}

function Letter({ wish, onClose }: LetterProps) {
  const { shown, done, reveal } = useTypewriter(wish.body)

  return (
    <PixelPanel title={`from ${wish.from}`} className="wish-letter">
      {/* Tap anywhere in the text to skip the typing. */}
      <div className="wish-body" onClick={reveal}>
        {shown.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {!done && <span className="wish-caret" aria-hidden />}
      </div>

      {done && <p className="wish-signoff">— {wish.signoff}</p>}

      <button type="button" className="px-btn" onClick={onClose}>
        fold it back up
      </button>
    </PixelPanel>
  )
}

export function Wishes() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [readIds, setReadIds] = useState<string[]>([])

  const open = (wish: Wish) => {
    setOpenId(wish.id)
    setReadIds(ids => (ids.includes(wish.id) ? ids : [...ids, wish.id]))
  }

  const openWish = WISHES.find(w => w.id === openId) ?? null

  return (
    <div className="pg pg-wishes">
      <h2 className="pg-title">wishes</h2>
      <p className="pg-sub">
        {readIds.length} of {WISHES.length} opened
      </p>

      {openWish ? (
        <Letter key={openWish.id} wish={openWish} onClose={() => setOpenId(null)} />
      ) : (
        <ul className="env-grid">
          {WISHES.map(wish => (
            <li key={wish.id}>
              <button
                type="button"
                className={`env ${readIds.includes(wish.id) ? 'is-read' : ''}`}
                onClick={() => open(wish)}
              >
                <span className="env-flap" aria-hidden />
                <span className="env-from">{wish.from}</span>
                <span className="env-teaser">{wish.teaser}</span>
                <span className="env-cta">
                  {readIds.includes(wish.id) ? 'read again' : 'open'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
