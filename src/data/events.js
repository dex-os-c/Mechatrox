export const technicalEvents = [
  {
    code: 'TE.01',
    key: 'ppt',
    title: 'THEORIX (PAPER PRESENTATION)',
    tag: 'Present',
    desc: 'An inter-collegiate technical paper presentation — bring your research, your ideas, and be ready to defend them. Open theme: AI-driven automation, AI in automobiles, intelligent systems, and emerging tech.',
    details: [
      'Open to students from any college.',
      'Prepare a PPT presentation based on your submitted abstract.',
      'Bring presentation slides in standard PPT/PDF format.',
      "Judges' decision is final.",
    ],
  },
  {
    code: 'TE.02',
    key: 'quiz',
    title: 'QUIZTRONIX (QUIZ)',
    tag: 'Recall',
    desc: 'Rounds on electronics, robotics, and the occasional bit of internet-era trivia. Buzzers included, grudges optional.',
    details: [
      'Teams of 2.',
      'Prelims (written) narrow the field, finals are a live buzzer round.',
      'Covers electronics, robotics, embedded systems, and general tech trivia.',
      'Ties broken by a rapid-fire tiebreaker round.',
    ],
  },
  {
    code: 'TE.03',
    key: 'expo',
    title: 'INNOVERSE (PROJECT EXPO)',
    tag: 'Showcase',
    desc: 'Bring a working build to the floor and defend it in front of judges who will actually try to break it.',
    details: [
      'Teams of up to 4.',
      'Bring a working prototype/model — table and power point provided.',
      'Judges walk the floor and interrogate every build in person.',
      'Judged on function, originality, and real-world usefulness.',
    ],
  },
  {
    code: 'TE.04',
    key: 'mirror',
    title: 'MIRROR VERSE (WEB CREATION)',
    tag: 'Design',
    desc: 'Recreate a mechanism or a circuit from a reference you only get to study for a few minutes. Precision over guesswork.',
    details: [
      'Individual event.',
      'You get a short, fixed window to study a reference circuit/mechanism.',
      'Then recreate it from memory — accuracy and speed both count.',
      'No reference material allowed once the build window starts.',
    ],
  },
]

export const nonTechnicalEvents = [
  {
    code: 'NT.01',
    key: 'ipl',
    title: 'THE AUCTION WAR (IPL AUCTION)',
    tag: 'Strategy',
    desc: 'Draft a fantasy squad on a fixed purse, bid live against the room, and defend your picks when they inevitably backfire.',
    details: [
      'Teams of 2-3, each given a fixed virtual purse.',
      'Live open-bid auction for a fixed player pool.',
      'Best XI on paper, judged by a panel, wins.',
      'Overspending early is the classic mistake — budget accordingly.',
    ],
  },
  {
    code: 'NT.02',
    key: 'esports',
    title: 'E-WARZONE (BGMI, FREE FIRE)',
    tag: 'Squad',
    desc: 'Bring your squad. Bracket-style knockouts across BGMI and Free Fire, straight through to a final everyone in the room will have an opinion on.',
    details: [
      'Squad-based, bring your own team.',
      'Single/double-elimination bracket depending on entries.',
      'Games: BGMI and Free Fire — check the marquee/contact for match schedule.',
      'Fair-play rules strictly enforced; disputes resolved by the on-floor referee.',
    ],
  },
  {
    code: 'NT.03',
    key: 'meme',
    title: 'MEME MANIA (JOKE MAKING)',
    tag: 'Creative',
    desc: 'Fast rounds, live prompts, and a crowd that will let you know immediately if the joke landed.',
    details: [
      'Individual or pairs.',
      'Live prompts, fixed time per round to create and submit.',
      'Judged partly by panel, partly by live crowd reaction.',
      'Keep it original — reposts and recycled templates are disqualified.',
    ],
  },
  {
    code: 'NT.04',
    key: 'ad',
    title: 'AD MAD SHOW (ADVERTISEMENT)',
    tag: 'Pitch',
    desc: 'Sell something absurd. Teams get a prop and ninety seconds to convince a skeptical room to buy it.',
    details: [
      'Teams of up to 4.',
      'A random/absurd prop is assigned on the spot.',
      '90 seconds to plan, then pitch it live.',
      'Judged on creativity, delivery, and how convincingly the room got sold.',
    ],
  },
]

export const eventInfo = {
  festName: 'MECHATROX 2K26',
  tagline: 'CONNECT · COMPETE · CREATE',
  department: 'Department of Mechatronics Engineering',
  college: 'Er. Perumal Manimekalai College of Engineering',
  collegeShort: 'PMC Tech',
  collegeTagline: 'Inspire to Innovate',
  autonomous: true,
  accreditations: ['NBA Accredited', 'NAAC A Grade Accredited'],
  address: 'NH-44, Bengaluru - Chennai Highway, Koneripalli, Hosur - 635 117',
  website: 'www.pmctech.org',
  date: '29.10.2026',
  day: 'Thursday',
  venue: 'West Block Auditorium, PMC Tech',
  entry: '₹200 / Head',
  // TODO(owner): replace with the real UPI ID and drop the actual QR image
  // in at public/payment-qr.png (referenced directly in RegisterModal.jsx).
  upiId: 'yourupiid@bank',
  hod: { name: 'Dr. M. Sudhagar', title: 'ASP, Head of the Department' },
  facultyCoordinators: [
    { name: 'Ms. Jeba Shalin' },
    { name: 'Dr. Muthu Lakshmanan' },
  ],
  studentCoordinators: [
    { name: 'R.V.Ram Prakas', phone: '93614 96157' },
    { name: 'M.Venu Gopal', phone: '93425 05911' },
  ],
  developers: ['Murugan .V', 'Deena .M', 'Rohith .R', 'Sanjana .R', 'Tejashwini .C'],
}
