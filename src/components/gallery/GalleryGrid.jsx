import { useMemo } from 'react'
import { AnimatePresence } from 'motion/react'
import { useColumns } from '@/hooks/useMediaQuery.js'
import { masonry } from '@/lib/utils.js'
import GalleryCard from './GalleryCard.jsx'

/**
 * Masonry built from known aspect ratios (so it's stable and never shifts as images load).
 * Items go into the shortest column; changing the filter fades the old cards out and staggers the new ones in.
 */
export default function GalleryGrid({ items, onOpen, priority = false }) {
  const columns = useColumns()
  const cols = useMemo(() => masonry(items, columns), [items, columns])

  return (
    <div role="list" className="flex items-start gap-4 md:gap-6">
      {cols.map((column, c) => (
        <div key={c} className="flex min-w-0 flex-1 flex-col gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {column.map((item, i) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={i + c}
                onOpen={onOpen}
                eager={priority && i === 0}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
