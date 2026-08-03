import { useCallback, useEffect, useState } from 'react'
import { MEMORIES } from '../data/memories'

// ─── Memories ─────────────────────────────────────────────────────────────────
// One framed photo at a time. Empty photoUrl falls back to a pixel placeholder,
// so the page looks finished even before the real pictures land.

function Placeholder() {
  return (
    <div className="mem-ph">
      {/* 7×6 pixel heart — crisp edges, no anti-aliasing */}
      <svg className="mem-ph-heart" viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden>
        <rect x="1" y="0" width="2" height="1" />
        <rect x="4" y="0" width="2" height="1" />
        <rect x="0" y="1" width="7" height="2" />
        <rect x="1" y="3" width="5" height="1" />
        <rect x="2" y="4" width="3" height="1" />
        <rect x="3" y="5" width="1" height="1" />
      </svg>
      <p className="mem-ph-text">photo goes here</p>
    </div>
  )
}

export function Memories() {
  const [index, setIndex] = useState(0)
  const total = MEMORIES.length

  const step = useCallback((delta: number) => {
    setIndex(i => (i + delta + total) % total)
  }, [total])

  // Arrow keys move through the gallery.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const memory = MEMORIES[index]

  return (
    <div className="pg pg-memories">
      <h2 className="pg-title">memories</h2>
      <p className="pg-sub">{index + 1} / {total}</p>

      <figure className="mem-frame">
        {memory.photoUrl
          ? <img className="mem-img" src={memory.photoUrl} alt={memory.title} />
          : <Placeholder />}
        <figcaption className="mem-cap">
          <strong>{memory.title}</strong>
          <span>{memory.caption}</span>
        </figcaption>
      </figure>

      <div className="mem-controls">
        <button type="button" className="px-btn" onClick={() => step(-1)} aria-label="previous memory">
          &lt; prev
        </button>
        <div className="mem-dots" aria-hidden>
          {MEMORIES.map((m, i) => (
            <span key={m.id} className={`mem-dot ${i === index ? 'is-on' : ''}`} />
          ))}
        </div>
        <button type="button" className="px-btn" onClick={() => step(1)} aria-label="next memory">
          next &gt;
        </button>
      </div>
    </div>
  )
}
