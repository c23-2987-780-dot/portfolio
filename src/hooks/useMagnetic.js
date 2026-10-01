import { useEffect, useRef } from 'react'
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/**
 * Magnetic pull: the element drifts toward the cursor while it is within `radius` px of its edge,
 * then springs back. Skipped for touch / coarse pointers and reduced motion.
 */
export function useMagnetic({ strength = 0.32, radius = 80 } = {}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.5 })

  useEffect(() => {
    const el = ref.current
    if (!el || reduce || !window.matchMedia('(pointer: fine)').matches) return undefined

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const reach = radius + Math.max(rect.width, rect.height) / 2
      if (Math.hypot(dx, dy) < reach) {
        x.set(dx * strength)
        y.set(dy * strength)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      x.set(0)
      y.set(0)
    }
  }, [reduce, radius, strength, x, y])

  return { ref, style: { x: sx, y: sy } }
}
