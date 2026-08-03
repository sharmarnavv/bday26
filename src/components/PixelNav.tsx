import { navigate } from '../router'
import type { Route } from '../router'

// ─── PixelNav ─────────────────────────────────────────────────────────────────
// Fixed bottom nav. Sits above the sky, never covers the countdown.

const ITEMS: { route: Route; label: string }[] = [
  { route: 'home',      label: 'countdown' },
  { route: 'wishes',    label: 'wishes'    },
  { route: 'memories',  label: 'memories'  },
  { route: 'cake',      label: 'cake'      },
  { route: 'celebrate', label: 'party'     },
]

interface PixelNavProps { route: Route }

export function PixelNav({ route }: PixelNavProps) {
  return (
    <nav className="nav" aria-label="pages">
      {ITEMS.map(item => (
        <button
          key={item.route}
          type="button"
          className={`nav-btn ${route === item.route ? 'is-active' : ''}`}
          aria-current={route === item.route ? 'page' : undefined}
          onClick={() => navigate(item.route)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
