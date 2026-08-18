import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ArrowUpRight, Mail,
  Clapperboard, PenTool, Megaphone, FileText, Wand2, Film,
  Sparkles, Palette, Layers, Camera, Music2, Send,
  Eye, Compass, Target, Lightbulb, Zap
} from 'lucide-react'
import './CreativePortfolio.css'
import CreativeLoadingScreen from './components/CreativeLoadingScreen'
import CreativeContactSection from './components/CreativeContactSection'
import CreativeScrollToTop from './components/CreativeScrollToTop'

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const FULL_NAME = 'Harshil Barot'

const ROLES = [
  'Video Editor',
  'Graphic Designer',
  'Content Creator',
  'Scriptwriter',
  'AI Video Artist'
]

const TOOLS = [
  'Premiere Pro', 'After Effects', 'CapCut', 'Photoshop', 'Canva', 'Figma',
  'DaVinci Resolve', 'Runway ML', 'Pika Labs', 'ChatGPT', 'Midjourney',
  'Illustrator', 'Lightroom', 'InShot', 'Notion'
]

const toolkitItems = [
  { icon: Layers, title: 'Editing Suite', desc: 'Premiere Pro, After Effects & DaVinci Resolve', color: '#0ea5e9' },
  { icon: Palette, title: 'Design Stack', desc: 'Photoshop, Illustrator, Canva & Figma', color: '#38bdf8' },
  { icon: Sparkles, title: 'AI Toolkit', desc: 'Runway, Pika Labs & generative video tools', color: '#06b6d4' },
  { icon: Camera, title: 'Capture Gear', desc: 'Mobile-first shooting & mobile editing flows', color: '#0284c7' },
  { icon: Music2, title: 'Audio & Sound', desc: 'Sound design, voiceovers & trending audio', color: '#0369a1' },
  { icon: Send, title: 'Publishing', desc: 'Reels, Shorts, YouTube & multi-platform exports', color: '#075985' }
]

const workItems = [
  {
    title: 'Brand Reel Series',
    desc: 'Short-form video series crafted for a growing D2C brand — hook-driven edits built for retention.',
    tags: ['Reels', 'Editing', 'Hooks'],
    icon: Clapperboard,
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
  },
  {
    title: 'Event Highlight Film',
    desc: 'Fast-paced highlight edit for a college fest, cut to trending audio with punchy transitions.',
    tags: ['Video Editing', 'Color Grade'],
    icon: Film,
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)'
  },
  {
    title: 'AI Concept Trailer',
    desc: 'AI-generated concept trailer exploring next-gen visual storytelling with generative video tools.',
    tags: ['AI Video', 'Runway ML'],
    icon: Wand2,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)'
  },
  {
    title: 'Poster & Thumbnail Pack',
    desc: 'A set of scroll-stopping thumbnails and social posters designed for maximum click-through.',
    tags: ['Graphic Design', 'Canva'],
    icon: PenTool,
    gradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)'
  },
  {
    title: 'Script-to-Screen Short',
    desc: 'Wrote and edited a narrative-driven short, from script outline to final cut.',
    tags: ['Scriptwriting', 'Editing'],
    icon: FileText,
    gradient: 'linear-gradient(135deg, #075985 0%, #0284c7 100%)'
  },
  {
    title: 'Content Calendar Campaign',
    desc: 'End-to-end content creation for a month-long campaign — ideation, shooting, and editing.',
    tags: ['Content Strategy', 'Reels'],
    icon: Megaphone,
    gradient: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)'
  }
]

