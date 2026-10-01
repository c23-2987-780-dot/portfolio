import {
  TbBrandAdobePhotoshop,
  TbBrandBlender,
  TbBrandCpp,
  TbBrandCSharp,
  TbBrandCss3,
  TbBrandFigma,
  TbBrandHtml5,
  TbBrandJavascript,
  TbBrandOpenai,
  TbBrandPhp,
  TbBrandPython,
  TbBrandUnity,
  TbDatabase,
} from 'react-icons/tb'
import { SiClaude } from 'react-icons/si'
import { AppWindow, ListChecks, Palette } from 'lucide-react'
import { cn } from '@/lib/utils.js'

// Keys match `icon` in src/data/techStack.js. Tabler (outline) is the base set; Lucide fills the
// three tools with no brand glyph, and Claude uses its Simple Icons spark.
const ICONS = {
  csharp: TbBrandCSharp,
  cpp: TbBrandCpp,
  python: TbBrandPython,
  sql: TbDatabase,
  html: TbBrandHtml5,
  css: TbBrandCss3,
  javascript: TbBrandJavascript,
  php: TbBrandPhp,
  unity: TbBrandUnity,
  blender: TbBrandBlender,
  powerapps: AppWindow,
  mslists: ListChecks,
  figma: TbBrandFigma,
  photoshop: TbBrandAdobePhotoshop,
  canva: Palette,
  chatgpt: TbBrandOpenai,
  claude: SiClaude,
}

/** Icon for a tool. Unknown keys fall back to a two-letter monogram so a typo never breaks the grid. */
export default function TechIcon({ name, label = '', className }) {
  const Icon = ICONS[name]
  if (Icon) return <Icon className={className} aria-hidden="true" />
  return (
    <span aria-hidden="true" className={cn('text-[0.7em] font-semibold', className)}>
      {label.slice(0, 2)}
    </span>
  )
}
