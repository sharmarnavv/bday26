// ─────────────────────────────────────────────────────────────
// src/data/memories.ts
//
// The gallery on the /memories page.
//
// 📷 photoUrl: drop in any image URL (or a file in /public, e.g.
// '/memories/goa.jpg'). Leave it '' and the frame shows a pixel
// placeholder instead — so the page never looks broken.
// ─────────────────────────────────────────────────────────────

export interface Memory {
  id: string
  title: string
  caption: string
  photoUrl: string
}

export const MEMORIES: Memory[] = [
  {
    id: 'm1',
    title: 'the first one',
    caption: '✏️ REPLACE — where this was, and who took it',
    photoUrl: '',
  },
  {
    id: 'm2',
    title: 'the night nobody wanted to go home',
    caption: '✏️ REPLACE — the detail only the two of you would remember',
    photoUrl: '',
  },
  {
    id: 'm3',
    title: 'getting completely lost',
    caption: 'two hours looking for one coffee place. worth it.',
    photoUrl: '',
  },
  {
    id: 'm4',
    title: 'the good year',
    caption: '✏️ REPLACE — what she pulled off, and how it felt',
    photoUrl: '',
  },
  {
    id: 'm5',
    title: 'to be taken tonight',
    caption: 'leave this one empty until the party. then come back.',
    photoUrl: '',
  },
]
