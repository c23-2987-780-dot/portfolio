import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import Picture from '@/components/ui/Picture.jsx'
import Tag from '@/components/ui/Tag.jsx'
import { SampleRibbon } from '@/components/ui/DevHint.jsx'
import { useTilt } from '@/hooks/useTilt.js'

const SIZES = '(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 92vw'

/** Shown when a project has no images yet. */
function CoverFallback({ title }) {
  return (
    <div className="grid size-full place-items-center bg-surface-2">
      <span className="text-6xl font-semibold text-muted">{title.charAt(0)}</span>
    </div>
  )
}

/** Project tile: cover, meta, tools. Tilts slightly toward the cursor on desktop. */
export default function ProjectCard({ project }) {
  const tilt = useTilt({ max: 3 })
  const meta = [project.org, project.period].filter(Boolean).join(' · ')
  const stack = project.stack ?? []

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block h-full rounded-xl [perspective:1000px]"
    >
      <motion.article
        style={tilt.style}
        {...tilt.handlers}
        className="card flex h-full flex-col overflow-hidden rounded-xl"
      >
        <div className="relative aspect-video overflow-hidden border-b border-line bg-surface-2">
          {project.cover ? (
            <Picture
              picture={project.cover.picture}
              alt={`${project.title} cover`}
              sizes={SIZES}
              imgClassName="transition-transform duration-700 ease-lamp group-hover:scale-[1.03]"
            />
          ) : (
            <CoverFallback title={project.title} />
          )}
          <SampleRibbon show={project.sample} />
        </div>

        <div className="flex flex-1 flex-col p-5">
          {meta && <p className="text-sm text-muted">{meta}</p>}
          <h3 className="mt-1 text-h3">{project.title}</h3>
          <p className="mt-2 text-muted">{project.tagline}</p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <ul className="flex flex-wrap gap-1.5">
              {stack.slice(0, 4).map((tool) => (
                <li key={tool}>
                  <Tag>{tool}</Tag>
                </li>
              ))}
              {stack.length > 4 && (
                <li>
                  <Tag>+{stack.length - 4}</Tag>
                </li>
              )}
            </ul>
            <span
              aria-hidden="true"
              className="ml-auto grid size-10 shrink-0 place-items-center rounded-lg border border-line transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
            >
              <ArrowUpRight className="size-5" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