function CreativePortfolio() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [displayedName, setDisplayedName] = useState('')
  const [displayedRole, setDisplayedRole] = useState('')
  const [showRoleCursor, setShowRoleCursor] = useState(true)
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('cp-home')

  const nameTimeouts = useRef([])
  const roleTimeouts = useRef([])

  // Scroll to top on mount + theme the body so the dev-portfolio's dark
  // background/scrollbar never bleeds through on this page (both route
  // bundles are loaded at once, so we scope the takeover via a body class).
  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.classList.add('cp-theme')
    return () => {
      document.body.classList.remove('cp-theme')
    }
  }, [])

  // Section highlight on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['cp-home', 'cp-about', 'cp-skills', 'cp-work', 'cp-contact']
      const current = sections.find(id => {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          return rect.top <= 120 && rect.bottom >= 120
        }
        return false
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll on mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileMenuOpen])

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowRoleCursor(p => !p), 500)
    return () => clearInterval(interval)
  }, [])

  // Name typewriter
  useEffect(() => {
    if (!isLoadingComplete) return
    nameTimeouts.current.forEach(clearTimeout)
    nameTimeouts.current = []
    setDisplayedName('')
    for (let i = 0; i <= FULL_NAME.length; i++) {
      const t = setTimeout(() => setDisplayedName(FULL_NAME.slice(0, i)), i * 100)
      nameTimeouts.current.push(t)
    }
    return () => nameTimeouts.current.forEach(clearTimeout)
  }, [isLoadingComplete])

  // Role typewriter
  useEffect(() => {
    if (!isLoadingComplete) return
    roleTimeouts.current.forEach(clearTimeout)
    roleTimeouts.current = []

    const startDelay = currentRoleIndex === 0 ? 1600 : 0

    const delay = setTimeout(() => {
      const currentRole = ROLES[currentRoleIndex]
      setDisplayedRole('')
      let charIndex = 0

      const typeNextChar = () => {
        if (charIndex <= currentRole.length) {
          setDisplayedRole(currentRole.slice(0, charIndex))
          charIndex++
          const t = setTimeout(typeNextChar, 75)
          roleTimeouts.current.push(t)
        } else {
          const hold = setTimeout(() => {
            setCurrentRoleIndex(prev => (prev + 1) % ROLES.length)
          }, 1800)
          roleTimeouts.current.push(hold)
        }
      }
      typeNextChar()
    }, startDelay)

    roleTimeouts.current.push(delay)
    return () => roleTimeouts.current.forEach(clearTimeout)
  }, [currentRoleIndex, isLoadingComplete])

  const navLinks = [
    { id: 'cp-home', label: 'Home' },
    { id: 'cp-about', label: 'About' },
    { id: 'cp-skills', label: 'Skills' },
    { id: 'cp-work', label: 'Work' },
    { id: 'cp-contact', label: 'Contact' }
  ]

  return (
    <>
      {!isLoadingComplete && (
        <CreativeLoadingScreen onLoadingComplete={() => setIsLoadingComplete(true)} />
      )}

      {isLoadingComplete && (
    <div className="cp-page">
      {/* Navigation */}
      <nav className="cp-navbar">
        <div className="cp-nav-container">
          <a href="#cp-home" className="cp-logo">
            <span>Harshil</span>
            <span className="cp-logo-dot">.</span>
          </a>

          <div className="cp-nav-center-shell">
            <div className="cp-nav-menu">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`cp-nav-item ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="cp-nav-actions">
            <Link to="/" className="cp-dev-mode-btn">
              <Code2Icon />
              <span className="cp-dev-mode-label">Dev Mode</span>
            </Link>
            <button
              className="cp-nav-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="cp-mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                className="cp-mobile-menu-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
                onClick={e => e.stopPropagation()}
              >
                <div className="cp-mobile-menu-header">
                  <span className="cp-mobile-menu-title">Menu</span>
                  <button className="cp-mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                    <X size={20} />
                  </button>
                </div>
                <nav className="cp-mobile-menu-links">
                  {navLinks.map(link => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      className={`cp-mobile-nav-item ${activeSection === link.id ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="cp-mobile-menu-footer">
                  <Link to="/" className="cp-dev-mode-btn" onClick={() => setIsMobileMenuOpen(false)}>
                    <Code2Icon />
                    <span>Switch to Dev Mode</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero */}
        <section className="cp-hero" id="cp-home">
          <div className="cp-hero-content">
            <motion.span
              className="cp-hero-greeting"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              Plot Twist
            </motion.span>
            <motion.h1
              className="cp-hero-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              I'm <span>{displayedName}</span>
            </motion.h1>
            <div className="cp-hero-role">
              <span>{displayedRole}</span>
              <span className="cp-role-cursor" style={{ opacity: showRoleCursor ? 1 : 0 }}>|</span>
            </div>
            <motion.p
              className="cp-hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The creative half of my brain. When I'm not writing code, I'm cutting reels,
              designing visuals, scripting stories, and experimenting with AI-generated video —
              turning raw ideas into content that actually connects.
            </motion.p>
            <motion.div
              className="cp-hero-cta-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a href="#cp-work" className="cp-btn-primary">
                <span>See My Work</span>
                <ArrowUpRight size={18} />
              </a>
              <a href="#cp-contact" className="cp-btn-secondary">
                <span>Let's Collab</span>
              </a>
            </motion.div>
            <motion.div
              className="cp-hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="cp-hero-stat">
                <strong>30+</strong>
                <span>Edits Delivered</span>
              </div>
              <div className="cp-hero-stat">
                <strong>6</strong>
                <span>Creative Crafts</span>
              </div>
              <div className="cp-hero-stat">
                <strong>15+</strong>
                <span>Tools Mastered</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="cp-scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span>Scroll</span>
            <span className="cp-scroll-hint-line" />
          </motion.div>
        </section>

        {/* About */}
        <section className="cp-section" id="cp-about">
          <div className="cp-container">
            <motion.div
              className="cp-section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="cp-section-label">The Creative Side</span>
              <h2 className="cp-section-title">About This Side of Me</h2>
              <p className="cp-section-subtitle">
                Same person, different canvas — swapping code editors for video timelines and design boards
              </p>
            </motion.div>

            <div className="cp-about-content">
              <motion.div
                className="cp-intro"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3>Hey, it's still Harshil</h3>
                <p className="cp-intro-text">
                  Outside of building web apps, I spend my time editing videos, designing visuals, and
                  creating content that people actually want to watch. I love experimenting with
                  <strong> AI video tools</strong>, cutting fast-paced reels, and writing scripts that hook
                  viewers in the first three seconds. It's the same problem-solving brain — just pointed at
                  a different craft.
                </p>
              </motion.div>

              <motion.div
                className="cp-vm-container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="cp-vm-card">
                  <div className="cp-vm-icon"><Eye size={28} /></div>
                  <h4>My Vision</h4>
                  <p>
                    To create content that stops the scroll — visuals and stories that feel authentic,
                    entertain first, and leave a lasting impression.
                  </p>
                </div>
                <div className="cp-vm-card">
                  <div className="cp-vm-icon"><Compass size={28} /></div>
                  <h4>My Mission</h4>
                  <p>
                    To keep experimenting at the edge of creativity and technology — blending editing,
                    design, and AI to tell stories in new ways.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="cp-traits-block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3>What I Bring to the Table</h3>
                <div className="cp-qualities-grid">
                  <div className="cp-quality-item">
                    <div className="cp-quality-icon" style={{ background: '#0ea5e9' }}><Zap size={26} /></div>
                    <h5>Fast Turnaround</h5>
                    <p>Quick, clean edits without cutting corners on quality</p>
                  </div>
                  <div className="cp-quality-item">
                    <div className="cp-quality-icon" style={{ background: '#38bdf8' }}><Lightbulb size={26} /></div>
                    <h5>Trend-Aware</h5>
                    <p>Always tuned into what's working across platforms right now</p>
                  </div>
                  <div className="cp-quality-item">
                    <div className="cp-quality-icon" style={{ background: '#0284c7' }}><Target size={26} /></div>
                    <h5>Story-First</h5>
                    <p>Every edit starts with a hook and a reason to keep watching</p>
                  </div>
                  <div className="cp-quality-item">
                    <div className="cp-quality-icon" style={{ background: '#06b6d4' }}><Sparkles size={26} /></div>
                    <h5>AI-Curious</h5>
                    <p>Constantly testing new AI tools to push creative boundaries</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="cp-section" id="cp-skills">
          <div className="cp-container">
            <motion.div
              className="cp-section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="cp-section-label">Craft & Toolkit</span>
              <h2 className="cp-section-title">Skills & Tools</h2>
              <p className="cp-section-subtitle">
                What I use to turn raw ideas into content worth watching
              </p>
            </motion.div>

            <div className="cp-skills-ticker-wrap">
              <div className="cp-ticker-track">
                <div className="cp-ticker-row">
                  {TOOLS.map((tool, i) => (
                    <span key={`a-${i}`} className="cp-ticker-item">{tool}</span>
                  ))}
                </div>
                <div className="cp-ticker-row">
                  {TOOLS.map((tool, i) => (
                    <span key={`b-${i}`} className="cp-ticker-item">{tool}</span>
                  ))}
                </div>
              </div>
            </div>

            <p className="cp-toolkit-label">Core Toolkit</p>
            <div className="cp-toolkit-grid">
              {toolkitItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    className="cp-tool-chip"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="cp-tool-chip-icon" style={{ background: item.color }}>
                      <Icon size={24} />
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Work / Portfolio Grid */}
        <section className="cp-section" id="cp-work">
          <div className="cp-container">
            <motion.div
              className="cp-section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="cp-section-label">Selected Work</span>
              <h2 className="cp-section-title">Creative Portfolio</h2>
              <p className="cp-section-subtitle">
                A mix of edits, designs, and AI-assisted experiments
              </p>
            </motion.div>

            <div className="cp-work-grid">
              {workItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    className="cp-work-card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="cp-work-thumb" style={{ background: item.gradient }}>
                      <Icon size={48} strokeWidth={1.5} />
                      <span className="cp-work-category-badge">{item.tags[0]}</span>
                    </div>
                    <div className="cp-work-info">
                      <h3 className="cp-work-title">{item.title}</h3>
                      <p className="cp-work-desc">{item.desc}</p>
                      <div className="cp-work-tags">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="cp-work-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Section with full form */}
        <CreativeContactSection />
      </main>

      {/* Footer */}
      <footer className="cp-footer-premium">
        <div className="cp-container">
          <div className="cp-footer-top">
            <div>
              <h2 className="cp-footer-brand-logo">Harshil<span>.</span></h2>
              <p className="cp-footer-brand-desc">
                The creative side of my portfolio — video editing, design, content, and AI-assisted
                storytelling, all in one place.
              </p>
              <div className="cp-footer-contact-info">
                <a href="mailto:harshill.barot@gmail.com" className="cp-footer-info-item">
                  <Mail size={16} />
                  <span>harshill.barot@gmail.com</span>
                </a>
                <div className="cp-footer-info-item">
                  <Compass size={16} />
                  <span>Vadodara, Gujarat, India</span>
                </div>
              </div>
            </div>

            <div className="cp-footer-links-section">
              <div className="cp-footer-link-column">
                <h4 className="cp-footer-column-title">Navigation</h4>
                <a href="#cp-home">Home</a>
                <a href="#cp-about">About</a>
                <a href="#cp-skills">Skills</a>
                <a href="#cp-work">Work</a>
                <a href="#cp-contact">Contact</a>
              </div>

              <div className="cp-footer-link-column">
                <h4 className="cp-footer-column-title">Creative Services</h4>
                <a href="#cp-work">Video Editing</a>
                <a href="#cp-work">Graphic Design</a>
                <a href="#cp-work">Content Creation</a>
                <a href="#cp-work">Scriptwriting</a>
                <a href="#cp-work">AI Video</a>
              </div>

              <div className="cp-footer-link-column">
                <h4 className="cp-footer-column-title">Elsewhere</h4>
                <Link to="/">Developer Portfolio</Link>
                <a href="mailto:harshill.barot@gmail.com">Email Me</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>

          <div className="cp-footer-divider-line"></div>

          <div className="cp-footer-bottom-section">
            <p className="cp-footer-copyright">
              © {new Date().getFullYear()} Harshil Barot — Creative Profile · <Link to="/">Back to Developer Portfolio</Link>
            </p>
            <div className="cp-footer-social-icons">
              <a href="mailto:harshill.barot@gmail.com" className="cp-footer-social-icon" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="cp-footer-social-icon" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <CreativeScrollToTop />
    </div>
      )}
    </>
  )
}

// Small inline code icon so we don't need to pull in a whole extra import name clash
function Code2Icon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export default CreativePortfolio
