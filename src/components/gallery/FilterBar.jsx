import { LayoutGroup } from 'motion/react'
import Chip from '@/components/ui/Chip.jsx'

/** "All" plus one chip per category. The gold pill slides between them. */
export default function FilterBar({ categories, counts, active, onSelect, label, pillId }) {
  return (
    <LayoutGroup id={pillId}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {['All', ...categories].map((category) => (
          <Chip
            key={category}
            pillId={pillId}
            active={active === category}
            count={counts[category]}
            onClick={() => onSelect(category)}
          >
            {category}
          </Chip>
        ))}
      </div>
    </LayoutGroup>
  )
}
