// @ts-check
/**
 * Shared JSDoc types. No runtime code lives here — it exists so editors can autocomplete
 * and flag typos in src/data/*.js without needing TypeScript.
 */

/** @typedef {'github' | 'instagram' | 'linkedin' | 'behance' | 'facebook' | 'dribbble' | 'tiktok'} SocialIcon */

/**
 * @typedef {Object} Social
 * @property {string} label
 * @property {string} href
 * @property {SocialIcon} icon
 */

/**
 * @typedef {Object} FocusCard
 * @property {string} title
 * @property {string} text
 * @property {'palette' | 'code' | 'cube'} icon
 */

/**
 * @typedef {Object} Profile
 * @property {string} name            Full name.
 * @property {string} title           One line under the name in the hero.
 * @property {string} photoAlt        Alt text for the hero portrait.
 * @property {string} tagline         Hero paragraph.
 * @property {string} availability    Status chip text. Empty string hides the chip.
 * @property {string} location
 * @property {string} email
 * @property {string} resume          Path under /public (e.g. "/resume/Kyla-Resume.pdf"). Empty hides the button.
 * @property {Social[]} socials
 * @property {{ intro: string[], focus: FocusCard[] }} about
 * @property {{ url: string, title: string, description: string }} site
 */

/**
 * @typedef {Object} TechGroup
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} TechItem
 * @property {string} name     Shown on the tile. Project `stack` and pubmat `tools` must match these names.
 * @property {string} group    A TechGroup id.
 * @property {string} icon     Key into the icon registry (src/components/ui/TechIcon.jsx).
 * @property {string} used     One-line description shown in the tooltip.
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {'ojt' | 'education'} type
 * @property {string} org
 * @property {string} role
 * @property {string} [period]
 * @property {string} [location]
 * @property {string} [summary]
 * @property {string[]} [highlights]
 */

/**
 * Optional details for a pubmat. The key in `pubmatMeta` is the file name, e.g. "summer-sale.png".
 * A file with no entry still shows up — its title is derived from the file name.
 * @typedef {Object} PubmatMeta
 * @property {string} [title]
 * @property {string} [category]      Should be one of `pubmatCategories`.
 * @property {number} [year]
 * @property {string} [client]
 * @property {string[]} [tools]       Names from techStack.js.
 * @property {string} [description]
 * @property {string} [alt]           Alt text. Falls back to the title.
 * @property {boolean} [featured]     Show on the home page.
 */

/**
 * @typedef {Object} ProjectMeta
 * @property {string} slug            Also the folder name in src/assets/works/projects/.
 * @property {string} title
 * @property {string} tagline
 * @property {string} role
 * @property {string} org
 * @property {string} [period]
 * @property {string} summary
 * @property {string} [problem]
 * @property {string} [solution]
 * @property {string} [outcome]
 * @property {string[]} [features]
 * @property {string[]} [stack]       Names from techStack.js.
 * @property {{ demo?: string, repo?: string }} [links]
 * @property {'browser' | 'phone' | 'tablet' | 'none'} [frame]  How screenshots are framed.
 * @property {boolean} [featured]
 * @property {boolean} [confidential] Adds a "details redacted" note.
 * @property {boolean} [sample]       Marks template placeholder content.
 * @property {Record<string, string>} [captions]  File name → caption override.
 */

export {}
