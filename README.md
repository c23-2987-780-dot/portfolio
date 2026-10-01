# Kyla Manzanero — portfolio

A React + JavaScript portfolio for pubmats (school posters and graphics) and the projects from her
on-the-job training at CloudSwyft, plus about, experience, tech stack and contact.

The look is deliberately plain: one sans typeface (Inter), flat surfaces, hairline borders. The palette
comes from the profile photo (lamp gold on a deep violet-black, with a cream "day" theme), and the only
gradient is a faint glow behind the hero. Everything on screen is driven by files in `src/data/` and
`src/assets/works/`, so content changes never touch components.

## Run it

Needs Node 22.22 or newer (`nvm use` reads `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173 — new images appear without a restart
```

| Command                           | What it does                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`                     | Dev server with hot reload                                                     |
| `npm run build`                   | Checks the content, then builds to `dist/`                                     |
| `npm run preview`                 | Serves the production build locally                                            |
| `npm run check:content`           | Validates the content files (also runs before every build)                     |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                              |
| `npm run og`                      | Rebuilds `public/og-image.png`, the link-preview card, from the photo and name |

## Add a pubmat

1. Save the image in `src/assets/works/pubmats/` (PNG or JPG, lowercase names with dashes:
   `summer-sale.png`). Check that it is the right way up; the site does not rotate images.
   Export at 1080–2400 px on the long edge; the site makes its own small AVIF/WebP versions.
2. That is enough for it to appear. For a proper title and details, add an entry in
   `src/data/pubmats.js` keyed by the file name:

   ```js
   'summer-sale.png': {
     title: 'Summer Sale',
     category: 'Announcements',      // one of pubmatCategories
     year: 2026,                     // only if a date is printed on it
     client: 'Company or org',
     tools: ['Photoshop', 'Canva'],  // optional, names from techStack.js
     description: 'One line on what it was for.',
     alt: 'Describe the picture for screen readers.',
     featured: true,                 // also shows on the home page
   },
   ```

3. **Before / after:** save the original beside it as `summer-sale.before.png`. A compare slider appears
   in the lightbox automatically.

Filter chips are built from the categories in use, so an empty category never shows up.

## Add an OJT project

1. Make a folder `src/assets/works/projects/<slug>/` (lowercase, dashes) with a `cover.png`. Add more
   screenshots as `01-login.png`, `02-dashboard.png`, … if you have them: the number sets the order and the
   words become the caption. A project with only a cover is fine.
2. Add an entry in `src/data/projects.js` with the same `slug` (copy an existing one). Only `title`, `tagline`,
   `role`, `org` and `summary` are required. `period`, `stack` (names from `techStack.js`), `features`,
   `problem` / `solution` / `outcome` and `links: { demo, repo }` appear when filled in. `frame` is how
   screenshots are framed: `browser`, `phone`, `tablet` or `none`.
3. For company tools, get the supervisor's OK first and set `confidential: true` to add a note.

## Everything else

| To change                                                                 | Edit                     |
| ------------------------------------------------------------------------- | ------------------------ |
| Name, title, tagline, email, socials, résumé, bio, site title/description | `src/data/profile.js`    |
| Timeline (OJT, school)                                                    | `src/data/experience.js` |
| Tools, grouping, one-line descriptions                                    | `src/data/techStack.js`  |
| Colors and type                                                           | `src/styles/tokens.css`  |

- **Social links:** `socials` is empty on purpose. Add `{ label, href, icon }` entries and they appear in the
  footer and contact section.
- **Résumé button:** put the PDF in `public/resume/` and set `resume` in `profile.js`. Anything in `public/`
  is downloadable by anyone, and a CV normally includes a phone number, so use a version without one.
- **Site address:** set `site.url` in `profile.js` (or `VITE_SITE_URL`) once it is hosted, so link previews
  and `sitemap.xml` are correct.

`private/` is git-ignored. It holds the original uploads, the CV and other personal files; never move
those into `public/` or `src/`.

## Contact form

Without configuration the form opens the visitor's email app (`mailto:`). To send from the page instead,
create a form on Formspree or Web3Forms, copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT`.

## Deploy

Any static host works. Build command `npm run build`, output `dist`, Node 22+. `vercel.json` and
`public/_redirects` (Netlify, Cloudflare Pages) already route deep links such as `/projects/my-app` to the app.

## What's inside

React 19 · Vite 8 · React Router 8 · Tailwind CSS 4 · Motion · Radix Dialog · vite-imagetools (AVIF/WebP) ·
Inter (Fontsource) · Lucide + Tabler icons.

Night is the default theme with an optional day mode. Animation respects `prefers-reduced-motion`, pages
are keyboard-complete, and the lightbox traps focus. Browsers: current Chrome, Edge, Safari 16.4+ and
Firefox 128+ (the Tailwind 4 baseline); the night↔day wipe uses the View Transitions API and falls back to
an instant switch elsewhere.
