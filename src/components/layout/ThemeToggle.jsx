import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils.js'
import { useTheme } from '@/hooks/useTheme.js'

/** Night ↔ day switch. The icon spins out and in; the page changes with a circular wipe from the click. */
export default function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme()
  const night = theme === 'night'

  const onClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    // Keyboard activation reports clientX/Y of 0 (detail === 0), so wipe from the button instead.
    toggle(
      event.detail === 0
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: event.clientX, y: event.clientY },
    )
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      aria-label={night ? 'Switch to day theme' : 'Switch to night theme'}
      className={cn(
        'grid size-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent-text',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="grid place-items-center"
        >
          {night ? (
            <Moon className="size-[1.1rem]" aria-hidden="true" />
          ) : (
            <Sun className="size-[1.1rem]" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
