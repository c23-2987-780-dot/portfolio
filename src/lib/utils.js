import clsx from 'clsx'

/** Join class names, skipping falsy values. */
export const cn = (...args) => clsx(args)

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export const isExternal = (href = '') => /^(https?:|mailto:|tel:)/i.test(href)

/** The first word of the profile name, used in titles and alt text. */
export const firstName = (name) => name.trim().split(/\s+/)[0]

/**
 * Greedy masonry: place each item in the currently shortest column. Deterministic, so adding items
 * to the end never moves the ones already placed. `extra` approximates the caption under each image.
 */
export function masonry(items, columns, extra = 0.16) {
  const cols = Array.from({ length: columns }, () => ({ height: 0, items: [] }))
  for (const item of items) {
    const shortest = cols.reduce((a, b) => (b.height < a.height ? b : a))
    shortest.items.push(item)
    shortest.height += 1 / (item.ratio || 1) + extra
  }
  return cols.map((c) => c.items)
}
