import { useEffect, useState } from 'react'

// ─── Hash router ──────────────────────────────────────────────────────────────
// Deliberately dependency-free: a hash router needs no server rewrites, so the
// site keeps working as a plain static build (GitHub Pages, Netlify drop, etc).

export const ROUTES = ['home', 'wishes', 'memories', 'cake', 'celebrate'] as const

export type Route = (typeof ROUTES)[number]

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return (ROUTES as readonly string[]).includes(raw) ? (raw as Route) : 'home'
}

export function navigate(route: Route) {
  window.location.hash = route === 'home' ? '/' : `/${route}`
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}
