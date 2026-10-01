import { cn } from '@/lib/utils.js'

/**
 * CSS-drawn frame that screenshots sit in. `frame` comes from the project's metadata:
 * 'browser' (window chrome), 'phone', 'tablet', or 'none' (just a rounded edge).
 */
export default function DeviceFrame({ frame = 'browser', children, className }) {
  if (frame === 'phone') {
    return (
      <div
        className={cn(
          'mx-auto w-full max-w-[19rem] rounded-[2.6rem] border border-line bg-iron p-2.5',
          className,
        )}
      >
        <div className="relative overflow-hidden rounded-[2.1rem] bg-bg">
          <span
            aria-hidden="true"
            className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black/80"
          />
          {children}
        </div>
      </div>
    )
  }

  if (frame === 'tablet') {
    return (
      <div
        className={cn(
          'mx-auto w-full max-w-2xl rounded-[1.9rem] border border-line bg-iron p-3',
          className,
        )}
      >
        <div className="overflow-hidden rounded-[1.2rem] bg-bg">{children}</div>
      </div>
    )
  }

  if (frame === 'none') {
    return (
      <div className={cn('overflow-hidden rounded-xl border border-line bg-surface-2', className)}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-line bg-surface', className)}>
      <div
        className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3"
        aria-hidden="true"
      >
        <span className="size-2.5 rounded-full bg-bad/70" />
        <span className="size-2.5 rounded-full bg-accent/80" />
        <span className="size-2.5 rounded-full bg-ok/80" />
        <span className="ml-3 h-5 flex-1 rounded-full bg-bg/60" />
      </div>
      {children}
    </div>
  )
}
