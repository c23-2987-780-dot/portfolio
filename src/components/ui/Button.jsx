import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn, isExternal } from '@/lib/utils.js'
import { spring } from '@/lib/motion.js'
import { useMagnetic } from '@/hooks/useMagnetic.js'

const COMPONENTS = { link: motion.create(Link), anchor: motion.a, button: motion.button }

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-lg font-medium whitespace-nowrap transition-[background-color,border-color,box-shadow,color] duration-300 disabled:pointer-events-none disabled:opacity-60'

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hi',
  secondary:
    'border border-line bg-surface/70 text-fg backdrop-blur hover:border-accent/70 hover:bg-surface',
  ghost: 'text-fg hover:text-accent-text',
}

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-8 text-base',
}

function MagneticWrap({ children }) {
  const { ref, style } = useMagnetic()
  return (
    <motion.span ref={ref} style={style} className="inline-flex">
      {children}
    </motion.span>
  )
}

/**
 * Pill button / link. Pass `to` for in-app navigation, `href` for anchors, neither for a <button>.
 * Press scales down, hover lifts slightly, and each click leaves a ripple from the pointer.
 * `magnetic` makes it drift toward the cursor (desktop only).
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  icon: Icon,
  magnetic = false,
  className,
  children,
  onPointerDown,
  ...rest
}) {
  const [ripples, setRipples] = useState([])
  const kind = to ? 'link' : href ? 'anchor' : 'button'
  const Component = COMPONENTS[kind]

  const linkProps =
    kind === 'link'
      ? { to }
      : kind === 'anchor'
        ? {
            href,
            ...(isExternal(href) && !rest.download
              ? { target: '_blank', rel: 'noreferrer noopener' }
              : {}),
          }
        : { type: 'button' }

  const handlePointerDown = (event) => {
    onPointerDown?.(event)
    const rect = event.currentTarget.getBoundingClientRect()
    const id = `${event.timeStamp}`
    setRipples((list) => [
      ...list,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ])
  }

  const node = (
    <Component
      {...linkProps}
      {...rest}
      onPointerDown={handlePointerDown}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {Icon && <Icon className="size-[1.1em]" aria-hidden="true" />}
        {children}
        {arrow && (
          <ArrowUpRight
            className="size-[1.1em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        )}
      </span>
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="ripple-dot"
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => setRipples((list) => list.filter((item) => item.id !== r.id))}
        />
      ))}
    </Component>
  )

  return magnetic ? <MagneticWrap>{node}</MagneticWrap> : node
}
