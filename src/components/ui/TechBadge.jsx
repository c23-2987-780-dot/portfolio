import { cn } from '@/lib/utils.js'
import TechIcon from './TechIcon.jsx'

/** One tool tile: icon, name, group and a one-line description. Lifts slightly on hover. */
export default function TechBadge({ item, groupLabel, className }) {
  return (
    <div
      className={cn(
        'card group flex h-full items-start gap-4 rounded-xl p-5 transition-transform duration-300 ease-lamp hover:-translate-y-0.5',
        className,
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-surface-2 text-[1.3rem] text-accent-text transition-colors duration-300 group-hover:bg-accent group-hover:text-on-accent">
        <TechIcon name={item.icon} label={item.name} />
      </span>
      <div className="min-w-0">
        <p className="leading-tight font-medium">{item.name}</p>
        <p className="mt-0.5 text-xs text-muted">{groupLabel}</p>
        {item.used && <p className="mt-2 text-sm leading-snug text-muted">{item.used}</p>}
      </div>
    </div>
  )
}
