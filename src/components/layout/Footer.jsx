import { Link } from 'react-router'
import { profile } from '@/data/profile.js'
import SocialIcon from '@/components/ui/SocialIcon.jsx'

const YEAR = new Date().getFullYear()

const NAV = [
  { label: 'Pubmats', to: '/pubmats' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: { pathname: '/', hash: 'about' } },
  { label: 'Tech stack', to: { pathname: '/', hash: 'stack' } },
  { label: 'Contact', to: { pathname: '/', hash: 'contact' } },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="text-lg font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-2 max-w-sm text-muted">{profile.title}</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-4 inline-block text-sm underline decoration-line underline-offset-4 transition-colors hover:text-accent-text hover:decoration-accent"
          >
            {profile.email}
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="mb-3 text-sm font-medium">Explore</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-muted transition-colors hover:text-accent-text">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {profile.socials.length > 0 && (
          <div className="md:col-span-3">
            <p className="mb-3 text-sm font-medium">Elsewhere</p>
            <ul className="space-y-2 text-sm">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent-text"
                  >
                    <SocialIcon name={s.icon} className="size-4" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-5 text-sm text-muted">
          <p>
            © {YEAR} {profile.name}
          </p>
          <p>Built with React</p>
        </div>
      </div>
    </footer>
  )
}
