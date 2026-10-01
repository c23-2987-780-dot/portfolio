import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

/**
 * Pointer-driven 3D tilt. Returns motion values for `style` and handlers for the element.
 * px / py are the pointer position from -0.5 to 0.5 (0 when idle) so callers can derive parallax.
 */
export function useTilt({ max = 8, perspective = 900 } = {}) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 180, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 180, damping: 18, mass: 0.6 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])

  const onPointerMove = (event) => {
    if (reduce || event.pointerType === 'touch') return
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }
  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }

  return {
    px: sx,
    py: sy,
    style: reduce ? {} : { rotateX, rotateY, transformPerspective: perspective },
    handlers: { onPointerMove, onPointerLeave },
  }
}
