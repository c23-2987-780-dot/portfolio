import { useSyncExternalStore } from 'react'

/** Reactive window.matchMedia — safe against tearing, no effect needed. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', notify)
      return () => mq.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Number of gallery columns for the current viewport: 2 → 3 → 4. */
export function useColumns() {
  const lg = useMediaQuery('(min-width: 1280px)')
  const md = useMediaQuery('(min-width: 768px)')
  return lg ? 4 : md ? 3 : 2
}
