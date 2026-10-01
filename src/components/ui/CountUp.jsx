import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { ease } from '@/lib/motion.js'

/** Counts from 0 to `value` the first time it scrolls into view. Writes straight to the DOM — no re-renders. */
export default function CountUp({ value, duration = 1.6, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (!inView) return undefined
    if (reduce) {
      count.set(value)
      return undefined
    }
    const controls = animate(count, value, { duration, ease })
    return () => controls.stop()
  }, [inView, reduce, value, duration, count])

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  )
}
