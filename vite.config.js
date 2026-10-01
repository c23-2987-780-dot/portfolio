import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import { profile } from './src/data/profile.js'
import { projectsMeta } from './src/data/projects.js'

const escapeAttr = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

// Fonts used above the fold. Preloading them stops the headline reflowing when the real font swaps in.
const CRITICAL_FONTS = /inter-latin-wght-normal-.+\.woff2$/

/**
 * Single source of truth for site metadata: fills the __SITE_*__ tokens in index.html from
 * src/data/profile.js, preloads the critical fonts (their file names are hashed, so this has to
 * happen at build time), and emits sitemap.xml + robots.txt for the production build.
 */
function siteMeta(siteUrl) {
  return {
    name: 'portfolio-site-meta',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const filled = html
          .replaceAll('__SITE_URL__', siteUrl)
          .replaceAll('__SITE_TITLE__', escapeAttr(profile.site.title))
          .replaceAll('__SITE_DESCRIPTION__', escapeAttr(profile.site.description))

        const tags = Object.keys(ctx.bundle ?? {})
          .filter((file) => CRITICAL_FONTS.test(file))
          .map((file) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `/${file}`,
              crossorigin: '',
            },
            injectTo: 'head',
          }))
        return { html: filled, tags }
      },
    },
    generateBundle() {
      const paths = [
        '/',
        '/pubmats',
        '/projects',
        ...projectsMeta.map((p) => `/projects/${p.slug}`),
      ]
      const urls = paths
        .map((p) => `  <url><loc>${siteUrl}${p === '/' ? '' : p}</loc></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || profile.site.url).replace(/\/$/, '')

  return {
    plugins: [react(), tailwindcss(), imagetools(), siteMeta(siteUrl)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      target: 'es2022',
    },
  }
})
