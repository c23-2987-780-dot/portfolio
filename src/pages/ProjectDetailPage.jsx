import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, EyeOff } from 'lucide-react'
import { getAdjacentProjects, getProject } from '@/lib/content.js'
import Button from '@/components/ui/Button.jsx'
import PageHeader from '@/components/ui/PageHeader.jsx'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal.jsx'
import Seo from '@/components/ui/Seo.jsx'
import Tag from '@/components/ui/Tag.jsx'
import TechIcon from '@/components/ui/TechIcon.jsx'
import Picture from '@/components/ui/Picture.jsx'
import ScreenshotCarousel from '@/components/projects/ScreenshotCarousel.jsx'
import NotFound from './NotFound.jsx'

const STORY = [
  { key: 'problem', label: 'The problem' },
  { key: 'solution', label: 'The build' },
  { key: 'outcome', label: 'The outcome' },
]

function Neighbour({ project, direction }) {
  const next = direction === 'next'
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="card group flex items-center gap-5 rounded-xl p-4"
    >
      {!next && (
        <ArrowLeft
          className="size-5 shrink-0 text-accent-text transition-transform duration-300 group-hover:-translate-x-1"
          aria-hidden="true"
        />
      )}
      {project.cover && (
        <div className="hidden aspect-video w-28 shrink-0 overflow-hidden rounded-md border border-line sm:block">
          <Picture picture={project.cover.picture} alt="" sizes="112px" />
        </div>
      )}
      <div className={`min-w-0 flex-1 ${next ? 'text-right' : ''}`}>
        <p className="text-sm text-muted">{next ? 'Next project' : 'Previous project'}</p>
        <p className="truncate text-lg font-semibold tracking-tight">{project.title}</p>
      </div>
      {next && (
        <ArrowRight
          className="size-5 shrink-0 text-accent-text transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound what="project" />

  const { prev, next } = getAdjacentProjects(slug)
  const images = project.screens.length
    ? project.screens
    : project.cover
      ? [
          {
            ...project.cover,
            caption: project.title,
            title: project.title,
            alt: `${project.title}`,
          },
        ]
      : []
  const story = STORY.filter((s) => project[s.key])
  const meta = [
    { label: 'Role', value: project.role },
    { label: 'Organisation', value: project.org },
    { label: 'Period', value: project.period },
  ].filter((m) => m.value)
  const hasLinks = project.links.demo || project.links.repo
  const showSideBySide = project.features.length > 0 || project.stackItems.length > 0 || hasLinks

  return (
    <>
      <Seo title={project.title} description={project.summary} />
      <article className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="wrap">
          <PageHeader title={project.title} back={{ to: '/projects', label: 'All projects' }}>
            {project.tagline}
          </PageHeader>

          {meta.length > 0 && (
            <Reveal
              as="dl"
              className="-mt-4 mb-12 grid gap-x-10 gap-y-5 border-y border-line py-6 sm:grid-cols-3"
            >
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-sm text-muted">{m.label}</dt>
                  <dd className="mt-1 font-medium">{m.value}</dd>
                </div>
              ))}
            </Reveal>
          )}

          {images.length > 0 && <ScreenshotCarousel project={project} images={images} />}

          {project.confidential && (
            <Reveal className="mt-10 flex max-w-2xl items-start gap-3 rounded-lg border border-line p-4 text-sm text-muted">
              <EyeOff className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" />
              Screenshots are from an internal company tool; sensitive details are left out.
            </Reveal>
          )}

          <Reveal className="mt-20 max-w-3xl">
            <h2 className="text-h2">Overview</h2>
            <p className="mt-4 text-lg text-muted">{project.summary}</p>
          </Reveal>

          {story.length > 0 && (
            <Stagger as="ul" className="mt-10 grid gap-4 md:grid-cols-3">
              {story.map((s) => (
                <StaggerItem as="li" key={s.key}>
                  <div className="card h-full rounded-xl p-6">
                    <h3 className="text-base font-semibold">{s.label}</h3>
                    <p className="mt-3 text-muted">{project[s.key]}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {showSideBySide && (
            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              {project.features.length > 0 && (
                <Reveal>
                  <h2 className="text-h3">What it does</h2>
                  <ul className="mt-5 space-y-3">
                    {project.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-text">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {(project.stackItems.length > 0 || hasLinks) && (
                <Reveal delay={0.06}>
                  {project.stackItems.length > 0 && (
                    <>
                      <h2 className="text-h3">Tools used</h2>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {project.stackItems.map((tool) => (
                          <li key={tool.name}>
                            <Tag className="gap-2 px-3 py-2 text-sm">
                              <TechIcon
                                name={tool.icon}
                                label={tool.name}
                                className="text-base text-accent-text"
                              />
                              {tool.name}
                            </Tag>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {hasLinks && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.links.demo && (
                        <Button href={project.links.demo} arrow>
                          Live demo
                        </Button>
                      )}
                      {project.links.repo && (
                        <Button href={project.links.repo} variant="secondary" arrow>
                          Source code
                        </Button>
                      )}
                    </div>
                  )}
                </Reveal>
              )}
            </div>
          )}

          {(prev || next) && prev?.slug !== project.slug && (
            <nav aria-label="More projects" className="mt-20 grid gap-4 md:grid-cols-2">
              {prev && <Neighbour project={prev} direction="prev" />}
              {next && <Neighbour project={next} direction="next" />}
            </nav>
          )}
        </div>
      </article>
    </>
  )
}
