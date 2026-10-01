import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Button from '@/components/ui/Button.jsx'
import FilterBar from './FilterBar.jsx'
import GalleryGrid from './GalleryGrid.jsx'
import Lightbox from './LazyLightbox.jsx'

/**
 * Filterable masonry + lightbox for pubmats. Used on Home (a short featured list) and on /pubmats
 * (everything, with filter chips and "Show more"). `pageSize` of undefined shows all items.
 */
export default function PubmatGallery({
  items,
  categories = [],
  filterable = false,
  pageSize,
  priority = false,
}) {
  const [filter, setFilter] = useState('All')
  const [limit, setLimit] = useState(pageSize ?? Infinity)
  // `entry` is only set for the card the viewer opened from, so the shared-element animation plays once.
  const [view, setView] = useState({ id: null, entry: null })

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  )
  const shown = filtered.slice(0, limit)
  const counts = useMemo(
    () => ({
      All: items.length,
      ...Object.fromEntries(
        categories.map((c) => [c, items.filter((i) => i.category === c).length]),
      ),
    }),
    [items, categories],
  )

  const select = (category) => {
    setFilter(category)
    setLimit(pageSize ?? Infinity)
  }

  return (
    <div>
      {filterable && categories.length > 1 && (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <FilterBar
            categories={categories}
            counts={counts}
            active={filter}
            onSelect={select}
            label="Filter pubmats by category"
            pillId="pubmat-filter"
          />
          <p aria-live="polite" className="text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? 'pubmat' : 'pubmats'}
          </p>
        </div>
      )}

      <GalleryGrid items={shown} onOpen={(id) => setView({ id, entry: id })} priority={priority} />

      <AnimatePresence>
        {shown.length < filtered.length && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-14 flex justify-center"
          >
            <Button variant="secondary" onClick={() => setLimit((l) => l + (pageSize ?? 12))}>
              Show more ({filtered.length - shown.length} left)
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        items={filtered}
        openId={view.id}
        entryId={view.entry}
        onNavigate={(id) => setView({ id, entry: null })}
        onClose={() => setView({ id: null, entry: null })}
      />
    </div>
  )
}
