import { useSyncExternalStore } from 'react'

const subscribe = (notify) => {
  window.addEventListener('resize', notify)
  return () => window.removeEventListener('resize', notify)
}

/** Current window.innerWidth / innerHeight. Two primitive snapshots keep useSyncExternalStore stable. */
export function useViewportSize() {
  const width = useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 1280,
  )
  const height = useSyncExternalStore(
    subscribe,
    () => window.innerHeight,
    () => 800,
  )
  return { width, height }
}
