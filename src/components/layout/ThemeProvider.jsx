import { useCallback, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { ThemeContext } from '@/context/theme.js'

const THEME_COLOR = { night: '#15111C', day: '#FBF5E8' }

function applyTheme(next) {
  document.documentElement.dataset.theme = next
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
  try {
    localStorage.setItem('theme', next)
  } catch {
    /* private mode — the choice just won't persist */
  }
}

/**
 * Night/day state. The initial value comes from <html data-theme>, which the inline script in
 * index.html sets before first paint. Toggling uses the View Transitions API for a circular wipe
 * from the click point and falls back to an instant swap.
 */
export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'night')

  const toggle = useCallback(
    (origin) => {
      const next = theme === 'night' ? 'day' : 'night'
      const swap = () => {
        applyTheme(next)
        setTheme(next)
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduce) {
        swap()
        return
      }
      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? 0
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )
      const transition = document.startViewTransition(() => flushSync(swap))
      transition.ready
        .then(() =>
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            {
              duration: 700,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          ),
        )
        .catch(() => {})
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
