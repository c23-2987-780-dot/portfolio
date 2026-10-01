import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { cn } from '@/lib/utils.js'
import { ease, spring, staggerChild, staggerParent } from '@/lib/motion.js'
import { useActiveSection } from '@/hooks/useActiveSection.js'
import { useMediaQuery } from '@/hooks/useMediaQuery.js'
import { profile } from '@/data/profile.js'
import SocialIcon from '@/components/ui/SocialIcon.jsx'
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const LINKS = [
  { id: 'pubmats', label: 'Pubmats', page: '/pubmats' },
  { id: 'projects', label: 'Projects', page: '/projects' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Tech stack' },
  { id: 'contact', label: 'Contact' },
]
const SECTION_IDS = ['top', ...LINKS.map((l) => l.id)]

/** Home → scroll to the section. Elsewhere → the dedicated page when one exists, otherwise Home + hash. */
const target = (link, onHome) =>
  !onHome && link.page ? link.page : { pathname: '/', hash: link.id }

function NavItem({ link, active, onHome }) {
  return (
    <Link
      to={target(link, onHome)}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'relative block px-3 py-2 text-sm font-medium transition-colors duration-300',
        active ? 'text-fg' : 'text-muted hover:text-fg',
      )}
    >
      {link.label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          transition={spring}
          className="absolute inset-x-3 -bottom-[13px] h-0.5 bg-accent"
        />
      )}
    </Link>
  )
}

function Burger({ open }) {
  const bar = 'absolute left-0 h-0.5 w-5 rounded bg-current'
  return (
    <span className="relative block size-5" aria-hidden="true">
      <motion.span
        className={bar}
        animate={open ? { top: 9, rotate: 45 } : { top: 3, rotate: 0 }}
      />
      <motion.span
        className={bar}
        style={{ top: 9 }}
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.4 : 1 }}
      />
      <motion.span
        className={bar}
        animate={open ? { top: 9, rotate: -45 } : { top: 15, rotate: 0 }}
      />
    </span>
  )
}

function MobileMenu({ onHome, active, onNavigate }) {
  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease }}
      className="absolute inset-x-0 top-full border-b border-line bg-bg md:hidden"
    >
      <div className="wrap py-4">
        <motion.ul variants={staggerParent(0.05, 0.05)} initial="hidden" animate="show">
          {LINKS.map((link) => (
            <motion.li key={link.id} variants={staggerChild}>
              <Link
                to={target(link, onHome)}
                onClick={onNavigate}
                aria-current={active === link.id ? 'true' : undefined}
                className={cn(
                  'block border-b border-line py-4 text-2xl font-semibold tracking-tight last:border-b-0',
                  active === link.id && 'text-accent-text',
                )}
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
        {profile.socials.length > 0 && (
          <ul className="flex gap-3 pt-4">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-lg border border-line text-lg hover:border-accent hover:text-accent-text"
                >
                  <SocialIcon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const spy = useActiveSection(SECTION_IDS)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuOpen = open && !isDesktop

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  const active = onHome
    ? spy
    : pathname.startsWith('/pubmats')
      ? 'pubmats'
      : pathname.startsWith('/projects')
        ? 'projects'
        : null

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled || menuOpen ? 'border-line bg-bg/90 backdrop-blur-md' : 'border-transparent',
      )}
    >
      <nav aria-label="Primary" className="wrap flex h-16 items-center justify-between">
        <Logo onClick={() => setOpen(false)} />

        <LayoutGroup id="nav">
          <ul className="hidden items-center md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <NavItem link={link} active={active === link.id} onHome={onHome} />
              </li>
            ))}
          </ul>
        </LayoutGroup>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-lg border border-line md:hidden"
          >
            <Burger open={menuOpen} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu onHome={onHome} active={active} onNavigate={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  )
}
