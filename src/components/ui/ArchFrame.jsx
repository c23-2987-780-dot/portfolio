import { cn } from '@/lib/utils.js'

// A shallow arch (dormer-window shape from the photo). Elliptical top corners rather than a full
// semicircle so the lamp post at the top-left of the portrait isn't clipped.
const ARCH = '[border-radius:50%_50%_1rem_1rem/30%_30%_1rem_1rem]'

/** Arch-topped frame with a thin gold border. */
export default function ArchFrame({ children, className }) {
  return (
    <div className={cn('overflow-hidden border border-gold-600/70 bg-surface', ARCH, className)}>
      {children}
    </div>
  )
}
