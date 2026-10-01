import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils.js'
import { profile } from '@/data/profile.js'

/** Plain text wordmark. Clicking it on the home page scrolls back to the top. */
export default function Logo({ className, onClick }) {
  const { pathname } = useLocation()
  const handleClick = (event) => {
    onClick?.(event)
    if (pathname === '/') {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Link
      to="/"
      onClick={handleClick}
      aria-label={`${profile.name} — home`}
      className={cn(
        'text-base font-semibold tracking-tight transition-colors hover:text-accent-text',
        className,
      )}
    >
      {profile.name}
    </Link>
  )
}
