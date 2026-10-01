import { createContext } from 'react'

/** { theme: 'night' | 'day', toggle(origin?: { x, y }) } — provided by ThemeProvider. */
export const ThemeContext = createContext({ theme: 'night', toggle: () => {} })
