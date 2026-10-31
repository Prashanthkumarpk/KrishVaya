# KrishVaya — Guidance for Every Emotion

A quiet React + Vite web app. Pick a feeling, get one verse from the Bhagavad Gita, what it means in plain words, and one small thing to do today. No backend, no paid services, no UI or animation library. Plain CSS plus one canvas for the golden glitter.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve dist/ locally
```

## Deploy to GitHub Pages (free)

`vite.config.js` uses `base: './'`, so the build works under `https://<you>.github.io/krishvaya/`.

1. Create a GitHub repo named **krishvaya** and push this project to its `main` branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` installs, builds and publishes `dist/`. The URL appears in the workflow run.

## Adding images

Everything is optional. Without a file, the app shows a gradient in that mood's colours and a simple SVG glyph, never a broken-image icon.

| File | Size |
| --- | --- |
| `public/images/hero.webp` | 1920×1080, Krishna and Arjuna scene (a first version is already included) |
| `public/images/tiles/happy.webp`, `sad.webp`, `lazy.webp`, `protection.webp`, `anger.webp`, `peace.webp`, `lonely.webp`, `anxious.webp` | 480×600 each |
| `public/images/om.svg` | Om emblem (falls back to a gold ॐ glyph) |
| `public/audio/ambient.mp3` | Optional flute/ambient loop |

Ambient audio is off by default, never autoplays, and fades in/out over 2 seconds from the speaker button in the header. If the file is missing, the button shows "Ambient sound is not available yet."

## Adding or editing slips

Only `src/data/slips.js` needs to change.

```js
{
  id: 'anxious-2-47',   // unique
  ref: '2.47',          // chapter.verse
  devanagari: '...',    // Sanskrit from the Gita, use \n between the two lines
  iast: '...',          // transliteration
  quote: 'short English line shown large on the card',
  meaning: '2 to 3 sentences in plain words',
  action: 'one concrete thing to do today (about 10 minutes)',
}
```

Add it to the array for its feeling in `SLIPS`. Feelings (label, Sanskrit name, tile image, tint, rim colour) are in `FEELINGS`; the floating quote lines are in `QUOTES`; `DEFAULT_SLIP_ID` is the verse shown on load.

Content rules: Sanskrit comes from the Gita; the quote, meaning and action are written fresh, never copied from a translation or commentary. Keep the tone warm and direct, and never claim medical or therapeutic benefit.

## Accessibility notes

- Reduced motion: glitter drift stops (a few static specks remain), parallax, floating, light-ray motion and the roll/unroll are replaced by simple fades.
- Tiles are `<button aria-pressed>` with a lotus-pink focus ring and a 44px minimum touch target. The card is `aria-live="polite"`. Dialogs trap focus, close on Esc, and make the page behind them `inert`.
- Contrast: ink on parchment about 13:1 (muted text 6.4:1); gold on midnight about 9:1, on indigo about 7:1, on dusk-violet about 6:1.

## Notes

- "Apply This Wisdom" runs a 60-second breathing circle (4s in, 6s out). Finishing the minute stores the slip in `localStorage` under `krishvaya.intention`; pressing Done early closes without saving.
- KrishVaya is spiritual reflection, not a replacement for professional help.
