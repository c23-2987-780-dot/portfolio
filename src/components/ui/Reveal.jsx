import { motion } from 'motion/react'
import { ease, staggerChild, staggerParent, viewportOnce } from '@/lib/motion.js'

// Pre-built so components aren't created during render. Unknown tags fall back to <div>.
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  nav: motion.nav,
  figure: motion.figure,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  dl: motion.dl,
  p: motion.p,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
}
const FALLBACK = motion.div

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ as = 'div', delay = 0, y = 28, className, children, ...rest }) {
  const Tag = TAGS[as] || FALLBACK
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.75, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Parent that staggers its <StaggerItem> children in. */
export function Stagger({ as = 'div', gap = 0.07, delay = 0, className, children, ...rest }) {
  const Tag = TAGS[as] || FALLBACK
  return (
    <Tag
      variants={staggerParent(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({ as = 'div', className, children, ...rest }) {
  const Tag = TAGS[as] || FALLBACK
  return (
    <Tag variants={staggerChild} className={className} {...rest}>
      {children}
    </Tag>
  )
}
