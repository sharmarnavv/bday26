import { useEffect, useRef, useCallback } from 'react'

// ─── useLayerParallax ─────────────────────────────────────────────────────────
// Returns a ref to attach to a parallax-wrap div.
// On mouse move, applies a CSS transform proportional to maxPx from center.
export function useLayerParallax(maxPx: number) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const cx = window.innerWidth  / 2
    const cy = window.innerHeight / 2
    const dx = ((e.clientX - cx) / cx) * maxPx
    const dy = ((e.clientY - cy) / cy) * maxPx
    el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`
  }, [maxPx])

  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [onMove])

  return ref
}
