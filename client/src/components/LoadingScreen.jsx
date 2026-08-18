import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Terminal, GitBranch, Database, Server, Braces, FileCode, Cpu, Coffee, Laptop, Bug, Binary } from 'lucide-react'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [fallingItems, setFallingItems] = useState([])
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRefs = useRef([])

  // Developer-themed falling icons — code symbols, terminals, stacks and
  // tooling that match the dev portfolio's identity, in its orange/ink theme.
  const techIcons = [
    { icon: Code2, color: '#d97706' },
    { icon: Terminal, color: '#1a1a1a' },
    { icon: GitBranch, color: '#d97706' },
    { icon: Database, color: '#1a1a1a' },
    { icon: Server, color: '#d97706' },
    { icon: Braces, color: '#1a1a1a' },
    { icon: FileCode, color: '#d97706' },
    { icon: Cpu, color: '#1a1a1a' }
  ]

  const allItems = [
    ...techIcons,
    { icon: Coffee, color: '#1a1a1a', size: 32 },
    { icon: Laptop, color: '#d97706', size: 36 },
    { icon: Bug, color: '#f59e0b', size: 28 },
    { icon: Binary, color: '#d97706', size: 30 }
  ]

  // Harshil Barot in a focused set of languages, followed by his role
  // titles (matching the hero section's ROLES) so the loading screen
  // introduces both the name and what he does before handing off.
  const languageVersions = [
    { text: 'Harshil Barot', language: 'English' },
    { text: 'Full-Stack Developer', language: 'MERN Stack' },
    { text: 'UI/UX Designer', language: 'Figma · Design Systems' },
    { text: 'Problem Solver', language: 'Logic & Debugging' },
    { text: 'Digital Creator', language: 'Content & Code' }
  ]

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500) // Blink every 500ms

    return () => clearInterval(cursorInterval)
  }, [])

  // Typewriter effect for each language
  useEffect(() => {
    // Clear any existing timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []

    const currentText = languageVersions[currentLanguageIndex].text
    setDisplayedText('')

    // Type each character
    for (let i = 0; i <= currentText.length; i++) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, i))

        // After typing is complete
        if (i === currentText.length) {
          // Wait before moving to next language
          const nextTimeout = setTimeout(() => {
            if (currentLanguageIndex < languageVersions.length - 1) {
              setCurrentLanguageIndex(prev => prev + 1)
            } else {
              // All languages complete - finish loading
              const completeTimeout = setTimeout(() => {
                setIsComplete(true)
                const finalTimeout = setTimeout(() => {
                  onLoadingComplete()
                }, 400)
                timeoutRefs.current.push(finalTimeout)
              }, 600)
              timeoutRefs.current.push(completeTimeout)
            }
          }, 500) // Hold for 500ms before next language (faster)
          timeoutRefs.current.push(nextTimeout)
        }
      }, i * 50) // 50ms per character (2x faster)

      timeoutRefs.current.push(timeout)
    }

    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      timeoutRefs.current = []
    }
  }, [currentLanguageIndex])

  useEffect(() => {
    // Gentle falling items - avoid center area where name displays
    const fallingInterval = setInterval(() => {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
      // Avoid center 50% of screen (25% to 75%) where text displays
      let randomX = Math.random() * 100
      if (randomX > 25 && randomX < 75) {
        randomX = randomX < 50 ? randomX - 30 : randomX + 30
      }
      // Clamp to screen bounds
      randomX = Math.max(5, Math.min(95, randomX))
      const randomRotation = Math.random() * 360
      
      const newItem = {
        id: Date.now() + Math.random(),
        ...randomItem,
        x: randomX,
        rotation: randomRotation
      }
      
      setFallingItems((prev) => [...prev, newItem])
      
      setTimeout(() => {
        setFallingItems((prev) => prev.filter((item) => item.id !== newItem.id))
      }, 2500)
    }, 150)

    return () => {
      clearInterval(fallingInterval)
    }
  }, [])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="loading-screen-fireworks"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dotted Grid Background */}
          <div className="loading-dotted-bg"></div>

          {/* Falling Items - Top to Bottom */}
          <div className="falling-container">
            {fallingItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.id}
                  className="falling-item"
                  initial={{
                    top: '-10%',
                    left: `${item.x}%`,
                    opacity: 0,
                    scale: 0.3,
                    rotate: 0
                  }}
                  animate={{
                    top: '110%',
                    opacity: [0, 1, 1, 0],
                    scale: [0.3, 1, 1, 0.8],
                    rotate: item.rotation
                  }}
                  transition={{
                    duration: 2,
                    ease: 'linear'
                  }}
                  style={{
                    color: item.color
                  }}
                >
                  <Icon size={item.size || 48} strokeWidth={2.5} />
                </motion.div>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="loading-content-fireworks">
            {/* Multi-Language Name Display with Typewriter Effect */}
            <div className="loading-name-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLanguageIndex}
                  className="language-wrapper"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <h1 className="loading-name-multilang">
                    {displayedText}
                    <span 
                      className="loading-cursor" 
                      style={{ opacity: showCursor ? 1 : 0 }}
                    >
                      |
                    </span>
                  </h1>
                  <span className="language-label">
                    {languageVersions[currentLanguageIndex].language}
                  </span>
                </motion.div>
              </AnimatePresence>
              
              <motion.p
                className="loading-subtitle-fireworks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Building digital experiences
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
