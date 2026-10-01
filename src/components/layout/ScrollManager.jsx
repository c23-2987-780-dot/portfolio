import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/** Scrolls to an element id, retrying briefly because the target may mount a moment after navigation. */
function scrollToId(id, behavior) {
  let tries = 0
  let timer
  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior, block: 'start' })
      return
    }
    if (tries++ < 60) timer = window.setTimeout(tick, 50)
  }
  timer = window.setTimeout(tick, 0)
  return () => window.clearTimeout(timer)
}

/**
 * Handles #hash links. Same-page hashes scroll smoothly; a hash on a freshly mounted page jumps
 * straight there. (Plain route changes reset to the top inside PageTransition.)
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const previous = useRef(pathname)

  useEffect(() => {
    const samePage = previous.current === pathname
    previous.current = pathname
    if (!hash) return undefined
    return scrollToId(decodeURIComponent(hash.slice(1)), samePage ? 'smooth' : 'instant')
  }, [pathname, hash, key])

  return null
}
