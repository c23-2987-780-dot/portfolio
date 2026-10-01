// @ts-check
// Pubmat gallery settings and per-file details.
//
// HOW TO ADD A PUBMAT
//   1. Drop the image into src/assets/works/pubmats/   (lowercase-with-dashes names, e.g. summer-sale.png)
//   2. (Optional) add an entry below keyed by that exact file name.
//   Without an entry the pubmat still appears — the title comes from the file name.
//
// BEFORE / AFTER: put the original next to the finished file as "<name>.before.png"
//   (e.g. summer-sale.png + summer-sale.before.png) and a compare slider appears in the lightbox.
//
// Details below were read from the pictures themselves (titles, dates, wording). `year` is only set when a
// date is printed on the pubmat. Add `tools: ['Photoshop', …]` to any entry once you know what was used.

const CLIENT = 'Labas Senior High School SSLG'

/** Filter chips, in this order. A category with no pubmats is hidden automatically. */
export const pubmatCategories = ['Events', 'Announcements', 'Observances', 'Greetings']

/** @type {Record<string, import('../lib/types.js').PubmatMeta>} */
export const pubmatMeta = {
  'good-luck-labasians.jpg': {
    title: 'Good Luck, Labasians!',
    category: 'Announcements',
    year: 2026,
    client: CLIENT,
    description: 'Good luck message for the 1st Summative Test on July 06, 2026.',
    alt: 'Good Luck Labasians poster: bold red lettering on a torn notebook page with a pencil, a pen and a pinned note that reads July 06, 2026, 1st Summative Test.',
    featured: true,
  },
  'lshs-student-orientation.jpg': {
    title: 'LSHS Student Orientation',
    category: 'Announcements',
    year: 2026,
    client: CLIENT,
    description:
      'Announcement for the student orientation on 05/20/26, 9:00–11:00 AM at Labas Senior High School Building A, for incoming Grade 11 students who have not yet accomplished the Plan of Study online.',
    alt: 'LSHS Student Orientation announcement: large white lettering on a maroon background with a megaphone, a notification bell and flying papers, plus the date, time and venue.',
    featured: true,
  },
  'childrens-month.jpg': {
    title: 'International Children’s Month',
    category: 'Observances',
    year: 2025,
    client: CLIENT,
    description: 'Toy Story–inspired graphic for International Children’s Month, November 2025.',
    alt: 'International Children’s Month graphic: four smiling kids in costumes with Buzz Lightyear, Woody and the little green aliens around bold yellow and blue lettering.',
    featured: true,
  },
  'ninoy-aquino-day.jpg': {
    title: 'Ninoy Aquino Day',
    category: 'Observances',
    year: 2025,
    client: CLIENT,
    description:
      'Ninoy Aquino Day graphic for August 21, 2025, with a statue and the yellow ribbon.',
    alt: 'Ninoy Aquino Day, August 21, 2025: white lettering with a yellow ribbon over blue and gold rays, beside a bronze statue.',
    featured: true,
  },
  'youth-nited-2025-highlights.jpg': {
    title: 'Youth Nited 2025 Highlights',
    category: 'Events',
    year: 2025,
    client: CLIENT,
    description: 'Highlights cover for Youth Nited 2025, framed by two torches.',
    alt: 'Youth Nited 2025 Highlights: red lettering on a glowing gold and maroon background between two burning torches, with the school and SSLG seals at the top.',
    featured: true,
  },
  'the-final-solga.jpg': {
    title: 'The Final',
    category: 'Events',
    client: 'NFSSLG Batch 2026',
    description:
      '“The term ends, the legacy lives on.” Graphic for the Final Session and State of the Learner Government Address (SOLGA) of NFSSLG Batch 2026.',
    alt: 'The Final: a large blue clock face over a crowd, with the NFSSLG logo and the words Final Session and State of the Learner Government Address.',
    featured: true,
  },
  'araw-ni-ninoy-aquino.jpg': {
    title: 'Araw ni Ninoy Aquino',
    category: 'Observances',
    client: CLIENT,
    description:
      'Tribute with the quote “The Filipino is worth dying for.” and his dates, November 27, 1932 – August 21, 1983.',
    alt: 'Araw ni Ninoy Aquino: a black-and-white portrait of Ninoy Aquino smiling with folded arms, on a yellow and green background with his name and a quote.',
  },
  'merry-christmas.jpg': {
    title: 'Merry Christmas',
    category: 'Greetings',
    client: CLIENT,
    description:
      'Christmas greeting with red lettering, a decorated tree, candy canes and a snowman.',
    alt: 'Merry Christmas greeting: red ornate lettering over a decorated Christmas tree with candy canes, gifts and a snowman.',
  },
}
