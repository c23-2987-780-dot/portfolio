// @ts-check
// Timeline on the About section. Newest first. `type` picks the icon: 'ojt' or 'education'.
// `period` and `highlights` are optional — leave them out and they simply don't show.

/** @type {import('../lib/types.js').ExperienceEntry[]} */
export const experience = [
  {
    type: 'ojt',
    org: 'CloudSwyft',
    role: 'OJT Intern',
    // period: 'Month Year – Month Year',   // add the OJT dates when confirmed
    summary:
      'On-the-job training covering a Power Apps CRM, a financial-literacy game and an HTML learning activity.',
  },
  {
    type: 'education',
    org: 'University of Perpetual Help System Biñan',
    role: 'BS Information Technology, major in Game Development',
    period: '2023 – Present',
    location: 'Biñan, Laguna',
    highlights: [
      '2D mini RPG in Unity and C# with scoring, math quizzes, a mini-map and basic enemy AI',
      'Food ordering kiosk website with a PHP and MySQL back end and an admin panel',
      'Shopping website UI in HTML, CSS and JavaScript',
    ],
  },
]
