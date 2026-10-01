/** Template-only helpers. Both render nothing in production builds. */

/** Cobalt "Sample" tag for placeholder content, so it's obvious what still needs replacing. */
export function SampleRibbon({ show }) {
  if (!import.meta.env.DEV || !show) return null
  return (
    <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-md bg-cobalt px-2 py-1 text-[10px] leading-none font-semibold tracking-wide text-ivory">
      Sample
    </span>
  )
}

/** Dashed hint shown in dev when a content folder is empty. */
export function DevHint({ children }) {
  if (!import.meta.env.DEV) return null
  return (
    <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
      {children}
    </div>
  )
}
