import type { ReactNode } from 'react'

// ─── PixelPanel ───────────────────────────────────────────────────────────────
// A framed panel with 8-bit chamfered corners. The border is drawn with
// box-shadow steps (see index.css) so it stays on the pixel grid at any size.

interface PixelPanelProps {
  title?: string
  children: ReactNode
  className?: string
}

export function PixelPanel({ title, children, className = '' }: PixelPanelProps) {
  return (
    <section className={`pp ${className}`}>
      {title && <header className="pp-title">{title}</header>}
      <div className="pp-body">{children}</div>
    </section>
  )
}
