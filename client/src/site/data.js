export const PROFILE = {
  name: 'Harshil Barot',
  company: { name: 'Akshar Nirmaan', url: 'https://aksharnirmaan.com', contact: 'https://www.aksharnirmaan.com/contact' },
  location: 'Vadodara, India',
  timeZone: 'Asia/Kolkata',
  email: 'harshill.barot@gmail.com',
  phone: '+91 88669 82848',
  phoneHref: 'tel:+918866982848',
  resume: '/Harshil_Barot_Resume.pdf',
  // The hero line; it runs on into "Akshar Nirmaan. Scroll to fly through the work."
  intro:
    'A young entrepreneur helping startups and growing businesses launch faster and grow online, with websites, products and brands that win customers. Founder of',
}

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/harshilbarot' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/harshil-barot-211513353' },
  { label: 'Instagram', href: 'https://instagram.com/harshilbarot' },
  { label: 'X / Twitter', href: 'https://twitter.com/harshilbarot' },
  { label: 'WhatsApp', href: 'https://wa.me/918866982848' },
]

// Home page targets: Selected, About and Contact open the box; Work flies into
// the projects (the pixel fly-through).
export const NAV = [
  { label: 'Selected', href: '#selected' },
  { label: 'Work', href: '#flight' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

// `shots`: how many desktop (d1..) and mobile (m1..) captures live in
// public/work/<slug>/ for the project panel and the case study gallery.
export const PROJECTS = [
  {
    slug: 'an-uniforms',
    title: 'AN Uniforms',
    tagline: 'dressed for business',
    type: 'B2B Platform',
    industry: 'Apparel, B2B',
    year: '2025',
    url: 'https://an-uniforms.vercel.app/',
    stack: ['Next.js', 'MongoDB', 'Node.js', 'Express'],
    services: ['Product design', 'Frontend', 'Backend & API', 'Database design', 'Admin dashboard', 'Deployment'],
    summary:
      'A B2B uniform management platform with automated quotation generation, multi-industry inquiry handling, real-time order tracking and an operations dashboard.',
    intro: [
      'AN Uniforms makes branded uniforms for teams in catering, hospitality, schools, hospitals, offices and industry. The site turns a vague brief into a precise one: pick the garment, choose how the logo goes on, upload the artwork and split the sizes, and the team receives a specification it can quote from accurately.',
      'Behind the storefront is the operations side: inquiries from every industry land in one dashboard, quotations are generated from the specification, and orders are tracked from artwork approval to dispatch. I designed and built the whole product, from the uniform builder to the API, the data model and the admin.',
    ],
    features: [
      ['Uniform builder', 'Garment, branding method, logo placement and size split, specified step by step.'],
      ['Inquiries by industry', 'Catering, hospitality, schools, hospitals and more, each with what it needs.'],
      ['Quotations from the spec', 'Every request becomes a clear, itemised quotation the team can send.'],
      ['Orders & dashboard', 'Orders followed from approval to delivery, all run from one admin.'],
    ],
    shots: [4, 3],
  },
  {
    slug: 'ripper',
    title: 'Ripper',
    tagline: 'any link, any format',
    type: 'Media Tool',
    industry: 'Media, Utilities',
    year: '2025',
    url: 'https://ripperfm.vercel.app/',
    stack: ['Next.js', 'MongoDB', 'Node.js', 'FFmpeg'],
    services: ['Product design', 'Frontend', 'Media pipeline', 'Backend & API', 'Deployment'],
    summary:
      'A high-performance media downloader for YouTube, Instagram and TikTok, with FFmpeg-powered MP3/MP4 conversion and quality optimisation.',
    intro: [
      'Ripper is a free media downloader with no login and no limits: paste a YouTube, Instagram or TikTok link, pick MP3 or MP4 and a quality, and hit download. The platform is detected from the link, so there is only ever one box to use.',
      'Under the hood, an FFmpeg pipeline converts on the server, up to 320kbps audio and 4K video, and streams the file straight to the device without keeping it. I built the whole thing: the loud, Y2K-flavoured interface, the API and the media processing.',
    ],
    features: [
      ['Three platforms, one box', 'YouTube videos and shorts, Instagram reels and TikTok clips, detected from one link.'],
      ['320kbps MP3, 4K MP4', 'FFmpeg converts on the server, from lo-fi audio to crisp 2160p video.'],
      ['Zero tracking', 'No accounts and no snooping cookies; files stream to the device and self-delete.'],
      ['Fast by design', 'Server-side ripping with a streamed response, so downloads land in seconds.'],
    ],
    shots: [4, 3],
  },
  {
    slug: 'pax-immigration',
    title: 'Pax Immigration',
    tagline: 'every case in one place',
    type: 'Immigration Services',
    industry: 'Immigration, Legal services',
    year: '2025 — 2026',
    url: 'https://www.paximmigration.in',
    stack: ['Next.js', 'MongoDB', 'Node.js', 'Express'],
    services: ['Product design', 'Frontend', 'Backend & API', 'Client portal', 'Payments', 'Deployment'],
    summary:
      'Built from scratch: secure client portals, document management, case tracking, appointment scheduling and payments for immigration consultants.',
    intro: [
      'Pax Immigration guides students, workers and families through visas for more than fifteen countries. The public site lays out every service, from student and work visas to PR, passports and SOP writing, and turns visitors into free consultations.',
      'Behind it is the platform I built from scratch, end to end, on the MERN stack during my internship with Pax: a secure client portal with document management, case tracking, appointment scheduling and online payments.',
    ],
    features: [
      ['Secure client portal', 'Each client signs in to a private space for their own case.'],
      ['Document management', 'Uploads, checklists and files kept together and organised per case.'],
      ['Case tracking', 'Every step of an application visible to the client and the team.'],
      ['Appointments & payments', 'Consultations booked and paid for online.'],
    ],
    quote: 'Aatish Parekh',
    shots: [5, 3],
  },
  {
    slug: 'chaibugs',
    title: 'ChaiBugs Cafe',
    tagline: 'the whole cafe, online',
    type: 'Cafe Platform',
    industry: 'Food & Beverage',
    year: '2025',
    url: 'https://chai-bugs.vercel.app',
    stack: ['Next.js', 'MongoDB', 'Node.js', 'Stripe'],
    services: ['Web design', 'Frontend', 'Ordering & checkout', 'Stripe payments', 'Admin dashboard'],
    summary:
      'Online ordering, live table reservations, dynamic menus, order tracking and Stripe payments, with an admin dashboard for the whole cafe.',
    intro: [
      'ChaiBugs pours slow-simmered chai in kulhads across its outlets in Gujarat, and the website had to taste like it: warm, playful and quick to order from. Guests browse a live menu, pick an outlet, order and pay online, reserve a table and follow their order.',
      'For the team there is an admin dashboard that runs the whole cafe: menu changes, incoming orders, reservations and payments. I designed and built the site and the dashboard, including the Stripe checkout.',
    ],
    features: [
      ['Online ordering', 'A menu that updates live, with a smooth cart and checkout.'],
      ['Table reservations', 'Guests book a table in real time.'],
      ['Stripe payments', 'Secure card payments built into the checkout.'],
      ['Cafe dashboard', 'Menu, orders and reservations managed in one place.'],
    ],
    quote: 'Priya Shah',
    shots: [3, 3],
  },
  {
    slug: 'shabdsetu',
    title: 'ShabdSetu',
    tagline: 'a bridge made of words',
    type: 'EdTech / LMS',
    industry: 'Education',
    year: '2025',
    url: 'https://shabdsetu-mocha.vercel.app',
    stack: ['Next.js', 'MongoDB', 'Node.js', 'WebRTC'],
    services: ['Product design', 'Frontend', 'Live video (WebRTC)', 'Backend & API', 'Analytics'],
    summary:
      'A learning platform with WebRTC live classes, course management, student progress tracking, interactive assessments and analytics for educators.',
    intro: [
      'ShabdSetu means "a bridge of words", and it is one between coaching institutes, students and parents. Built Gujarati-first, it keeps batches, attendance, homework, tests and marks, exam schedules, timetables and fees in one place.',
      'Parents stay in the loop through WhatsApp and SMS alerts and auto-generated daily and weekly reports. I designed and built the product end to end, from the marketing site and its founding-partner offer to the dashboards institutes use every day.',
    ],
    features: [
      ['Batches & attendance', 'Classes organised into batches, with attendance taken in a tap.'],
      ['Homework, tests & marks', 'Assignments, exam scheduling and results kept together per student.'],
      ['Fees & timetables', 'Fee reminders and receipts, plus teacher timetables everyone can see.'],
      ['Alerts & reports', 'WhatsApp and SMS updates, and daily and weekly reports for parents.'],
    ],
    quote: 'Rahul Mehta',
    shots: [5, 3],
  },
  {
    slug: 'akshar-nirmaan',
    title: 'Akshar Nirmaan',
    tagline: 'building brands, letter by letter',
    type: 'Digital Growth Studio',
    industry: 'Marketing, AI',
    year: '2026',
    url: 'https://aksharnirmaan.com',
    stack: ['Next.js', 'MongoDB', 'Node.js', 'AI/ML'],
    services: ['Brand identity', 'Web design', 'Frontend', 'Marketing automation', 'SEO', 'AI tooling'],
    summary:
      'My own studio: AI-assisted branding, marketing automation, SEO, social scheduling and analytics that help businesses grow their digital presence.',
    intro: [
      'Akshar Nirmaan, “creation through letters and craft”, is my own studio. It builds products, brands and growth engines for founders who move fast: technology, branding and growth under one roof, from one small, obsessed team.',
      'The website is the studio’s front door and its proof of work. Its loud, kinetic type spells NIRMAAN out letter by letter as you scroll. I designed the brand and built the site and the tools behind it.',
    ],
    features: [
      ['Products & engineering', 'Web apps and platforms built end to end, from first commit to launch.'],
      ['Brand & identity', 'Brands with a voice, from the name up, with AI in the loop.'],
      ['Growth engines', 'Marketing automation, SEO and social that compound over time.'],
      ['AI agents & video', 'Automations and content that keep a business moving.'],
    ],
    shots: [5, 3],
  },
].map((p) => ({
  ...p,
  image: `/work/${p.slug}.webp`,
  thumb: `/work/${p.slug}-sm.webp`,
  desktop: Array.from({ length: p.shots[0] }, (_, i) => `/work/${p.slug}/d${i + 1}.webp`),
  mobile: Array.from({ length: p.shots[1] }, (_, i) => `/work/${p.slug}/m${i + 1}.webp`),
}))

export const projectBySlug = (slug) => PROJECTS.find((p) => p.slug === slug)

export const EXPERIENCE = [
  {
    period: '2026 — Now',
    role: 'Founder',
    company: 'Akshar Nirmaan',
    place: 'Vadodara',
    note: 'Web development, branding and marketing automation for growing businesses.',
  },
  {
    period: 'Dec 2025 — May 2026',
    role: 'Web Development Intern',
    company: 'Pax Immigration',
    place: 'Remote',
    note: 'Built the Pax Immigration platform end to end on the MERN stack.',
  },
  {
    period: 'May — Jul 2025',
    role: 'Intern',
    company: 'Nobel Learning PBC',
    place: 'Remote',
    note: 'Web design, troubleshooting, and pitching ideas to a distributed team.',
  },
]

export const TOOLKIT = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Figma', 'AWS']

export const EDUCATION = { title: 'B.Tech, Computer Science & Engineering', place: 'GSFC University', period: '2022 — 2026' }

export const TESTIMONIALS = [
  {
    quote:
      'Harshil built our complete immigration platform from scratch. His full-stack expertise and attention to detail resulted in a robust, user-friendly system that exceeded our expectations.',
    name: 'Aatish Parekh',
    role: 'Founder, Pax Immigration',
  },
  {
    quote:
      'Harshil developed our educational platform with impressive technical skill. The live class integration and course management system work flawlessly.',
    name: 'Rahul Mehta',
    role: 'CEO, ShabdSetu',
  },
  {
    quote:
      'Our cafe platform is exactly what we needed. Harshil created a beautiful ordering system with smooth checkout and payments. Highly recommended.',
    name: 'Priya Shah',
    role: 'Owner, ChaiBugs Cafe',
  },
]

// Choices in the contact form ("What do you need?" and "Budget").
export const CONTACT_NEEDS = ['Website', 'Web app or platform', 'Online store', 'Brand identity', 'Something else']
export const CONTACT_BUDGETS = ['Under ₹50k', '₹50k to ₹2L', '₹2L to ₹5L', '₹5L+', 'Not sure yet']
