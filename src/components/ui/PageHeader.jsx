import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from './Reveal.jsx'

/** Header for standalone pages: back link, title, intro text. */
export default function PageHeader({ title, back = { to: '/', label: 'Home' }, children }) {
  return (
    <header className="mb-12 md:mb-16">
      <Reveal>
        <Link
          to={back.to}
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent-text"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          {back.label}
        </Link>
      </Reveal>
      <Reveal delay={0.06}>
        <h1 className="mt-6 text-h1">{title}</h1>
      </Reveal>
      {children && (
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-2xl text-lg text-muted">{children}</p>
        </Reveal>
      )}
    </header>
  )
}
