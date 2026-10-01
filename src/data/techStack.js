// @ts-check
// Her 17 tools, grouped. Project `stack` and pubmat `tools` entries must use these exact names.
// `icon` is a key into src/components/ui/TechIcon.jsx. `used` shows in the tile tooltip.

/** @type {import('../lib/types.js').TechGroup[]} */
export const techGroups = [
  { id: 'languages', label: 'Languages' },
  { id: 'web', label: 'Web' },
  { id: 'game3d', label: 'Game & 3D' },
  { id: 'lowcode', label: 'Low-code' },
  { id: 'design', label: 'Design' },
  { id: 'ai', label: 'AI tools' },
]

/** @type {import('../lib/types.js').TechItem[]} */
export const techStack = [
  {
    name: 'C#',
    group: 'languages',
    icon: 'csharp',
    used: 'Application logic and Unity scripting.',
  },
  {
    name: 'C++',
    group: 'languages',
    icon: 'cpp',
    used: 'Systems-level programming and fundamentals.',
  },
  {
    name: 'Python',
    group: 'languages',
    icon: 'python',
    used: 'Scripting, automation and data wrangling.',
  },
  { name: 'SQL', group: 'languages', icon: 'sql', used: 'Querying and shaping relational data.' },

  { name: 'HTML', group: 'web', icon: 'html', used: 'Semantic page structure.' },
  { name: 'CSS', group: 'web', icon: 'css', used: 'Layout, theming and motion.' },
  { name: 'JavaScript', group: 'web', icon: 'javascript', used: 'Interactive front-ends.' },
  { name: 'PHP', group: 'web', icon: 'php', used: 'Server-side pages and forms.' },

  { name: 'Unity', group: 'game3d', icon: 'unity', used: 'Real-time 3D and game prototypes.' },
  { name: 'Blender', group: 'game3d', icon: 'blender', used: '3D modelling and rendering.' },

  {
    name: 'Power Apps',
    group: 'lowcode',
    icon: 'powerapps',
    used: 'Low-code business apps on Microsoft 365.',
  },
  {
    name: 'Microsoft Lists',
    group: 'lowcode',
    icon: 'mslists',
    used: 'Structured data behind internal tools.',
  },

  { name: 'Figma', group: 'design', icon: 'figma', used: 'Interface design and prototyping.' },
  {
    name: 'Photoshop',
    group: 'design',
    icon: 'photoshop',
    used: 'Photo editing and pubmat compositing.',
  },
  { name: 'Canva', group: 'design', icon: 'canva', used: 'Fast social graphics and templates.' },

  {
    name: 'ChatGPT',
    group: 'ai',
    icon: 'chatgpt',
    used: 'Brainstorming, drafting and debugging help.',
  },
  {
    name: 'Claude',
    group: 'ai',
    icon: 'claude',
    used: 'Code review, writing and problem-solving.',
  },
]
