import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { techGroups, techStack } from '@/data/techStack.js'
import { ease } from '@/lib/motion.js'
import FilterBar from '@/components/gallery/FilterBar.jsx'
import SectionHeading from '@/components/ui/SectionHeading.jsx'
import TechBadge from '@/components/ui/TechBadge.jsx'

const LABELS = Object.fromEntries(techGroups.map((g) => [g.id, g.label]))
const GROUP_LABELS = techGroups.map((g) => g.label)

/** Her 17 tools. Category chips filter the grid; tiles reflow with a layout animation. */
export default function TechStack() {
  const [group, setGroup] = useState('All')

  const items = useMemo(
    () => (group === 'All' ? techStack : techStack.filter((t) => LABELS[t.group] === group)),
    [group],
  )
  const counts = useMemo(
    () => ({
      All: techStack.length,
      ...Object.fromEntries(
        GROUP_LABELS.map((label) => [
          label,
          techStack.filter((t) => LABELS[t.group] === label).length,
        ]),
      ),
    }),
    [],
  )

  return (
    <section id="stack" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="wrap">
        <SectionHeading index="04" kicker="Tech stack" title="The tools behind" accent="the work">
          Languages, engines and design software I reach for: {techStack.length} tools across{' '}
          {techGroups.length} areas.
        </SectionHeading>

        <div className="mb-10">
          <FilterBar
            categories={GROUP_LABELS}
            counts={counts}
            active={group}
            onSelect={setGroup}
            label="Filter tools by area"
            pillId="stack-filter"
          />
        </div>

        <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial>
            {items.map((item, i) => (
              <motion.li
                key={item.name}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease, delay: (i % 4) * 0.05 }}
              >
                <TechBadge item={item} groupLabel={LABELS[item.group] ?? item.group} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}
