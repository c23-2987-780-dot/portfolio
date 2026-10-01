import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils.js'
import { ease, spring } from '@/lib/motion.js'
import Picture from '@/components/ui/Picture.jsx'
import Lightbox from '@/components/gallery/LazyLightbox.jsx'
import DeviceFrame from './DeviceFrame.jsx'

const slide = {
  enter: (d) => ({ x: d * 90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d * -90, opacity: 0 }),
}

/**
 * Screenshot viewer for a project: framed main image (drag/swipe or use the arrows), a thumbnail
 * strip with a sliding highlight, captions, and click-to-enlarge in the shared Lightbox.
 */
export default function ScreenshotCarousel({ project, images }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [view, setView] = useState({ id: null, entry: null })
  const current = images[index]
  const many = images.length > 1

  const go = (next) => {
    const target = (next + images.length) % images.length
    setDirection(next > index ? 1 : -1)
    setIndex(target)
  }

  const onDragEnd = (_, { offset, velocity }) => {
    if (offset.x < -70 || velocity.x < -500) go(index + 1)
    else if (offset.x > 70 || velocity.x > 500) go(index - 1)
  }

  const lightboxItems = images.map((img) => ({ ...img, description: project.title }))

  return (
    <div>
      <div className="relative">
        <DeviceFrame frame={project.frame}>
          <div className="relative overflow-hidden" style={{ aspectRatio: current.ratio }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.button
                key={current.id}
                type="button"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={onDragEnd}
                onClick={() => setView({ id: current.id, entry: null })}
                aria-label={`Enlarge: ${current.caption}`}
                className="group absolute inset-0 block size-full cursor-zoom-in"
              >
                <Picture
                  picture={current.picture}
                  alt={current.alt}
                  eager={index === 0}
                  sizes="(min-width: 1024px) 52rem, 94vw"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-scrim text-fg opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
                >
                  <Maximize2 className="size-4" />
                </span>
              </motion.button>
            </AnimatePresence>
          </div>
        </DeviceFrame>

        {many && (
          <>
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-scrim backdrop-blur transition-colors hover:border-accent hover:text-accent-text md:-left-5"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-scrim backdrop-blur transition-colors hover:border-accent hover:text-accent-text md:-right-5"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {many && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-lg font-medium"
            >
              {current.caption}
            </motion.p>
          </AnimatePresence>
          <p className="text-sm text-muted" aria-live="polite">
            {index + 1} / {images.length}
          </p>
        </div>
      )}

      {many && (
        <LayoutGroup id="screens">
          <ul className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <li key={img.id} className="shrink-0">
                <button
                  type="button"
                  aria-label={`Show ${img.caption}`}
                  aria-current={i === index}
                  onClick={() => go(i)}
                  className={cn(
                    'relative block h-20 overflow-hidden rounded-xl border transition-opacity duration-300',
                    i === index ? 'border-transparent' : 'border-line opacity-60 hover:opacity-100',
                  )}
                  style={{ aspectRatio: img.ratio }}
                >
                  <Picture picture={img.picture} alt="" sizes="160px" />
                  {i === index && (
                    <motion.span
                      layoutId="screen-ring"
                      transition={spring}
                      className="absolute inset-0 rounded-xl ring-2 ring-accent ring-inset"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </LayoutGroup>
      )}

      <Lightbox
        items={lightboxItems}
        openId={view.id}
        entryId={view.entry}
        onNavigate={(id) => setView({ id, entry: null })}
        onClose={() => setView({ id: null, entry: null })}
      />
    </div>
  )
}
