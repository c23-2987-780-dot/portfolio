import { motion } from 'motion/react'
import { Maximize2 } from 'lucide-react'
import Picture from '@/components/ui/Picture.jsx'
import { SampleRibbon } from '@/components/ui/DevHint.jsx'
import { ease } from '@/lib/motion.js'

const SIZES = '(min-width: 1280px) 18rem, (min-width: 768px) 30vw, 46vw'

/**
 * One thumbnail. The image box carries a `layoutId` so the lightbox can expand from it (and fly back
 * to it on close). The caption is always visible, so touch users aren't relying on hover.
 */
export default function GalleryCard({ item, index, onOpen, eager = false }) {
  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, ease, delay: (index % 4) * 0.05 }}
    >
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        aria-label={`Open ${item.title}`}
        className="group block w-full text-left"
      >
        <motion.div
          layoutId={`pm-${item.id}`}
          style={{ aspectRatio: item.ratio }}
          className="relative overflow-hidden rounded-xl border border-line bg-surface-2"
        >
          <Picture
            picture={item.picture}
            alt={item.alt}
            eager={eager}
            sizes={SIZES}
            imgClassName="transition-transform duration-700 ease-lamp group-hover:scale-[1.06]"
          />
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 grid size-9 translate-y-1 place-items-center rounded-lg bg-scrim text-fg opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            <Maximize2 className="size-4" />
          </span>
          <SampleRibbon show={item.sample} />
        </motion.div>
        <span className="mt-3 flex flex-col gap-0.5 px-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <span className="leading-tight font-medium transition-colors duration-300 group-hover:text-accent-text">
            {item.title}
          </span>
          <span className="shrink-0 text-xs text-muted">{item.category}</span>
        </span>
      </button>
    </motion.div>
  )
}
