import { useLayoutEffect } from 'react'
import { motion } from 'motion/react'
import { ease } from '@/lib/motion.js'

/**
 * Wraps each route: the old page fades out, the new one fades and slides up a little.
 * Also resets scroll to the top when a new page mounts (hash targets are handled by ScrollManager).
 */
export default function PageTransition({ children }) {
  useLayoutEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
    >
      {children}
    </motion.div>
  )
}
