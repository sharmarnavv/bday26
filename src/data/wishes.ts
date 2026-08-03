// ─────────────────────────────────────────────────────────────
// src/data/wishes.ts
//
// The letters on the /wishes page.
//
// Everything below is a warm placeholder — it reads fine as-is,
// but it gets a hundred times better if you swap `from` for real
// names and rewrite each body with one specific memory.
// ─────────────────────────────────────────────────────────────

export interface Wish {
  id: string
  from: string      // ✏️ REPLACE with a real name
  teaser: string    // one line, shown on the sealed envelope
  body: string      // the letter — use \n\n between paragraphs
  signoff: string
}

export const WISHES: Wish[] = [
  {
    id: 'w1',
    from: 'someone who has known you the longest',
    teaser: 'this one has been saved up for a while',
    body: `happy birthday, anushka.\n\ni have watched you grow into someone who takes care of everyone in the room before she takes care of herself, and i hope today the whole thing runs in reverse.\n\nfor one day: let it be about you. eat the cake first. answer the messages late.\n\n✏️ REPLACE this with one specific thing you remember about her. one small moment beats three paragraphs of nice adjectives.`,
    signoff: 'always in your corner',
  },
  {
    id: 'w2',
    from: 'the group chat',
    teaser: 'forty-one unread messages, all of them nice',
    body: `we tried to agree on one message and it turned into a hundred, so here is the summary:\n\nyou are the reason the plans actually happen. you are the one who remembers what everyone is going through. you make ordinary evenings feel like something worth showing up for.\n\nwe are all a little louder because of you.\n\n✏️ REPLACE with the actual inside joke. you know the one.`,
    signoff: 'everyone, at once',
  },
  {
    id: 'w3',
    from: 'a friend who is far away today',
    teaser: 'the distance is the only bad part',
    body: `i hate that i am not there tonight.\n\nbut distance is just geography, and it has never once made you feel further away. i still tell your stories to people who have never met you.\n\nsave me a slice. i want the full report — every detail, in order, nothing skipped.\n\n✏️ REPLACE with the plan for when you next see her. make it a real date.`,
    signoff: 'missing you loudly',
  },
  {
    id: 'w4',
    from: 'someone who is proud of you',
    teaser: 'about this year, specifically',
    body: `this year asked a lot of you and you did not flinch.\n\ni do not think you noticed how much you carried, because you were busy carrying it. so here it is on the record: it was a lot, you did it, and it counted.\n\nnext year gets to be the gentle one.\n\n✏️ REPLACE with the specific thing she pulled off this year. name it.`,
    signoff: 'endlessly proud',
  },
  {
    id: 'w5',
    from: 'everyone who wanted to be here tonight',
    teaser: 'read this one last',
    body: `happy birthday, anushka.\n\nwe have been thinking about you all day — about how far you have come, and how much further you are going.\n\nyou carry all of us with you, even when you do not know it. and we carry you.\n\nno matter where any of this goes: you will never celebrate alone.`,
    signoff: 'with all the love in the world',
  },
]
