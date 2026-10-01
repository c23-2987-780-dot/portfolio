import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal.jsx'

const ICONS = { ojt: Briefcase, education: GraduationCap }

/** Vertical timeline. The accent line draws itself as the section scrolls through the viewport. */
export default function Timeline({ entries }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref} className="relative pl-12">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-4 w-px bg-line" />
      <motion.span
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-4 w-px origin-top bg-accent"
      />
      <ol className="space-y-12">
        {entries.map((entry, i) => {
          const Icon = ICONS[entry.type] ?? Briefcase
          return (
            <Reveal as="li" key={`${entry.org}-${i}`} delay={i * 0.06} className="relative">
              <span className="absolute top-0 -left-12 grid size-8 place-items-center rounded-full border border-line bg-bg text-accent-text">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {entry.period && (
                <p className="text-sm font-medium text-accent-text">{entry.period}</p>
              )}
              <h4 className="mt-0.5 text-lg font-semibold tracking-tight">{entry.role}</h4>
              <p className="text-muted">
                {entry.org}
                {entry.location && ` · ${entry.location}`}
              </p>
              {entry.summary && <p className="mt-3 text-muted">{entry.summary}</p>}
              {entry.highlights?.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {entry.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          )
        })}
      </ol>
    </div>
  )
}
