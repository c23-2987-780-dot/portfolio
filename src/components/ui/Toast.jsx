import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils.js'
import { spring } from '@/lib/motion.js'

/** Bottom-centre status toast. The outer div centres it so Motion owns the inner transform. */
export default function Toast({ open, tone = 'ok', children }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {open && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={spring}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-full border bg-surface-2 px-5 py-3 text-sm shadow-2xl',
              tone === 'ok' ? 'border-ok/40' : 'border-bad/50',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('size-2 rounded-full', tone === 'ok' ? 'bg-ok' : 'bg-bad')}
            />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
