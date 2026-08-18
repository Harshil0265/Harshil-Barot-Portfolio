import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, PenTool, Clapperboard, Film, Wand2, Music2, Layers, Video, Scissors, Aperture, Brush, Camera } from 'lucide-react'

// Loading screen for the Creative Portfolio route. Same structure and
// motion language as the developer LoadingScreen, but re-themed blue and
// dropping design/video-editing tool icons instead of code symbols.
const CreativeLoadingScreen = ({ onLoadingComplete }) => {
  const [fallingItems, setFallingItems] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRefs = useRef([])

  // Design & video-editing platform/tool icons, sky-blue themed.
  const toolIcons = [
    { icon: Palette, color: '#0ea5e9' },
    { icon: PenTool, color: '#1a1a1a' },
    { icon: Clapperboard, color: '#0284c7' },
    { icon: Film, color: '#1a1a1a' },
    { icon: Wand2, color: '#0ea5e9' },
    { icon: Music2, color: '#1a1a1a' },
    { icon: Layers, color: '#0284c7' },
    { icon: Video, color: '#1a1a1a' }
  ]

  const allItems = [
    ...toolIcons,
    { icon: Scissors, color: '#1a1a1a', size: 30 },
    { icon: Aperture, color: '#0ea5e9', size: 36 },
    { icon: Brush, color: '#38bdf8', size: 28 },
    { icon: Camera, color: '#0284c7', size: 32 }
  ]

  // Cycle through the creative identity + core platforms/tools.
  const wordVersions = [
    { text: 'Harshil Barot', language: 'Creative Profile' },
    { text: 'Video Editing', language: 'Premiere Pro · CapCut' },
    { text: 'Graphic Design', language: 'Photoshop · Canva' },
    { text: 'AI Video Tools', language: 'Runway · Pika Labs' },
    { text: 'Content Creation', language: 'Reels · Shorts' }
  ]

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  // Typewriter effect for each word/tool label
  useEffect(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []

    const currentText = wordVersions[currentWordIndex].text
    setDisplayedText('')

    for (let i = 0; i <= currentText.length; i++) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, i))

        if (i === currentText.length) {
          const nextTimeout = setTimeout(() => {
            if (currentWordIndex < wordVersions.length - 1) {
              setCurrentWordIndex(prev => prev + 1)
            } else {
              const completeTimeout = setTimeout(() => {
                setIsComplete(true)
                const finalTimeout = setTimeout(() => {
                  onLoadingComplete()
                }, 400)
                timeoutRefs.current.push(finalTimeout)
              }, 600)
              timeoutRefs.current.push(completeTimeout)
            }
          }, 500)
          timeoutRefs.current.push(nextTimeout)
        }
      }, i * 50)

      timeoutRefs.current.push(timeout)
    }

    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      timeoutRefs.current = []
    }
  }, [currentWordIndex])

  useEffect(() => {
    const fallingInterval = setInterval(() => {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
      let randomX = Math.random() * 100
      if (randomX > 25 && randomX < 75) {
        randomX = randomX < 50 ? randomX - 30 : randomX + 30
      }
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
          className="cp-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="cp-loading-dotted-bg"></div>

          <div className="cp-loading-falling-container">
            {fallingItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.id}
                  className="cp-loading-falling-item"
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

          <div className="cp-loading-content">
            <div className="cp-loading-name-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWordIndex}
                  className="cp-language-wrapper"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <h1 className="cp-loading-name">
                    {displayedText}
                    <span
                      className="cp-loading-cursor"
                      style={{ opacity: showCursor ? 1 : 0 }}
                    >
                      |
                    </span>
                  </h1>
                  <span className="cp-loading-language-label">
                    {wordVersions[currentWordIndex].language}
                  </span>
                </motion.div>
              </AnimatePresence>

              <motion.p
                className="cp-loading-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Loading the creative side
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreativeLoadingScreen
