import { motion } from 'motion/react'

/** Suspense fallback for lazy routes: the three cobalt portholes, rippling. */
export default function PageLoader() {
  return (
    <div role="status" aria-label="Loading" className="grid min-h-screen place-items-center">
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block size-3 rounded-full bg-cobalt"
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
