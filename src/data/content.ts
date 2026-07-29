// ─────────────────────────────────────────────────────────────
// src/data/content.ts
//
// This is the single file you need to edit.
// Replace all placeholder values with real content.
// ─────────────────────────────────────────────────────────────

export type StarType    = 'gold' | 'blue' | 'rose' | 'white'
export type ContentType = 'video' | 'photo' | 'letter' | 'memory'
export type StarState   = 'inactive' | 'active' | 'seen'

export interface ContentStar {
  id: string
  x: number      // % of viewport width  (left)
  y: number      // % of viewport height (top)
  type: StarType
  size: 'lg' | 'md' | 'sm'
  hoverText: string
  content: {
    type: ContentType
    title: string
    body?: string        // letter / memory text (use \n\n for paragraphs)
    videoUrl?: string    // YouTube embed URL or direct video URL
    photoUrl?: string    // image URL
    caption: string      // small text shown at the bottom of the modal
  }
  unlocksNext: string[]  // IDs of stars that become active after this one is seen
}

export interface ConstellationLine {
  from: string          // star ID
  to: string            // star ID
  revealsAfter: string  // line appears after this star ID is seen
}

// ─── Stars ────────────────────────────────────────────────────
export const CONTENT_STARS: ContentStar[] = [
  // ──────────────────────────────────────────────────────────
  // S1 — Opening / Nose of the paper airplane
  // This is the FIRST star. It should hold your most personal message.
  // ──────────────────────────────────────────────────────────
  {
    id: 'opening',
    x: 50, y: 30,
    type: 'gold', size: 'lg',
    hoverText: 'Someone planned this for a long time.',
    content: {
      type: 'video',
      title: 'A message just for you',
      // 🎬 REPLACE: Paste a YouTube embed URL like:
      // 'https://www.youtube.com/embed/VIDEO_ID?autoplay=1'
      // Or a direct .mp4 URL for a self-hosted video.
      videoUrl: '',
      caption: 'You are so deeply loved.',
    },
    unlocksNext: ['friend1', 'friend2'],
  },

  // ──────────────────────────────────────────────────────────
  // S2 — Left wing — Gold (video from a friend)
  // ──────────────────────────────────────────────────────────
  {
    id: 'friend1',
    x: 20, y: 47,
    type: 'gold', size: 'md',
    // ✏️ REPLACE: Something specific to this friend
    hoverText: 'Someone misses you terribly.',
    content: {
      type: 'video',
      // ✏️ REPLACE: Friend's actual name
      title: 'From [Friend 1]',
      // 🎬 REPLACE: Friend 1's video URL
      videoUrl: '',
      caption: 'No distance changes this.',
    },
    unlocksNext: ['photos'],
  },

  // ──────────────────────────────────────────────────────────
  // S3 — Right wing — Rose (letter from a friend)
  // ──────────────────────────────────────────────────────────
  {
    id: 'friend2',
    x: 80, y: 47,
    type: 'rose', size: 'md',
    // ✏️ REPLACE
    hoverText: 'Someone wrote you something.',
    content: {
      type: 'letter',
      // ✏️ REPLACE: Friend's actual name
      title: 'From [Friend 2]',
      // ✏️ REPLACE: Write a real, personal letter.
      // Use \n\n to separate paragraphs.
      body: `Dear [Name],\n\nReplace this with a real letter. Write about a specific memory, an inside joke, what she means to you. Be honest. Be warm. Be specific.\n\nDon't be generic. The best letters feel like a conversation that picks up exactly where it left off.\n\nWith so much love,\n[Friend 2]`,
      caption: 'Some things are better written than spoken.',
    },
    unlocksNext: ['photos'],
  },

  // ──────────────────────────────────────────────────────────
  // S4 — Body center — Blue (photo memories)
  // ──────────────────────────────────────────────────────────
  {
    id: 'photos',
    x: 50, y: 52,
    type: 'blue', size: 'md',
    hoverText: 'Someone saved all the good ones.',
    content: {
      type: 'photo',
      title: 'Moments we keep',
      // 📷 REPLACE: A photo URL (collage, candid shot, anything meaningful)
      photoUrl: '',
      caption: 'Every one of these moments was perfect.',
    },
    unlocksNext: ['friend3', 'friend4'],
  },

  // ──────────────────────────────────────────────────────────
  // S5 — Lower left — Gold (video from another friend)
  // ──────────────────────────────────────────────────────────
  {
    id: 'friend3',
    x: 37, y: 63,
    type: 'gold', size: 'md',
    // ✏️ REPLACE
    hoverText: 'Someone wanted to say this out loud.',
    content: {
      type: 'video',
      // ✏️ REPLACE
      title: 'From [Friend 3]',
      // 🎬 REPLACE
      videoUrl: '',
      caption: 'Distance is just geography.',
    },
    unlocksNext: ['closing'],
  },

  // ──────────────────────────────────────────────────────────
  // S6 — Lower right — Rose (a tiny memory)
  // These small memories carry enormous emotional weight.
  // ──────────────────────────────────────────────────────────
  {
    id: 'friend4',
    x: 63, y: 63,
    type: 'rose', size: 'sm',
    // ✏️ REPLACE
    hoverText: 'Someone wanted you to remember something.',
    content: {
      type: 'memory',
      // ✏️ REPLACE
      title: 'From [Friend 4]',
      // ✏️ REPLACE: A specific, honest memory. One small moment.
      // The more specific, the more emotional impact.
      body: `"Remember getting lost looking for that one coffee place?\n\nWe walked for two hours and didn't care at all.\n\nI think about that afternoon more than you know.\n\nSome moments are just permanently good."\n\n— [Friend 4]`,
      caption: 'Some memories only get warmer.',
    },
    unlocksNext: ['closing'],
  },

  // ──────────────────────────────────────────────────────────
  // S7 — Tail / Final star — Gold (closing letter from everyone)
  // This is the emotional payoff. Make it count.
  // ──────────────────────────────────────────────────────────
  {
    id: 'closing',
    x: 50, y: 72,
    type: 'gold', size: 'lg',
    hoverText: 'One last thing.',
    content: {
      type: 'letter',
      title: 'From everyone',
      // ✏️ REPLACE: Personalize this closing letter.
      body: `Happy Birthday.\n\nWe have been thinking about you all day.\n\nAbout how far you've come, and how much further you'll go. About how the distance is real, but so is everything we built together.\n\nAbout how proud we are of you — not just today, but every single day.\n\nYou carry us with you, even when you don't know it. And we carry you.\n\nNo matter where life takes us...\n\n...you'll never celebrate alone.\n\nWith all the love in the world,\n\n— Everyone who wanted to be there tonight`,
      caption: 'You are never alone.',
    },
    unlocksNext: [],
  },
]

// ─── Constellation Lines ───────────────────────────────────────
// These define the paper airplane shape.
// Each line appears after `revealsAfter` star has been seen.
export const CONSTELLATION_LINES: ConstellationLine[] = [
  { from: 'opening', to: 'friend1', revealsAfter: 'friend1' },
  { from: 'opening', to: 'friend2', revealsAfter: 'friend2' },
  { from: 'opening', to: 'photos',  revealsAfter: 'photos'  },
  { from: 'friend1', to: 'photos',  revealsAfter: 'photos'  },
  { from: 'friend2', to: 'photos',  revealsAfter: 'photos'  },
  { from: 'photos',  to: 'friend3', revealsAfter: 'friend3' },
  { from: 'photos',  to: 'friend4', revealsAfter: 'friend4' },
  { from: 'friend3', to: 'closing', revealsAfter: 'closing' },
  { from: 'friend4', to: 'closing', revealsAfter: 'closing' },
]
