// Turns the files in src/assets/works/** plus the metadata in src/data/** into the objects the UI renders.
// Dropping a PNG into a works folder is enough for it to appear; metadata only adds detail.
//
// import.meta.glob needs literal arguments, so each image variant gets its own glob:
//   pictures  → <picture> sources + intrinsic size, for grids and cards   (AVIF/WebP at 3 widths)
//   large     → one big WebP for the lightbox / carousel
//   original  → the untouched file, for "Open full-size"
import { pubmatCategories, pubmatMeta } from '../data/pubmats.js'
import { projectsMeta } from '../data/projects.js'
import { techStack } from '../data/techStack.js'

const pubPictures = import.meta.glob('/src/assets/works/pubmats/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { w: '480;800;1200', format: 'avif;webp', withoutEnlargement: true, as: 'picture' },
})
const pubLarge = import.meta.glob('/src/assets/works/pubmats/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { w: '1800', format: 'webp', withoutEnlargement: true },
})
const pubOriginal = import.meta.glob('/src/assets/works/pubmats/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const projPictures = import.meta.glob('/src/assets/works/projects/*/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { w: '480;800;1200', format: 'avif;webp', withoutEnlargement: true, as: 'picture' },
})
const projLarge = import.meta.glob('/src/assets/works/projects/*/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { w: '1800', format: 'webp', withoutEnlargement: true },
})
const projOriginal = import.meta.glob('/src/assets/works/projects/*/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

/* ------------------------------------------------------------------ helpers */

const fileName = (path) => path.split('/').pop()
const stemOf = (file) => file.replace(/\.[^.]+$/, '')
const stripOrder = (s) => s.replace(/^\d+[-_.\s]*/, '')
const words = (s) => s.replace(/[-_]+/g, ' ').trim()
const titleCase = (s) => words(s).replace(/\b[a-z]/g, (c) => c.toUpperCase())
const sentenceCase = (s) => {
  const t = words(s)
  return t.charAt(0).toUpperCase() + t.slice(1)
}
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true })
const ratioOf = (picture) => {
  const { w, h } = picture.img
  return w && h ? w / h : 1
}

/* ------------------------------------------------------------------ pubmats */

function buildPubmats() {
  // "<name>.before.png" sits next to "<name>.png" and powers the compare slider.
  const beforeOf = new Map()
  const mains = []
  for (const path of Object.keys(pubPictures)) {
    const stem = stemOf(fileName(path))
    if (stem.endsWith('.before')) beforeOf.set(stem.slice(0, -'.before'.length), path)
    else mains.push(path)
  }

  return mains
    .map((path) => {
      const file = fileName(path)
      const id = stemOf(file)
      const meta = pubmatMeta[file] ?? {}
      const title = meta.title ?? titleCase(stripOrder(id.replace(/^placeholder-/, '')))
      const picture = pubPictures[path]
      const beforePath = beforeOf.get(id)
      return {
        id,
        file,
        title,
        sample: id.startsWith('placeholder-'),
        category: meta.category ?? 'Uncategorised',
        year: meta.year,
        client: meta.client,
        tools: meta.tools ?? [],
        description: meta.description ?? '',
        alt: meta.alt ?? title,
        featured: Boolean(meta.featured),
        picture,
        ratio: ratioOf(picture),
        large: pubLarge[path],
        original: pubOriginal[path],
        before: beforePath
          ? { large: pubLarge[beforePath], original: pubOriginal[beforePath] }
          : null,
      }
    })
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || byName(a.file, b.file))
}

/** Filter chips: the configured order first, then any category in use that the list forgot. */
function buildCategories(items) {
  const used = new Set(items.map((i) => i.category))
  return [
    ...pubmatCategories.filter((c) => used.has(c)),
    ...[...used].filter((c) => !pubmatCategories.includes(c)),
  ]
}

/* ------------------------------------------------------------------ projects */

function buildProjects() {
  const folders = {}
  for (const path of Object.keys(projPictures)) {
    const match = path.match(/\/projects\/([^/]+)\/([^/]+)$/)
    if (match) (folders[match[1]] ??= []).push({ path, file: match[2] })
  }
  const tools = new Map(techStack.map((t) => [t.name, t]))

  return projectsMeta.map((meta) => {
    const files = (folders[meta.slug] ?? []).sort((a, b) => byName(a.file, b.file))
    const image = ({ path, file }) => {
      const picture = projPictures[path]
      return {
        id: `${meta.slug}/${stemOf(file)}`,
        file,
        picture,
        ratio: ratioOf(picture),
        large: projLarge[path],
        original: projOriginal[path],
      }
    }
    const screens = files
      .filter((f) => stemOf(f.file) !== 'cover')
      .map((f) => {
        const caption = meta.captions?.[f.file] ?? sentenceCase(stripOrder(stemOf(f.file)))
        return { ...image(f), caption, title: caption, alt: `${meta.title}: ${caption}` }
      })
    const coverFile = files.find((f) => stemOf(f.file) === 'cover')

    return {
      ...meta,
      frame: meta.frame ?? 'browser',
      features: meta.features ?? [],
      links: meta.links ?? {},
      sample: Boolean(meta.sample),
      confidential: Boolean(meta.confidential),
      cover: coverFile ? image(coverFile) : (screens[0] ?? null),
      screens,
      stackItems: (meta.stack ?? []).map(
        (name) => tools.get(name) ?? { name, group: 'other', icon: '', used: '' },
      ),
    }
  })
}

/* ------------------------------------------------------------------ public API */

export const pubmats = buildPubmats()
export const pubmatFilters = buildCategories(pubmats)
export const projects = buildProjects()

export const stats = { pubmats: pubmats.length, projects: projects.length, tools: techStack.length }

/** Curated picks when anything is flagged `featured`, otherwise just the first few. */
const pick = (items, n) => {
  const flagged = items.filter((i) => i.featured)
  return (flagged.length ? flagged : items).slice(0, n)
}
export const featuredPubmats = (n = 6) => pick(pubmats, n)
export const featuredProjects = (n = 3) => pick(projects, n)
export const getProject = (slug) => projects.find((p) => p.slug === slug)
export const getAdjacentProjects = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i < 0 || projects.length < 2) return { prev: null, next: null }
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  }
}
