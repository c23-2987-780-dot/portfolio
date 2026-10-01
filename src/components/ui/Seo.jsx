import { profile } from '@/data/profile.js'
import { firstName } from '@/lib/utils.js'

/**
 * Per-page <title> and description. React 19 hoists these into <head>, so no helmet library is needed.
 * With no `title` it renders the site-wide title from src/data/profile.js.
 */
export default function Seo({ title, description }) {
  const fullTitle = title ? `${title} · ${firstName(profile.name)}` : profile.site.title
  const text = description ?? profile.site.description
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={text} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={text} />
    </>
  )
}
