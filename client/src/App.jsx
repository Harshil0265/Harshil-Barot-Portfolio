import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Mail, ExternalLink, Code2, Database, LayoutGrid, Server, Palette, Briefcase, Award, Calendar, Download, Phone, MapPin, MessageCircle, Camera, GitBranch, Gamepad2, BookOpen, Music, Plane, Target, Users, Lightbulb, GraduationCap, Sparkles, Rocket, Shield, Palette as PaletteIcon, Wrench, Sprout, Eye, Compass, Menu, X, Film, PenTool, Clapperboard, Wand2, Megaphone, FileText, ArrowUpRight } from 'lucide-react'
import './App.css'
import { getProjects } from './services/api'
import ProfilePhoto from './hehehe_upscale_upscaled (1).png'
import ContactSection from './components/ContactSection'
import LoadingScreen from './components/LoadingScreen'
import ScrollToTop from './components/ScrollToTop'
import AdminPanel from './components/AdminPanel'

// Custom Social Media Icons
const GithubIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

// Project Card Component
const ProjectCard = ({ project, index }) => {
  return (
    <motion.div 
      className="project-card-premium"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
    >
      <div className="project-image-wrapper">
        {project.image ? (
          <img 
            src={project.image} 
            alt={`${project.title} - ${project.category || 'Web Development'} project screenshot`} 
            loading="lazy"
            width="400"
            height="240"
          />
        ) : (
          <div className="project-placeholder">
            <LayoutGrid size={64} strokeWidth={1.5} />
            <span className="project-category-badge">{project.category || 'Project'}</span>
          </div>
        )}
        <div className="project-overlay">
          <div className="project-overlay-buttons">
            <motion.a 
              href={project.liveUrl || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-btn primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={18} />
              <span>Live Demo</span>
            </motion.a>
            {project.githubUrl && project.githubUrl !== '#' && (
              <motion.a 
                href={project.githubUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code2 size={18} />
                <span>Code</span>
              </motion.a>
            )}
          </div>
        </div>
      </div>
      <div className="project-info">
        <div className="project-header-row">
          {project.category && (
            <span className="project-category-pill">{project.category}</span>
          )}
          <div className="project-meta">
            {project.tags && project.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="project-tag">{tag}</span>
            ))}
          </div>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tech">
          {project.features && project.features.slice(0, 4).map((feature, idx) => (
            <span key={idx} className="tech-badge" title={feature.description}>
              {feature.title}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Stable module-level constants so their reference never changes across
// re-renders (this was previously causing the role typewriter effect to
// restart on every render since it recreated a new array each time).
const FULL_NAME = "Harshil Barot"

const ROLES = [
  'Full-Stack Developer',
  'UI/UX Designer',
  'Problem Solver',
  'Digital Creator'
]

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [displayedName, setDisplayedName] = useState('')
  const [displayedRole, setDisplayedRole] = useState('')
  const [showRoleCursor, setShowRoleCursor] = useState(true)
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const timeoutRefs = useRef([])
  const roleTimeoutRefs = useRef([])

  const skills = [
    { name: 'React.js', icon: <Code2 size={24} />, category: 'Frontend', level: 95 },
    { name: 'Node.js', icon: <Server size={24} />, category: 'Backend', level: 90 },
    { name: 'MongoDB', icon: <Database size={24} />, category: 'Database', level: 85 },
    { name: 'MySQL', icon: <Database size={24} />, category: 'Database', level: 80 },
    { name: 'UI/UX Design', icon: <Palette size={24} />, category: 'Design', level: 88 },
    { name: 'Next.js', icon: <LayoutGrid size={24} />, category: 'Frontend', level: 92 },
    { name: 'TypeScript', icon: <Code2 size={24} />, category: 'Frontend', level: 87 },
    { name: 'Express.js', icon: <Server size={24} />, category: 'Backend', level: 89 },
    { name: 'PostgreSQL', icon: <Database size={24} />, category: 'Database', level: 82 },
    { name: 'Docker', icon: <Server size={24} />, category: 'DevOps', level: 78 },
    { name: 'AWS', icon: <Server size={24} />, category: 'Cloud', level: 83 },
    { name: 'Git', icon: <Code2 size={24} />, category: 'Tools', level: 91 },
  ]

  // Comprehensive skills for the ticker
  const allSkills = [
    'React.js', 'Node.js', 'TypeScript', 'JavaScript', 'Next.js', 'Express.js',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'AWS', 'Git',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Sass', 'Material-UI',
    'Firebase', 'GraphQL', 'REST APIs', 'JSON', 'JWT', 'OAuth',
    'Webpack', 'Vite', 'ESLint', 'Prettier', 'Jest',
    'Figma', 'Photoshop', 'UI/UX Design', 'Responsive Design',
    'Postman', 'VS Code', 'Terminal'
  ]

  const experiences = [
    {
      title: 'Founder',
      company: 'Akshar Nirmaan',
      location: 'Vadodara, Gujarat',
      period: '2026 - Present',
      description: 'Building a technology-driven startup that empowers businesses to grow their digital presence through innovative solutions, strategic branding, and scalable growth strategies.',
      achievements: [
        'Providing end-to-end digital solutions including web development, branding, and marketing automation',
        'Developing data-driven content strategies and social media campaigns tailored to business objectives',
        'Creating comprehensive brand identities with creative content, graphics, and digital assets',
        'Implementing technology-driven solutions to optimize business operations and enhance customer engagement',
        'Managing client relationships and delivering measurable results for diverse industries'
      ]
    },
    {
      title: 'Web Development Intern',
      company: 'Pax Immigration',
      location: 'Remote',
      period: 'Dec 2025 - May 2026',
      description: 'Developed the Pax Immigration website from scratch, a full-stack web application for customer services using the MERN stack.',
      achievements: [
        'Built complete website using MERN stack (MongoDB, Express.js, React.js, Node.js)',
        'Contributed to frontend development with React.js, improving UI/UX and performance',
        'Collaborated with the backend team to integrate APIs, enhancing functionality and efficiency',
        'Implemented responsive design for seamless user experience across all devices'
      ]
    },
    {
      title: 'Intern',
      company: 'Nobel Learning PBC',
      location: 'Remote',
      period: 'May 2025 - July 2025',
      description: 'Developed web design, troubleshooting, and internet fundamentals knowledge while strengthening professional skills.',
      achievements: [
        'Strengthened communication, presentation, and idea-pitching skills',
        'Gained teamwork, leadership, and mentorship experience',
        'Improved time management and project coordination abilities',
        'Enhanced web design and troubleshooting capabilities'
      ]
    }
  ]

  const education = [
    {
      degree: 'Bachelor of Computer Science Engineering',
      field: 'Computer Science & Engineering',
      institution: 'GSFC University',
      location: 'Vadodara, Gujarat',
      period: '2022 - 2026',
      grade: 'CGPA: 7.70/10',
      highlights: ['Pursuing degree in Computer Science', 'Focus on Full-Stack Development', 'Active in tech communities and projects']
    },
    {
      degree: 'Higher Secondary Certificate (HSC - 12th)',
      field: 'Science Stream',
      institution: 'Alembic Vidyalaya',
      location: 'Vadodara, Gujarat',
      period: '2020 - 2022',
      grade: 'Percentage: 56%',
      highlights: ['Completed HSC with Science stream', 'Developed interest in programming', 'Started learning web development']
    },
    {
      degree: 'Secondary School Certificate (SSC - 10th)',
      field: 'General Studies',
      institution: 'Alembic Vidyalaya',
      location: 'Vadodara, Gujarat',
      period: '2019 - 2020',
      grade: 'Percentage: 77%',
      highlights: ['Completed secondary education', 'Strong foundation in academics', 'Participated in extracurricular activities']
    }
  ]

  const certifications = [
    {
      title: 'AWS Solution Architecture',
      issuer: 'Amazon Web Services',
      date: 'January 2026',
      credentialId: 'AWS-SA-2026'
    },
    {
      title: 'Deloitte Data Analytics',
      issuer: 'Deloitte',
      date: 'March 2026',
      credentialId: 'DELOITTE-DA-2026'
    },
    {
      title: 'Google Gemini Certification',
      issuer: 'Google',
      date: 'February 2026',
      credentialId: 'GOOGLE-GEMINI-2026'
    },
    {
      title: 'Responsible & Safe AI Systems',
      issuer: 'Google AI',
      date: 'April 2026',
      credentialId: 'GOOGLE-AI-SAFE-2026'
    },
    {
      title: 'Full Stack Web Development',
      issuer: 'Apna College',
      date: 'December 2025',
      credentialId: 'APNA-FULLSTACK-2025'
    },
    {
      title: 'Data Structures & Algorithms in JavaScript',
      issuer: 'Apna College',
      date: 'November 2025',
      credentialId: 'APNA-DSA-JS-2025'
    }
  ]

  const hobbies = [
    {
      name: 'Photography',
      icon: Camera,
      description: 'Capturing moments and exploring creative perspectives through lens'
    },
    {
      name: 'Open Source',
      icon: GitBranch,
      description: 'Contributing to open-source projects and building developer tools'
    },
    {
      name: 'Gaming',
      icon: Gamepad2,
      description: 'Exploring game design and playing strategic multiplayer games'
    },
    {
      name: 'Reading',
      icon: BookOpen,
      description: 'Tech blogs, sci-fi novels, and personal development books'
    },
    {
      name: 'Music',
      icon: Music,
      description: 'Playing guitar and exploring different music genres'
    },
    {
      name: 'Travel',
      icon: Plane,
      description: 'Discovering new places, cultures, and cuisines'
    }
  ]

  const achievements = [
    {
      title: 'Founder of Akshar Nirmaan',
      organization: 'Akshar Nirmaan',
      description: 'Founded a technology-driven startup empowering businesses with digital solutions, branding, and growth strategies',
      date: 'January 2026'
    },
    {
      title: 'Best Intern Recognition',
      organization: 'Pax Immigration',
      description: 'Awarded for exceptional performance, dedication, and delivering high-quality full-stack solutions during internship',
      date: 'May 2026'
    },
    {
      title: 'Tech Community Leader',
      organization: 'Local Developer Community',
      description: 'Led technical workshops and mentored aspiring developers in web development and programming fundamentals',
      date: 'February 2026'
    }
  ]

  const testimonials = [
    {
      name: 'Aatish Parekh',
      role: 'Founder, Pax Immigration',
      image: null,
      text: 'Harshil built our complete immigration platform from scratch. His full-stack expertise and attention to detail resulted in a robust, user-friendly system that exceeded our expectations.',
      rating: 5,
      project: 'Pax Immigration Website'
    },
    {
      name: 'Maulik Brahmbhatt',
      role: 'Director, Local Business Directory',
      image: null,
      text: 'Working with Harshil on our Australian local search directory was fantastic. He delivered a scalable solution with excellent performance and seamless user experience.',
      rating: 5,
      project: 'Australia Local Search Directory'
    },
    {
      name: 'Rahul Mehta',
      role: 'CEO, ShabdSetu',
      image: null,
      text: 'Harshil developed our educational platform with impressive technical skills. The live class integration and course management system work flawlessly.',
      rating: 5,
      project: 'ShabdSetu Educational Platform'
    },
    {
      name: 'Priya Shah',
      role: 'Owner, ChaiBugs Cafe',
      image: null,
      text: 'Our cafe platform is exactly what we needed! Harshil created a beautiful e-commerce system with smooth ordering and payment integration. Highly recommended!',
      rating: 5,
      project: 'ChaiBugs Cafe Platform'
    },
    {
      name: 'Vikram Patel',
      role: 'Startup Founder',
      image: null,
      text: 'Harshil helped launch our SaaS product with exceptional quality. His problem-solving skills and clean code practices made the development process smooth.',
      rating: 5,
      project: 'SaaS Application'
    },
    {
      name: 'Anjali Desai',
      role: 'Marketing Director',
      image: null,
      text: 'The website Harshil built for us is stunning and performs amazingly. His understanding of both design and functionality is impressive.',
      rating: 5,
      project: 'Corporate Website'
    },
    {
      name: 'Karan Singh',
      role: 'Tech Lead, E-Commerce',
      image: null,
      text: 'Harshil delivered our e-commerce platform ahead of schedule with all requested features. His dedication and technical expertise are top-notch.',
      rating: 5,
      project: 'E-Commerce Platform'
    },
    {
      name: 'Neha Gupta',
      role: 'Product Manager',
      image: null,
      text: 'Working with Harshil was a great experience. He understood our requirements perfectly and delivered a solution that our users love.',
      rating: 5,
      project: 'Product Dashboard'
    },
    {
      name: 'Rohan Joshi',
      role: 'Business Owner',
      image: null,
      text: 'Harshil transformed our digital presence completely. The web application he built is modern, fast, and exactly what we envisioned.',
      rating: 5,
      project: 'Business Web App'
    },
    {
      name: 'Sneha Reddy',
      role: 'Startup Co-Founder',
      image: null,
      text: 'Incredible work by Harshil! He built our MVP with great attention to detail and helped us launch successfully. Truly professional and talented.',
      rating: 5,
      project: 'Startup MVP'
    },
    {
      name: 'Amit Kumar',
      role: 'Project Manager',
      image: null,
      text: 'Harshil is a reliable developer who delivers quality work consistently. His technical skills and communication make him a pleasure to work with.',
      rating: 5,
      project: 'Enterprise Solution'
    },
    {
      name: 'Pooja Sharma',
      role: 'Digital Marketing Head',
      image: null,
      text: 'The website Harshil created for our campaign was perfect. Fast loading, beautiful design, and great SEO optimization. Highly satisfied!',
      rating: 5,
      project: 'Campaign Website'
    }
  ]


  useEffect(() => {
    fetchProjects()
    
    // Smooth scroll observer for navigation
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'education', 'certifications', 'experience', 'projects', 'achievements', 'hobbies', 'testimonials', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Admin Panel Keyboard Shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setIsAdminPanelOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Role cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowRoleCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  // Lock body scroll when mobile menu is open, close on resize to desktop
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileMenuOpen])

  // Typewriter effect for name (no cursor after complete)
  useEffect(() => {
    if (!isLoadingComplete) return;
    
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []
    
    setDisplayedName('')
    
    for (let i = 0; i <= FULL_NAME.length; i++) {
      const timeout = setTimeout(() => {
        setDisplayedName(FULL_NAME.slice(0, i))
      }, i * 120)
      
      timeoutRefs.current.push(timeout)
    }
    
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      timeoutRefs.current = []
    }
  }, [isLoadingComplete])

  // Typewriter effect for roles - simplified and bulletproof
  useEffect(() => {
    if (!isLoadingComplete) return;
    
    // Clear all role timeouts
    roleTimeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    roleTimeoutRefs.current = []
    
    // Wait for the name typewriter to finish first (~13 chars * 120ms + buffer)
    const initialDelay = setTimeout(() => {
      const typeRole = () => {
        const currentRole = ROLES[currentRoleIndex]
        
        // Clear the displayed role
        setDisplayedRole('')
        
        // Type each character with delay
        let charIndex = 0
        const typeNextChar = () => {
          if (charIndex <= currentRole.length) {
            setDisplayedRole(currentRole.slice(0, charIndex))
            charIndex++
            const charTimeout = setTimeout(typeNextChar, 80)
            roleTimeoutRefs.current.push(charTimeout)
          } else {
            // Typing complete, wait then go to next role
            const holdTimeout = setTimeout(() => {
              setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length)
            }, 2000)
            roleTimeoutRefs.current.push(holdTimeout)
          }
        }
        
        typeNextChar()
      }
      
      typeRole()
    }, currentRoleIndex === 0 ? 1800 : 0)
    
    roleTimeoutRefs.current.push(initialDelay)
    
    return () => {
      roleTimeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      roleTimeoutRefs.current = []
    }
  }, [currentRoleIndex, isLoadingComplete])

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      if (data && data.length > 0) {
        setProjects(data)
        setLoading(false)
        return
      }
    } catch (err) {
      console.error('Error fetching projects from API:', err)
    }
    
    // Always show featured projects (either API failed or returned empty)
    setProjects([
      {
        _id: '1',
        title: 'Pax Immigration',
        description: 'A comprehensive full-stack immigration services platform built with MERN stack, featuring client portals, document management, case tracking, and integrated payment processing.',
        tags: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
        features: [
          { title: 'MERN Stack', description: 'Full-Stack Development' },
          { title: 'Client Portal', description: 'User Management' },
          { title: 'Document System', description: 'File Management' },
          { title: 'Payment Integration', description: 'Secure Transactions' }
        ],
        liveUrl: 'https://www.paximmigration.in',
        githubUrl: '#',
        image: null,
        category: 'Web Development'
      },
      {
        _id: '2',
        title: 'ChaiBugs Cafe Platform',
        description: 'Modern cafe management system with online ordering, table reservation, menu management, and real-time order tracking. Built for seamless customer experience and efficient operations.',
        tags: ['React.js', 'Firebase', 'Stripe', 'Tailwind CSS'],
        features: [
          { title: 'Online Ordering', description: 'E-Commerce' },
          { title: 'Table Booking', description: 'Reservation System' },
          { title: 'Menu Manager', description: 'Admin Dashboard' },
          { title: 'Payment Gateway', description: 'Stripe Integration' }
        ],
        liveUrl: 'https://chai-bugs.vercel.app',
        githubUrl: '#',
        image: null,
        category: 'E-Commerce'
      },
      {
        _id: '3',
        title: 'ShabdSetu',
        description: 'An innovative educational platform connecting students with quality learning resources. Features include course management, live classes, progress tracking, and interactive assessments.',
        tags: ['Next.js', 'PostgreSQL', 'TypeScript', 'WebRTC'],
        features: [
          { title: 'Live Classes', description: 'Video Conferencing' },
          { title: 'Course System', description: 'LMS Platform' },
          { title: 'Progress Tracking', description: 'Analytics Dashboard' },
          { title: 'Assessments', description: 'Interactive Quizzes' }
        ],
        liveUrl: 'https://shabdsetu-mocha.vercel.app',
        githubUrl: '#',
        image: null,
        category: 'Education'
      },
      {
        _id: '4',
        title: 'Akshar Nirmaan',
        description: 'A technology-driven digital growth platform empowering businesses with comprehensive branding solutions, marketing automation, and scalable digital strategies for enhanced online presence.',
        tags: ['React.js', 'Node.js', 'AI/ML', 'Marketing Automation'],
        features: [
          { title: 'Brand Identity', description: 'Creative Design' },
          { title: 'Digital Marketing', description: 'Growth Strategies' },
          { title: 'Automation Tools', description: 'Business Solutions' },
          { title: 'Analytics', description: 'Performance Tracking' }
        ],
        liveUrl: 'https://aksharnirmaan.com',
        githubUrl: '#',
        image: null,
        category: 'Digital Solutions'
      }
    ])
    setLoading(false)
  }

  const stripVariants = {
    hidden: { opacity: 0, y: -2000 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + (i * 0.12),
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    })
  }

  // Note: these delays run right after the loading screen unmounts, so they
  // should be short. Previously they were tuned for 1.8-2.5s, which left the
  // homepage looking blank/frozen for a couple seconds after loading finished.
  const navVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: -150 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.7,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  const photoVariants = {
    hidden: { opacity: 0, y: -200 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.75,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  return (
    <>
      {/* Loading Screen */}
      {!isLoadingComplete && (
        <LoadingScreen onLoadingComplete={() => setIsLoadingComplete(true)} />
      )}

      {/* Main App Content */}
      {isLoadingComplete && (
        <div className="app">
      {/* Navigation */}
      <motion.nav 
        className="navbar-premium" 
        variants={navVariants} 
        initial="hidden" 
        animate="visible"
      >
        <div className="nav-container">
          <motion.a href="#home" className="nav-logo" whileHover={{ scale: 1.03 }}>
            <span className="logo-text">Harshil</span>
            <span className="logo-dot">.</span>
          </motion.a>

          <div className="nav-center-shell">
            <div className="nav-menu">
              <a href="#home" className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}>Home</a>
              <a href="#about" className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}>About</a>
              <a href="#skills" className={`nav-item ${activeSection === 'skills' ? 'active' : ''}`}>Skills</a>
              <a href="#education" className={`nav-item ${activeSection === 'education' ? 'active' : ''}`}>Education</a>
              <a href="#experience" className={`nav-item ${activeSection === 'experience' ? 'active' : ''}`}>Experience</a>
              <a href="#projects" className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}>Projects</a>
              <a href="#testimonials" className={`nav-item ${activeSection === 'testimonials' ? 'active' : ''}`}>Reviews</a>
              <a href="#contact" className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}>Contact</a>
            </div>
          </div>

          <div className="nav-actions">
            <motion.a 
              href="/Harshil_Barot_Resume.pdf" 
              className="nav-resume-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={18} />
              <span>Resume</span>
            </motion.a>

            <motion.a 
              href="#contact" 
              className="nav-cta"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>Hire Me</span>
            </motion.a>

            <button
              className="nav-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                className="mobile-menu-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.35, ease: [0.6, -0.05, 0.01, 0.99] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mobile-menu-header">
                  <span className="mobile-menu-title">Menu</span>
                  <button
                    className="mobile-menu-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                  >
                    <X size={24} />
                  </button>
                </div>
                <nav className="mobile-menu-links">
                  <a href="#home" className={`mobile-nav-item ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                  <a href="#about" className={`mobile-nav-item ${activeSection === 'about' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>About</a>
                  <a href="#skills" className={`mobile-nav-item ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
                  <a href="#education" className={`mobile-nav-item ${activeSection === 'education' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Education</a>
                  <a href="#experience" className={`mobile-nav-item ${activeSection === 'experience' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Experience</a>
                  <a href="#projects" className={`mobile-nav-item ${activeSection === 'projects' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
                  <a href="#testimonials" className={`mobile-nav-item ${activeSection === 'testimonials' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
                  <a href="#contact" className={`mobile-nav-item ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                </nav>
                <div className="mobile-menu-footer">
                  <a 
                    href="/Harshil_Barot_Resume.pdf" 
                    className="mobile-resume-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Download size={18} />
                    <span>Download Resume</span>
                  </a>
                  <a 
                    href="#contact" 
                    className="mobile-cta-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Hire Me</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="strips-container">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="strip"
              custom={i}
              variants={stripVariants}
              initial="hidden"
              animate="visible"
              style={{
                left: `${i * (100 / 12)}%`
              }}
            />
          ))}
        </div>
        
        <div className="hero-content">
          <motion.div className="hero-text" variants={textVariants} initial="hidden" animate="visible">
            <motion.span 
              className="hero-greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Hey There! 👋
            </motion.span>
            <h1 className="hero-name">
              I'm <span className="typewriter-text">{displayedName}</span>
            </h1>
            <div className="hero-role">
              <span className="role-text">
                {displayedRole}
                <span 
                  className="role-cursor" 
                  style={{ opacity: showRoleCursor ? 1 : 0 }}
                >
                  |
                </span>
              </span>
            </div>
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
            >
              Turning ideas into reality through code. Building stunning digital 
              experiences that users love and businesses thrive on. Let's create 
              something amazing together! ✨
            </motion.p>
            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              <motion.a 
                href="#contact" 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={20} />
                <span>Get In Touch</span>
              </motion.a>
              <motion.a 
                href="#projects" 
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Briefcase size={20} />
                <span>View Projects</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="photo-container" variants={photoVariants} initial="hidden" animate="visible">
          <img 
            src={ProfilePhoto} 
            alt="Harshil Barot - Full-Stack Developer and Founder of Akshar Nirmaan" 
            className="profile-photo"
            width="600"
            height="800"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        <motion.div 
          className="hero-bottom-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
        ></motion.div>
      </section>


      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Get To Know Me</span>
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">
              Passionate developer and entrepreneur dedicated to creating impactful digital solutions
            </p>
          </motion.div>

          <div className="about-content-full">
            <motion.div 
              className="about-intro"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>Hi, I'm Harshil Barot</h3>
              <p className="intro-text">
                I'm a full-stack developer and founder of <strong>Akshar Nirmaan</strong>, driven by a passion for transforming ideas into digital reality. 
                With expertise in the MERN stack and modern web technologies, I craft scalable applications that solve real-world problems and deliver 
                exceptional user experiences.
              </p>
            </motion.div>

            {/* Vision & Mission */}
            <motion.div 
              className="vision-mission-container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="vision-card">
                <div className="card-icon">
                  <Eye size={32} />
                </div>
                <h4>My Vision</h4>
                <p>
                  To empower businesses and individuals through innovative technology solutions that drive growth, enhance digital presence, 
                  and create lasting impact. I envision a future where technology bridges gaps and opens doors to endless possibilities.
                </p>
              </div>

              <div className="mission-card">
                <div className="card-icon">
                  <Compass size={32} />
                </div>
                <h4>My Mission</h4>
                <p>
                  To deliver high-quality, scalable web solutions that exceed client expectations while maintaining clean code practices 
                  and staying at the forefront of technological advancement. I'm committed to continuous learning and helping others grow 
                  in their tech journey.
                </p>
              </div>
            </motion.div>

            {/* Who I Am */}
            <motion.div 
              className="about-qualities"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3>As a Person</h3>
              <div className="qualities-grid">
                <div className="quality-item">
                  <div className="quality-icon">
                    <Target size={32} />
                  </div>
                  <h5>Goal-Oriented</h5>
                  <p>I set clear objectives and work persistently to achieve them, always striving for excellence</p>
                </div>
                <div className="quality-item">
                  <div className="quality-icon">
                    <Users size={32} />
                  </div>
                  <h5>Collaborative</h5>
                  <p>I thrive in team environments, valuing diverse perspectives and fostering positive relationships</p>
                </div>
                <div className="quality-item">
                  <div className="quality-icon">
                    <Lightbulb size={32} />
                  </div>
                  <h5>Creative Thinker</h5>
                  <p>I approach challenges with innovative mindset, finding unique solutions to complex problems</p>
                </div>
                <div className="quality-item">
                  <div className="quality-icon">
                    <GraduationCap size={32} />
                  </div>
                  <h5>Lifelong Learner</h5>
                  <p>I'm constantly exploring new technologies and methodologies to stay ahead in the field</p>
                </div>
              </div>
            </motion.div>

            {/* As a Developer */}
            <motion.div 
              className="about-developer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3>As a Developer</h3>
              <div className="developer-traits">
                <div className="trait-item">
                  <div className="trait-icon">
                    <Sparkles size={28} />
                  </div>
                  <div className="trait-content">
                    <h5>Clean Code Advocate</h5>
                    <p>I write maintainable, well-documented code that follows industry best practices and standards</p>
                  </div>
                </div>
                <div className="trait-item">
                  <div className="trait-icon">
                    <Rocket size={28} />
                  </div>
                  <div className="trait-content">
                    <h5>Performance-Focused</h5>
                    <p>I optimize applications for speed and efficiency, ensuring seamless user experiences</p>
                  </div>
                </div>
                <div className="trait-item">
                  <div className="trait-icon">
                    <Shield size={28} />
                  </div>
                  <div className="trait-content">
                    <h5>Security-Conscious</h5>
                    <p>I prioritize security in every project, implementing robust authentication and data protection</p>
                  </div>
                </div>
                <div className="trait-item">
                  <div className="trait-icon">
                    <Palette size={28} />
                  </div>
                  <div className="trait-content">
                    <h5>User-Centric Design</h5>
                    <p>I create intuitive interfaces that prioritize accessibility and delightful user experiences</p>
                  </div>
                </div>
                <div className="trait-item">
                  <div className="trait-icon">
                    <Wrench size={28} />
                  </div>
                  <div className="trait-content">
                    <h5>Problem Solver</h5>
                    <p>I tackle complex technical challenges with analytical thinking and practical solutions</p>
                  </div>
                </div>
                <div className="trait-item">
                  <div className="trait-icon">
                    <Sprout size={28} />
                  </div>
                  <div className="trait-content">
                    <h5>Open Source Contributor</h5>
                    <p>I believe in giving back to the community and sharing knowledge with fellow developers</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="about-stats"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="stat-item">
                <Briefcase size={28} />
                <div className="stat-content">
                  <h4>2+</h4>
                  <p>Years Experience</p>
                </div>
              </div>
              <div className="stat-item">
                <Award size={28} />
                <div className="stat-content">
                  <h4>15+</h4>
                  <p>Projects Completed</p>
                </div>
              </div>
              <div className="stat-item">
                <Code2 size={28} />
                <div className="stat-content">
                  <h4>20+</h4>
                  <p>Technologies</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section" id="skills">
        <div className="container">
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Technical Excellence</span>
            <h2 className="section-title skills-title">Skills & Expertise</h2>
            <p className="section-subtitle skills-subtitle">
              Mastering cutting-edge technologies to deliver exceptional digital solutions
            </p>
          </motion.div>

          {/* Main Skills Cards */}
          <motion.div 
            className="skills-showcase"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Single Line Skills Ticker */}
            <div className="skills-single-line">
              <div className="skills-ticker-single">
                <div className="ticker-row-single">
                  {/* First set for seamless loop */}
                  {allSkills.map((skill, index) => (
                    <span key={`first-${index}`} className="ticker-item-single">
                      {skill}
                    </span>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {allSkills.map((skill, index) => (
                    <span key={`second-${index}`} className="ticker-item-single">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className="education-section" id="education">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Academic Background</span>
            <h2 className="section-title">Education</h2>
            <p className="section-subtitle">
              My academic journey and qualifications
            </p>
          </motion.div>

          <div className="education-timeline">
            {education.map((edu, index) => (
              <motion.div 
                key={index}
                className="education-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="education-icon">
                  <Award size={32} />
                </div>
                <div className="education-details">
                  <h3 className="education-degree">{edu.degree}</h3>
                  <h4 className="education-field">{edu.field}</h4>
                  <div className="education-institution">
                    <MapPin size={16} />
                    <span>{edu.institution}, {edu.location}</span>
                  </div>
                  <div className="education-meta">
                    <div className="education-period">
                      <Calendar size={16} />
                      <span>{edu.period}</span>
                    </div>
                    <div className="education-grade">
                      {edu.grade}
                    </div>
                  </div>
                  <ul className="education-highlights">
                    {edu.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="certifications-section" id="certifications">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Professional Development</span>
            <h2 className="section-title">Certifications</h2>
            <p className="section-subtitle">
              Continuous learning and skill validation
            </p>
          </motion.div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <motion.div 
                key={index}
                className="certification-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="cert-header">
                  <Award size={28} className="cert-icon" />
                  <span className="cert-date">{cert.date}</span>
                </div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <div className="cert-credential">
                  ID: {cert.credentialId}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience-section" id="experience">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Career Journey</span>
            <h2 className="section-title">Work Experience</h2>
            <p className="section-subtitle">
              Building impactful solutions across different organizations
            </p>
          </motion.div>

          <div className="experience-timeline">
            {experiences.map((exp, index) => (
              <motion.div 
                key={index}
                className="experience-item"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="experience-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-line"></div>
                </div>
                <div className="experience-content">
                  <div className="experience-header">
                    <div>
                      <h3>{exp.title}</h3>
                      <h4>{exp.company}</h4>
                      {exp.location && (
                        <div className="experience-location">
                          <MapPin size={16} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="experience-period">
                      <Calendar size={18} />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                  <p className="experience-description">{exp.description}</p>
                  <ul className="experience-achievements">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section" id="projects">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">My Work</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              Showcasing recent work and successful project deliveries
            </p>
          </motion.div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading projects...</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
              {projects.length === 0 && (
                <div className="empty-state">
                  <LayoutGrid size={64} />
                  <p>No projects available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section" id="achievements">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Milestones</span>
            <h2 className="section-title">Achievements & Awards</h2>
            <p className="section-subtitle">
              Recognition and accomplishments throughout my journey
            </p>
          </motion.div>

          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index}
                className="achievement-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className="achievement-icon">
                  <Award size={40} />
                </div>
                <h3 className="achievement-title">{achievement.title}</h3>
                <h4 className="achievement-org">{achievement.organization}</h4>
                <p className="achievement-description">{achievement.description}</p>
                <span className="achievement-date">{achievement.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies Section - Bento Grid Layout */}
      <section className="hobbies-section" id="hobbies">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Beyond Work</span>
            <h2 className="section-title">Hobbies & Interests</h2>
            <p className="section-subtitle">
              What I love to do in my free time
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="hobbies-bento-grid">
            {hobbies.map((hobby, index) => {
              const IconComponent = hobby.icon;
              return (
                <motion.div 
                  key={index}
                  className={`hobby-bento-item hobby-bento-${index + 1}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                >
                  <div className="hobby-bento-content">
                    <span className="hobby-icon-wrapper">
                      <IconComponent size={32} strokeWidth={2} />
                    </span>
                    <div className="hobby-text">
                      <h3 className="hobby-title">{hobby.name}</h3>
                      <p className="hobby-desc">{hobby.description}</p>
                    </div>
                    <div className="hobby-badge">{String(index + 1).padStart(2, '0')}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Creative Side CTA */}
          <motion.div
            className="creative-cta-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="creative-cta-glow" />

            <div className="creative-cta-header">
              <span className="creative-cta-badge">
                <Sparkles size={14} />
                PLOT TWIST
              </span>
              <h3 className="creative-cta-title">
                Want to see the <span className="creative-cta-highlight">other side</span> of Harshil?
              </h3>
              <p className="creative-cta-subtitle">
                Code isn't the only thing I create. Off-screen (well, still on-screen) I edit videos,
                design visuals, write scripts, and play with AI tools to bring ideas to life.
              </p>
            </div>

            <Link to="/creative" className="creative-cta-button">
              <span>Explore My Creative Side</span>
              <ArrowUpRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Carousel/Slider Layout */}
      <section className="testimonials-section" id="testimonials">
        <div className="container-full">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Client Feedback</span>
            <h2 className="section-title">What People Say</h2>
            <p className="section-subtitle">
              Testimonials from amazing people I've worked with
            </p>
          </motion.div>

          {/* Clean Minimal Testimonials Grid with Auto-Scroll */}
          <div className="testimonials-grid-minimal">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card-minimal"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="testimonial-content-minimal">
                  {/* Project Badge */}
                  {testimonial.project && (
                    <div className="testimonial-project-badge">{testimonial.project}</div>
                  )}

                  {/* Quote */}
                  <p className="testimonial-text-minimal">"{testimonial.text}"</p>

                  {/* Rating */}
                  <div className="testimonial-rating-minimal">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star-minimal">★</span>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="testimonial-author-minimal">
                    <div className="author-avatar-minimal">
                      {testimonial.image ? (
                        <img src={testimonial.image} alt={`${testimonial.name} - Client testimonial`} loading="lazy" width="56" height="56" />
                      ) : (
                        <div className="avatar-letter">{testimonial.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="author-info-minimal">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
      </main>

      {/* Footer */}
      <footer className="footer-premium">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand-section">
              <h2 className="footer-brand-logo">Harshil<span>.</span></h2>
              <p className="footer-brand-desc">
                Modern full-stack portfolio crafted in a darker editorial style with clean motion, sharp layouts, and premium front-end detail.
              </p>

              <div className="footer-contact-info">
                <a href="mailto:harshill.barot@gmail.com" className="footer-info-item">
                  <Mail size={16} />
                  <span>harshill.barot@gmail.com</span>
                </a>
                <div className="footer-info-item">
                  <MapPin size={16} />
                  <span>Vadodara, Gujarat, India</span>
                </div>
                <a href="tel:+918866982848" className="footer-info-item">
                  <Phone size={16} />
                  <span>+91 88669 82848</span>
                </a>
              </div>
            </div>

            <div className="footer-links-section">
              <div className="footer-link-column">
                <h4 className="footer-column-title"><span className="footer-title-mark"></span>Navigation</h4>
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#skills">Skills</a>
                <a href="#education">Education</a>
                <a href="#experience">Experience</a>
                <a href="#projects">Projects</a>
                <a href="#achievements">Achievements</a>
                <a href="#hobbies">Hobbies</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#contact">Contact</a>
              </div>

              <div className="footer-link-column">
                <h4 className="footer-column-title"><span className="footer-title-mark"></span>Services</h4>
                <a href="#projects">Frontend Development</a>
                <a href="#projects">Backend Systems</a>
                <a href="#projects">UI/UX Direction</a>
                <a href="#projects">Responsive Websites</a>
                <a href="#projects">API Integration</a>
              </div>

              <div className="footer-link-column">
                <h4 className="footer-column-title"><span className="footer-title-mark"></span>Stack</h4>
                <a href="#skills">React.js</a>
                <a href="#skills">Next.js</a>
                <a href="#skills">Node.js</a>
                <a href="#skills">MongoDB</a>
                <a href="#skills">Framer Motion</a>
              </div>

              <div className="footer-link-column">
                <h4 className="footer-column-title"><span className="footer-title-mark"></span>Resources</h4>
                <a href="/Harshil_Barot_Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
                <a href="#experience">Experience</a>
                <a href="#projects">Case Studies</a>
                <a href="mailto:harshill.barot@gmail.com">Work Inquiry</a>
                <a href="https://github.com/harshilbarot" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
              </div>
            </div>
          </div>

          <div className="footer-divider-line"></div>

          <div className="footer-bottom-section">
            <div className="footer-copyright">
              <p>© 2026 Harshil Barot. All rights reserved.</p>
              <div className="footer-legal-links">
                <a href="#home">Back to top</a>
                <span className="separator">•</span>
                <a href="#projects">Selected work</a>
                <span className="separator">•</span>
                <a href="#contact">Let&apos;s connect</a>
              </div>
            </div>

            <div className="footer-social-icons">
              <motion.a
                href="https://github.com/harshilbarot"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                whileHover={{ y: -3 }}
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/harshil-barot-211513353"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                whileHover={{ y: -3 }}
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </motion.a>
              <motion.a
                href="https://twitter.com/harshilbarot"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                whileHover={{ y: -3 }}
                aria-label="Twitter"
              >
                <TwitterIcon size={18} />
              </motion.a>
              <motion.a
                href="https://instagram.com/harshilbarot"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                whileHover={{ y: -3 }}
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </motion.a>
              <motion.a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle"
                whileHover={{ y: -3 }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Admin Panel - Hidden, opens with Ctrl + Shift + A */}
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </div>
      )}
    </>
  )
}

export default App
