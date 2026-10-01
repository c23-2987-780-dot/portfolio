// @ts-check
// Everything that describes Kyla lives here. Keep this file plain ESM — vite.config.js and the scripts import it.

/** @type {import('../lib/types.js').Profile} */
export const profile = {
  name: 'Kyla Manzanero',

  // One line under the name in the hero.
  title: 'Game developer & pubmat designer',

  tagline:
    'IT student majoring in game development. I build games and web apps, and I design publication materials for school events.',

  // Status chip in the hero. Empty string hides it.
  availability: 'Open to opportunities',

  location: 'Santa Rosa, Laguna, Philippines',
  email: 'manzanerokyla@gmail.com',

  // Alt text for the hero portrait (src/assets/profile/profile-picture.jpeg). Describe what's in the photo.
  photoAlt:
    'Portrait of Kyla sitting on stone steps at night in front of an illuminated Baroque-style building and an ornate street lamp.',

  // Put a PDF in /public/resume and set e.g. '/resume/Kyla-Manzanero-CV.pdf' to show a download button.
  // Check the PDF first: a CV usually includes a phone number, which becomes public once it is hosted.
  resume: '',

  // Add profile links as { label, href, icon }. Icons: github, linkedin, instagram, behance, facebook, dribbble, tiktok.
  // Left empty on purpose until real URLs are available.
  socials: [],

  about: {
    intro: [
      'I’m a BS Information Technology student majoring in Game Development at the University of Perpetual Help System Biñan. I like building things that run: a 2D RPG in Unity and C#, a food ordering kiosk on PHP and MySQL, and responsive web layouts in HTML, CSS and JavaScript.',
      'During my on-the-job training at CloudSwyft I worked on a Power Apps CRM, a financial-literacy game and learning content. Outside of code I design pubmats for school events and observances.',
    ],
    focus: [
      {
        title: 'Game development',
        text: 'Unity and C#: a 2D RPG with scoring, math quizzes, a mini-map and basic enemy AI.',
        icon: 'cube',
      },
      {
        title: 'Web & databases',
        text: 'HTML, CSS, JavaScript, PHP and MySQL, from responsive layouts to an ordering system with an admin panel.',
        icon: 'code',
      },
      {
        title: 'Visual design',
        text: 'Pubmats and graphics for school events, observances and announcements.',
        icon: 'palette',
      },
    ],
  },

  // Used for <title>, meta description, social previews and sitemap.xml.
  // Set the real address here (or VITE_SITE_URL at build time) once the site is hosted.
  site: {
    url: 'https://example.com',
    title: 'Kyla Manzanero — Game Developer & Designer',
    description:
      'Portfolio of Kyla Manzanero, a BSIT (Game Development) student: OJT projects at CloudSwyft, school pubmats, and tools including Unity, C#, PHP, Power Apps and Figma.',
  },
}
