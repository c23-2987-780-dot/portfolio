import { cn } from '@/lib/utils.js'

/** Seamless looping row. Pauses on hover/focus; the duplicate copy is hidden from assistive tech. */
export default function Marquee({ children, duration = 40, className }) {
  return (
    <div
      className={cn('marquee marquee-mask overflow-hidden', className)}
      style={{ '--marquee-duration': `${duration}s` }}
    >
      <div className="marquee-track">
        <div className="flex shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
