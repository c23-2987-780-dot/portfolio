import { useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { clamp } from '@/lib/utils.js'

/**
 * Before/after reveal. Drag anywhere (or use ←/→ on the handle) to move the divider.
 * `before` is clipped on the left; `after` is the finished piece underneath.
 */
export default function CompareSlider({ before, after, alt }) {
  const box = useRef(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState(50)

  const moveTo = (clientX) => {
    const rect = box.current.getBoundingClientRect()
    setPos(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100))
  }

  return (
    <div
      ref={box}
      className="relative size-full cursor-ew-resize touch-none overflow-hidden select-none"
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        moveTo(event.clientX)
      }}
      onPointerMove={(event) => dragging.current && moveTo(event.clientX)}
      onPointerUp={() => {
        dragging.current = false
      }}
    >
      <img
        src={after}
        alt={alt}
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
      <img
        src={before}
        alt=""
        draggable={false}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <span className="absolute top-3 left-3 rounded-md bg-scrim px-2 py-1 text-xs font-medium text-fg backdrop-blur">
        Before
      </span>
      <span className="absolute top-3 right-3 rounded-md bg-scrim px-2 py-1 text-xs font-medium text-fg backdrop-blur">
        After
      </span>
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-accent"
        style={{ left: `${pos}%` }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label="Reveal the original"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') setPos((p) => clamp(p - 4, 0, 100))
            if (event.key === 'ArrowRight') setPos((p) => clamp(p + 4, 0, 100))
          }}
          className="pointer-events-auto absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-on-accent shadow-xl"
        >
          <ChevronsLeftRight className="size-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
