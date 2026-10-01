// Sanity-checks the content files before a build:  npm run check:content
//   ERRORS  fail the build (broken references that would show up as missing pieces on the site)
//   WARNINGS are advice (missing alt text, huge files, template placeholders still in place)
import { access, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { profile } from '../src/data/profile.js'
import { pubmatCategories, pubmatMeta } from '../src/data/pubmats.js'
import { projectsMeta } from '../src/data/projects.js'
import { techGroups, techStack } from '../src/data/techStack.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pubDir = path.join(root, 'src/assets/works/pubmats')
const projDir = path.join(root, 'src/assets/works/projects')

const IMAGE = /\.(png|jpe?g|webp)$/i
const MAX_BYTES = 6 * 1024 * 1024
const MAX_EDGE = 4000
const MIN_EDGE = 800
const FRAMES = ['browser', 'phone', 'tablet', 'none']

const errors = []
const warnings = []
const error = (msg) => errors.push(msg)
const warn = (msg) => warnings.push(msg)

const stemOf = (file) => file.replace(/\.[^.]+$/, '')
const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  )
const images = async (dir) => (await readdir(dir).catch(() => [])).filter((f) => IMAGE.test(f))
const list = (items, limit = 6) =>
  items.slice(0, limit).join(', ') + (items.length > limit ? `, +${items.length - limit} more` : '')

/** Flags oversized / tiny images. Real works only — placeholders are tiny on purpose. */
async function checkImage(file, label) {
  const { size } = await stat(file)
  if (size > MAX_BYTES)
    warn(
      `${label} is ${(size / 1048576).toFixed(1)} MB — export a smaller PNG (it is shipped as the full-size download).`,
    )
  const { width = 0, height = 0 } = await sharp(file).metadata()
  const edge = Math.max(width, height)
  if (edge > MAX_EDGE)
    warn(
      `${label} is ${width}×${height} — longest edge over ${MAX_EDGE}px is overkill for the web.`,
    )
  if (edge < MIN_EDGE)
    warn(`${label} is only ${width}×${height} — it will look soft in the lightbox.`)
}

/* ------------------------------------------------------------------ tech stack */

const groupIds = new Set(techGroups.map((g) => g.id))
const toolNames = new Set()
for (const tool of techStack) {
  if (toolNames.has(tool.name)) error(`techStack.js: "${tool.name}" is listed twice.`)
  toolNames.add(tool.name)
  if (!groupIds.has(tool.group))
    error(`techStack.js: "${tool.name}" uses unknown group "${tool.group}".`)
}

/* ------------------------------------------------------------------ pubmats */

const pubFiles = await images(pubDir)
const befores = pubFiles.filter((f) => stemOf(f).endsWith('.before'))
const mains = pubFiles.filter((f) => !stemOf(f).endsWith('.before'))
const mainStems = new Set(mains.map(stemOf))

for (const f of befores) {
  const base = stemOf(f).slice(0, -'.before'.length)
  if (!mainStems.has(base)) error(`pubmats/${f} has no matching "${base}.png" to compare against.`)
}

for (const key of Object.keys(pubmatMeta)) {
  if (!mains.includes(key))
    error(`pubmats.js has details for "${key}", but that file is not in src/assets/works/pubmats/.`)
}

const noAlt = []
const unknownCategory = []
for (const file of mains) {
  const meta = pubmatMeta[file] ?? {}
  const placeholder = file.startsWith('placeholder-')
  for (const tool of meta.tools ?? []) {
    if (!toolNames.has(tool))
      error(`pubmats.js: "${file}" lists tool "${tool}", which is not in techStack.js.`)
  }
  if (meta.category && !pubmatCategories.includes(meta.category))
    unknownCategory.push(`${file} → "${meta.category}"`)
  if (!placeholder) {
    if (!meta.alt) noAlt.push(file)
    await checkImage(path.join(pubDir, file), `pubmats/${file}`)
  }
}
if (unknownCategory.length)
  warn(`Category not in pubmatCategories (shows as an extra chip): ${list(unknownCategory)}.`)
