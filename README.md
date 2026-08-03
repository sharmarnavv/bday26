# anushka's birthday

A pixel-art night sky counting down to 5 Aug 2026, plus a few pages to open once it lands.

| page | hash | what it is |
|------|------|------------|
| countdown | `#/` | the original sky + countdown, now with her name on it |
| wishes | `#/wishes` | sealed pixel envelopes; each letter types itself out |
| memories | `#/memories` | framed photo gallery (arrow keys work) |
| cake | `#/cake` | a procedurally drawn cake — tap the candles out, make a wish |
| party | `#/celebrate` | the payoff: falling confetti, tap her name for more |

## Editing the content

Only three files need touching — no component edits required:

- [`src/data/wishes.ts`](src/data/wishes.ts) — the letters. Swap `from` for real names and rewrite each `body`.
- [`src/data/memories.ts`](src/data/memories.ts) — the gallery. Set `photoUrl` to an image URL or a file in `public/` (e.g. `/memories/goa.jpg`). Left empty, the frame shows a pixel placeholder.
- [`src/data/birthday.ts`](src/data/birthday.ts) — her name and the line under the countdown.

Look for `✏️ REPLACE` markers. The countdown target date stays in [`src/App.tsx`](src/App.tsx).

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
```

Routing is a ~30-line hash router ([`src/router.ts`](src/router.ts)) — no new dependencies, and it works on any static host with no rewrite rules.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
