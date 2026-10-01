import { Suspense, lazy, useEffect, useState } from 'react'

const loadLightbox = () => import('./Lightbox.jsx')
const Lightbox = lazy(loadLightbox)

const whenIdle = (callback) =>
  'requestIdleCallback' in window
    ? window.requestIdleCallback(callback, { timeout: 4000 })
    : window.setTimeout(callback, 2000)
const cancelIdle = (id) =>
  'cancelIdleCallback' in window ? window.cancelIdleCallback(id) : window.clearTimeout(id)

/**
 * Drop-in for <Lightbox>. The viewer (and the dialog library behind it) is not needed for first paint,
 * so it loads once the browser is idle. By the time anyone clicks a thumbnail it is already there.
 * Once mounted it stays mounted so the close animation can play.
 */
export default function LazyLightbox(props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = whenIdle(() => setReady(true))
    return () => cancelIdle(id)
  }, [])

  if (!ready && props.openId == null) return null
  return (
    <Suspense fallback={null}>
      <Lightbox {...props} />
    </Suspense>
  )
}
