// Builds public/og-image.png (1200×630), the preview card shown when the site is shared:  npm run og
// Uses the hero photo in an arch frame plus the name and title from src/data/profile.js.
// Re-run it after changing the name or tagline.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { profile } from '../src/data/profile.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const W = 1200
const H = 630
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"

// Arch-framed photo: same shallow arch as the site (elliptical top, softly rounded bottom).
const pw = 410
const ph = 546
const px = 720
const py = 42
const ry = Math.round(ph * 0.3)
const r = 26
const archPath = `M0 ${ry} A${pw / 2} ${ry} 0 0 1 ${pw} ${ry} V${ph - r} Q${pw} ${ph} ${pw - r} ${ph} H${r} Q0 ${ph} 0 ${ph - r} Z`

const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><path d="${archPath}" fill="#fff"/></svg>`,
)
const photo = await sharp(path.join(root, 'src/assets/profile/profile-picture.jpeg'))
  .resize(pw, ph, { fit: 'cover', position: 'attention' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer()

const esc = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const [first, ...rest] = profile.name.trim().split(/\s+/)

const backdrop = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="gold" cx="0.1" cy="0.05" r="0.6"><stop offset="0" stop-color="#E9AB58" stop-opacity="0.16"/><stop offset="1" stop-color="#E9AB58" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#15111C"/>
  <rect width="${W}" height="${H}" fill="url(#gold)"/>
</svg>`

const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <g transform="translate(${px} ${py})"><path d="${archPath}" fill="none" stroke="#C5912C" stroke-opacity="0.7" stroke-width="2"/></g>
  <text x="80" y="170" font-family="${SANS}" font-size="22" font-weight="600" fill="#E9AB58">Portfolio</text>
  <text x="76" y="318" font-family="${SANS}" font-size="104" font-weight="700" letter-spacing="-3" fill="#F6EEDD">${esc(first)}</text>
  <text x="76" y="426" font-family="${SANS}" font-size="104" font-weight="700" letter-spacing="-3" fill="#F6EEDD">${esc(rest.join(' '))}</text>
  <text x="80" y="500" font-family="${SANS}" font-size="32" font-weight="500" fill="#E9AB58">${esc(profile.title)}</text>
</svg>`

await sharp(Buffer.from(backdrop))
  .composite([
    { input: photo, left: px, top: py },
    { input: Buffer.from(frame), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'public/og-image.png'))

console.log('Wrote public/og-image.png (1200×630)')
