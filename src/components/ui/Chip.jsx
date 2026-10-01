import { motion } from 'motion/react'
import { cn } from '@/lib/utils.js'
import { spring } from '@/lib/motion.js'

/**
 * Toggle chip for filters / tabs. Give every chip in a group the same `pillId` and the gold
 * highlight slides between them (shared layout animation).
 */
export default function Chip({ active = false, count, pillId, children, className, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'relative inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300',
        active
          ? 'border-transparent text-on-accent'
          : 'border-line text-muted hover:border-accent/60 hover:text-fg',
        className,
      )}
      {...rest}
    >
      {active && (
        <motion.span
          layoutId={pillId}
          transition={spring}
          className="absolute inset-0 rounded-full bg-accent"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {count != null && <span className="text-xs opacity-70">{count}</span>}
      </span>
    </button>
  )
}
