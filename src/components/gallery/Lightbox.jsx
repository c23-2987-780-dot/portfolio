import { useCallback, useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { cn } from '@/lib/utils.js'
import { ease, spring } from '@/lib/motion.js'
import { useMediaQuery } from '@/hooks/useMediaQuery.js'
import { useViewportSize } from '@/hooks/useViewportSize.js'
import Picture from '@/components/ui/Picture.jsx'
import Tag from '@/components/ui/Tag.jsx'
import CompareSlider from './CompareSlider.jsx'

const ZOOM = 2.2

// Opening from a thumbnail is a shared-element transition (layoutId), so the first viewer doesn't slide.
// After that, prev/next slide in the direction of travel.
const slide = {
  enter: ({ d }) => ({ x: d * 140, opacity: d === 0 ? 1 : 0 }),
  center: { x: 0, opacity: 1 },
  exit: ({ d, shared }) => (shared ? { opacity: 1 } : { x: d * -140, opacity: 0 }),
}

const iconButton =
  'grid size-11 place-items-center rounded-lg border border-line bg-scrim text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent-text disabled:pointer-events-none disabled:opacity-40'

function IconButton({ label, active, className, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={cn(iconButton, active && 'border-accent text-accent-text', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

function Viewer({
  item,
  shared,
  direction,
  width,
  height,
  padTop,
  padBottom,
  zoomed,
  compare,
  onZoomToggle,
  go,
  close,
}) {
  const [ready, setReady] = useState(false)
  const reachX = (width * (ZOOM - 1)) / 2
  const reachY = (height * (ZOOM - 1)) / 2

  // Unzoomed: horizontal swipe changes image, a long downward pull closes. Zoomed: drag pans.
  const onDragEnd = (_, { offset, velocity }) => {
    if (zoomed) return
    if (Math.abs(offset.y) > Math.abs(offset.x) && offset.y > 110) close()
    else if (offset.x < -90 || velocity.x < -600) go(1)
    else if (offset.x > 90 || velocity.x > 600) go(-1)
  }

  return (
    <motion.div
      custom={{ d: direction, shared }}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45, ease }}
      className="absolute inset-0 grid place-items-center"
      style={{ paddingTop: padTop, paddingBottom: padBottom }}
    >
      <motion.div
        layoutId={shared ? `pm-${item.id}` : undefined}
        style={{ width, height }}
        className="relative"
      >
        <motion.div
          drag={!compare}
          dragSnapToOrigin={!zoomed}
          dragConstraints={
            zoomed
              ? { left: -reachX, right: reachX, top: -reachY, bottom: reachY }
              : { left: 0, right: 0, top: 0, bottom: 0 }
          }
          dragElastic={zoomed ? 0.08 : 0.4}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          onDoubleClick={onZoomToggle}
          animate={{ scale: zoomed ? ZOOM : 1 }}
          transition={spring}
          style={{ touchAction: 'none', cursor: compare ? 'auto' : zoomed ? 'grab' : 'zoom-in' }}
          className="size-full overflow-hidden rounded-xl bg-surface-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]"
        >
          {compare && item.before ? (
            <CompareSlider before={item.before.large} after={item.large} alt={item.alt} />
          ) : (
            <>
              <Picture picture={item.picture} alt="" sizes="90vw" />
              <img
                src={item.large}
                alt={item.alt}
                draggable={false}
                onLoad={() => setReady(true)}
                className={cn(
                  'absolute inset-0 size-full object-cover transition-opacity duration-500',
                  ready ? 'opacity-100' : 'opacity-0',
                )}
              />
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Full-screen viewer for any list of `{ id, title, alt, picture, large, original, ratio, … }`.
 * Opens as a shared-element expansion from the thumbnail (when `entryId` matches a card's layoutId),
 * then supports ←/→ and swipe, double-click / button zoom with pan, swipe-down to close, and an
 * optional before/after compare when the item has a `before` image.
 */
export default function Lightbox({ items, openId, entryId, onNavigate, onClose }) {
  const index = items.findIndex((i) => i.id === openId)
  const open = index >= 0
  const item = items[index]

  const [direction, setDirection] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [compare, setCompare] = useState(false)
  // The thumbnail that opened the viewer. There is no <Dialog.Trigger>, so focus is returned by hand.
  const opener = useRef(null)
  const wide = useMediaQuery('(min-width: 768px)')
  const viewport = useViewportSize()

  const go = useCallback(
    (delta) => {
      if (items.length < 2) return
      setDirection(delta)
      setZoomed(false)
      setCompare(false)
      onNavigate(items[(index + delta + items.length) % items.length].id)
    },
    [index, items, onNavigate],
  )

  const close = useCallback(() => {
    setDirection(0)
    setZoomed(false)
    setCompare(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'ArrowRight') go(1)
      else if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  // Warm the cache for the neighbours so prev/next feels instant.
  useEffect(() => {
    if (!open) return
    for (const step of [1, -1]) {
      const neighbour = items[(index + step + items.length) % items.length]
      if (neighbour?.large) new Image().src = neighbour.large
    }
  }, [open, index, items])

  const padX = wide ? 96 : 16
  const padTop = 76
  const padBottom = wide ? 176 : 236
  const availW = Math.max(120, viewport.width - padX * 2)
  const availH = Math.max(120, viewport.height - padTop - padBottom)
  const width = item ? Math.min(availW, availH * item.ratio) : 0
  const height = item ? width / item.ratio : 0

  const meta = item ? [item.category, item.year, item.client].filter(Boolean).join(' · ') : ''

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && close()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[90] bg-scrim backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              onOpenAutoFocus={() => {
                opener.current = document.activeElement
              }}
              onCloseAutoFocus={(event) => {
                event.preventDefault()
                opener.current?.focus?.({ preventScroll: true })
              }}
            >
              <motion.div
                className="fixed inset-0 z-[91] overflow-hidden outline-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AnimatePresence initial custom={{ d: direction, shared: entryId === item.id }}>
                  <Viewer
                    key={item.id}
                    item={item}
                    shared={entryId === item.id}
                    direction={direction}
                    width={width}
                    height={height}
                    padTop={padTop}
                    padBottom={padBottom}
                    zoomed={zoomed}
                    compare={compare}
                    onZoomToggle={() => setZoomed((z) => !z)}
                    go={go}
                    close={close}
                  />
                </AnimatePresence>

                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-4 py-4 md:px-8">
                  <p className="text-sm text-muted" aria-live="polite">
                    {index + 1} / {items.length}
                  </p>
                  <div className="flex items-center gap-2">
                    {item.before && (
                      <IconButton
                        label={compare ? 'Show the finished piece' : 'Compare with the original'}
                        active={compare}
                        onClick={() => {
                          setCompare((c) => !c)
                          setZoomed(false)
                        }}
                      >
                        <ArrowLeftRight className="size-5" />
                      </IconButton>
                    )}
                    <IconButton
                      label={zoomed ? 'Zoom out' : 'Zoom in'}
                      disabled={compare}
                      onClick={() => setZoomed((z) => !z)}
                    >
                      {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
                    </IconButton>
                    <a
                      href={item.original}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Open the full-size image in a new tab"
                      className={iconButton}
                    >
                      <ExternalLink className="size-5" aria-hidden="true" />
                    </a>
                    <Dialog.Close asChild>
                      <IconButton label="Close">
                        <X className="size-5" />
                      </IconButton>
                    </Dialog.Close>
                  </div>
                </div>

                {items.length > 1 && (
                  <>
                    <IconButton
                      label="Previous image"
                      onClick={() => go(-1)}
                      className="absolute top-1/2 left-2 z-10 -translate-y-1/2 md:left-6"
                    >
                      <ChevronLeft className="size-6" />
                    </IconButton>
                    <IconButton
                      label="Next image"
                      onClick={() => go(1)}
                      className="absolute top-1/2 right-2 z-10 -translate-y-1/2 md:right-6"
                    >
                      <ChevronRight className="size-6" />
                    </IconButton>
                  </>
                )}

                <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-bg/90 px-4 py-4 backdrop-blur-md md:px-8">
                  <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="min-w-0">
                      {meta && <p className="text-sm font-medium text-accent-text">{meta}</p>}
                      <Dialog.Title className="text-xl font-semibold tracking-tight">
                        {item.title}
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 line-clamp-3 max-w-2xl text-sm text-muted">
                        {item.description || `Image ${index + 1} of ${items.length}.`}
                      </Dialog.Description>
                    </div>
                    {item.tools?.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 md:justify-end">
                        {item.tools.map((tool) => (
                          <li key={tool}>
                            <Tag>{tool}</Tag>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