if (noAlt.length)
  warn(`${noAlt.length} pubmat(s) have no alt text, so the title is used: ${list(noAlt)}.`)

/* ------------------------------------------------------------------ projects */

const folders = (await readdir(projDir, { withFileTypes: true }).catch(() => []))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
const seen = new Set()

for (const p of projectsMeta) {
  const where = `projects.js "${p.slug}"`
  if (seen.has(p.slug)) error(`${where}: duplicate slug.`)
  seen.add(p.slug)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug))
    error(`${where}: slug must be lowercase letters, numbers and dashes.`)
  for (const field of ['title', 'tagline', 'role', 'org', 'summary']) {
    if (!p[field]?.trim()) error(`${where}: "${field}" is empty.`)
  }
  for (const tool of p.stack ?? []) {
    if (!toolNames.has(tool))
      error(`${where}: stack lists "${tool}", which is not in techStack.js.`)
  }
  if (p.frame && !FRAMES.includes(p.frame))
    error(`${where}: frame must be one of ${FRAMES.join(', ')}.`)
  for (const [kind, url] of Object.entries(p.links ?? {})) {
    if (url && !/^https?:\/\//.test(url))
      error(`${where}: links.${kind} must start with http:// or https://.`)
  }

  const dir = path.join(projDir, p.slug)
  if (!(await exists(dir))) {
    error(`${where}: folder src/assets/works/projects/${p.slug}/ does not exist.`)
    continue
  }
  const files = await images(dir)
  if (!files.some((f) => stemOf(f) === 'cover')) error(`${where}: no cover.png in its folder.`)
  for (const file of Object.keys(p.captions ?? {})) {
    if (!files.includes(file)) warn(`${where}: captions has "${file}", which is not in the folder.`)
  }
  if (!p.sample) for (const f of files) await checkImage(path.join(dir, f), `${p.slug}/${f}`)
}
for (const folder of folders) {
  if (!seen.has(folder))
    warn(
      `Folder src/assets/works/projects/${folder}/ has no entry in projects.js, so it is not shown.`,
    )
}

/* ------------------------------------------------------------------ profile + template leftovers */

const todo = []
if (/surname/i.test(profile.name)) todo.push('name')
if (/@example\.com$/i.test(profile.email)) todo.push('email')
if (/City, Country/i.test(profile.location)) todo.push('location')
if (/example\.com/i.test(profile.site.url)) todo.push('site.url')
if (todo.length) warn(`profile.js still has template values for: ${todo.join(', ')}.`)

if (profile.resume && !(await exists(path.join(root, 'public', profile.resume)))) {
  error(`profile.js: resume "${profile.resume}" is not in /public.`)
}

const placeholderPubmats = mains.filter((f) => f.startsWith('placeholder-')).length
const sampleProjects = projectsMeta.filter((p) => p.sample).length
if (placeholderPubmats || sampleProjects) {
  warn(
    `Template placeholders still in place: ${placeholderPubmats} pubmat(s), ${sampleProjects} sample project(s). ` +
      'Remove with "npm run placeholders:clean" once real works are added.',
  )
}

/* ------------------------------------------------------------------ report */

const withDetails = mains.filter((f) => pubmatMeta[f]).length
console.log('check:content')
console.log(
  `  pubmats   ${mains.length} file(s), ${befores.length} with before/after, ${withDetails} with details`,
)
console.log(`  projects  ${projectsMeta.length}`)
console.log(`  tools     ${techStack.length} in ${techGroups.length} groups`)

if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} warning(s)`)
  for (const w of warnings) console.log(`   - ${w}`)
}
if (errors.length) {
  console.log(`\n✖  ${errors.length} error(s)`)
  for (const e of errors) console.log(`   - ${e}`)
  console.log('\nFix the errors above, then run again.')
  process.exitCode = 1
} else {
  console.log('\n✔  No errors.')
}
