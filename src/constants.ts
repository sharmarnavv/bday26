// ─── Design Tokens ───────────────────────────────────────────────────────────
// All values from design.md — no magic numbers elsewhere.

export const BIRTHDAY = new Date('2026-08-05T00:00:00')

export const COLORS = {
  deepNavy:     '#0B1736',
  nightBlue:    '#13254D',
  moonlightBlue:'#1E3E78',
  warmCream:    '#F5ECD8',
  softGold:     '#E8C46A',
  dustyRose:    '#D99AA4',
  mutedGreen:   '#4D6B4A',
  darkForest:   '#253A2B',
} as const

// Parallax max-displacement in px (from design.md)
export const PARALLAX = {
  sky:        2,
  clouds:     4,
  mountains:  6,
  tree:       8,
  foreground: 10,
} as const
