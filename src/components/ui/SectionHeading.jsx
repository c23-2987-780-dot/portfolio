import { cn } from '@/lib/utils.js'
import { Reveal } from './Reveal.jsx'

/** Semibold title, an optional intro line, and an optional action on the right. */
export default function SectionHeading({ title, action, children, className }) {
  return (
    <header
      className={cn('mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14', className)}
    >
      <div className="max-w-2xl">
        <Reveal>
          <h2 className="text-h2">{title}</h2>
        </Reveal>
        {children && (
          <Reveal delay={0.08}>
            <p className="mt-4 text-lg text-muted">{children}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.12}>{action}</Reveal>}
    </header>
  )
}
