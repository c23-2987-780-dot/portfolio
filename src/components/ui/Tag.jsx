import { cn } from '@/lib/utils.js'

/** Small label for tools, categories, years. */
export default function Tag({ children, className, tone = 'default' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-1 text-xs leading-none font-medium',
        tone === 'accent'
          ? 'border-accent/40 bg-accent/10 text-accent-text'
          : 'border-line text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
