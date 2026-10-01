// One motion language for the whole site: a single ease, two springs, short durations, 60ms stagger.
export const ease = [0.22, 1, 0.36, 1]
export const spring = { type: 'spring', stiffness: 260, damping: 24 }
export const springSoft = { type: 'spring', stiffness: 140, damping: 22 }

/** Default scroll-reveal viewport: fire once, slightly before the element is fully in view. */
export const viewportOnce = { once: true, amount: 0.2, margin: '0px 0px -6% 0px' }

export const staggerParent = (gap = 0.07, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren } },
})

export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
