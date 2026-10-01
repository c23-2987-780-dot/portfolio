// @ts-check
// OJT projects. Array order = display order on the site.
//
// HOW TO ADD A PROJECT
//   1. Create a folder src/assets/works/projects/<slug>/ and drop the images in:
//        cover.png                 the card / header image (used alone if there are no other screenshots)
//        01-login.png, 02-dashboard.png, …   more screenshots (number = order, the words become the caption)
//   2. Add an entry below with the same slug.
//   Company screenshots: get your supervisor's OK first, then set `confidential: true` to add a note.
//
// Everything below comes from what is visible in the screenshots. Fields you can add when you have them:
//   period ('Jan – Mar 2026'), stack (tool names from techStack.js), problem / solution / outcome,
//   links: { demo, repo }, more screenshots.

/** @type {import('../lib/types.js').ProjectMeta[]} */
export const projectsMeta = [
  {
    slug: 'cloudswyft-crm',
    title: 'CloudSwyft CRM',
    tagline: 'A Power Apps CRM with staff clock-in and an activity log.',
    role: 'OJT Intern',
    org: 'CloudSwyft',
    summary:
      'A Power Apps app that brings sales, accounts and customer support into one place. A side menu leads to Dashboard, Sales Flow, Sales Team, Accounts, Revenue Comms, Client Cost Value, Customer Support and Change Password. The screen shown is the staff clock-in module.',
    features: [
      'Clock in / clock out with live counters for logs today, active staff and who is clocked in',
      'Activity log with staff search plus action and date filters',
      'Side navigation across the sales, accounts, revenue and support screens',
    ],
    stack: ['Power Apps'],
    frame: 'none',
    featured: true,
  },
  {
    slug: 'debt-escape',
    title: 'Debt Escape',
    tagline: 'A game about making smart money choices.',
    role: 'OJT Intern',
    org: 'CloudSwyft',
    summary:
      'A financial-literacy game built around the line “Make smart choices, avoid debt, build your future.” The main title and menu screen offers Start Game, How to Play and a Leaderboard, with a piggy-bank mascot and a friendly guide character.',
    features: [
      'Main menu with Start Game, How to Play and Leaderboard',
      'Reminder bar: “Think before you spend. Your choices shape your financial future.”',
    ],
    frame: 'none',
    featured: true,
  },
  {
    slug: 'intro-to-html',
    title: 'Introduction to HTML',
    tagline: 'Lesson cover for an HTML learning activity.',
    role: 'OJT Intern',
    org: 'CloudSwyft',
    summary:
      'Cover graphic for “Activity 1: Introduction to HTML”, a CloudSwyft learning module. A laptop showing code and a rendered page sits among floating tags such as <h1> and <div>.',
    frame: 'none',
    featured: true,
  },
]
