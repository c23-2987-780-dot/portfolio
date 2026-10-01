# CLAUDE.md

Kyla Manzanero's portfolio: React 19 + JavaScript (no TypeScript), Vite 8, React Router 8, Tailwind 4, Motion.
Human-facing docs are in README.md. This file is for working on the code and for **feeding in her works**.

Out of scope on purpose: a gear/"my setup" section and certifications. Do not add them.

## Commands

`npm run dev` · `npm run build` (runs `check:content` first) · `npm run lint` · `npm run format` ·
`npm run check:content` · `npm run og`

## The one rule

**Components never contain content.** Text lives in `src/data/*.js`; images live in `src/assets/works/**`.
`src/lib/content.js` globs the folders, merges them with the metadata and is the only place that knows how.
Keep `src/data/*.js` plain ESM (no JSX, no `import.meta.glob`) because `vite.config.js` and `scripts/*.mjs`
import them directly in Node.

## Recipe: she sends new images

1. **Look at every image first.** Phone and Facebook exports are sometimes sideways with no EXIF flag
   (five of her first eight pubmats were). Rotate with sharp (`.rotate(270)` = quarter turn counter-clockwise),
   check on a contact sheet, and keep the untouched originals in `private/original-uploads/`.
2. Pubmats → `src/assets/works/pubmats/<kebab-name>.jpg|png`; add a block to `pubmatMeta` in
   `src/data/pubmats.js`. **Read the details off the picture** (titles, dates, venue, wording). Only set
   `year` when a date is printed on it, and leave `tools` out unless she says what was used. Write real `alt`.
   An original beside the edit as `<name>.before.png` turns on the compare slider.
3. A project → folder `src/assets/works/projects/<slug>/` with `cover.png` (+ `01-name.png`…), and an entry in
   `src/data/projects.js`. Describe only what is visible; leave `period` and `stack` out until she confirms them.
   Company screenshots: ask whether they are cleared, then set `confidential: true`.
4. Run `npm run check:content`, then look at it in the browser (home, `/pubmats`, `/projects/<slug>`).
5. Personal files (CV with phone number, source uploads) go in `private/`, which is git-ignored. Never put a
   phone number or street address on the site.

## Conventions

- Imports use the `@/` alias (= `src/`). Prettier: no semicolons, single quotes, width 100.
- **Plain on purpose**: one typeface (Inter), flat cards with hairline borders (`.card`), solid colors. The only
  gradient is the faint hero glow in `Hero.jsx`. Don't add gradient text/backgrounds, grain, glows, ornaments,
  or a second font family.
- Colors come from the semantic tokens in `src/styles/tokens.css` (`bg-bg`, `text-fg`, `text-muted`,
  `border-line`, `bg-accent`, `text-accent-text`…) so night/day just works. Don't hard-code hex in components.
  Gold _text_ in day mode must use `text-accent-text`; cobalt is decorative only.
- Animation: shared easing/springs in `src/lib/motion.js`; `MotionConfig reducedMotion="user"` is set in
  `App.jsx`. Use `Reveal`/`Stagger` for scroll-in, `Button` for anything clickable.
- Tool names are matched by exact string across `techStack.js`, `projects.js` and `pubmats.js`.
- ESLint is pinned to **9**: `eslint-plugin-jsx-a11y` does not support 10 yet. Don't bump it.

## Gotchas

- `import.meta.glob` arguments must be literals, so `content.js` repeats the glob per image variant.
- The lightbox expands from the clicked card via a shared `layoutId`; `entryId` is cleared on first
  navigation so later images slide instead. Import it through `LazyLightbox` (prefetched when the browser
  is idle) so Radix and the viewer stay out of the first-paint bundle.
- Keep the hero tagline static: it is the largest text block, so animating it in delays LCP. Inter is
  preloaded from `vite.config.js` (its file name is hashed, so it has to happen at build time).
- Optional data fields must stay optional in the UI (`period`, `stack`, `socials`, `features`…): hide the
  heading/row when empty rather than rendering a blank.
- Dev-server tip for automated browsers: if the pane is hidden, rAF animations only advance once a screenshot
  is taken, so mid-animation or blank first frames are not bugs.
