import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LOGO_PATHS, LOGO_VIEWBOX } from '../logoPaths'
import { PROFILE } from '../data'
import { TRACK, toggleSound, useSound } from '../sound'

// Background music on / off: four bars that sway while it plays.
export function SoundToggle({ className = '', showState = true }) {
  const on = useSound()
  return (
    <button
      type="button"
      className={`snd ${on ? 'is-on' : ''} ${className}`}
      data-sound-toggle
      onClick={toggleSound}
      aria-pressed={on}
      title={`${TRACK.composer}, ${TRACK.title} (${TRACK.performer})`}
    >
      <span className="snd__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={showState ? 'snd__state' : 'snd__sr'}>
        <span className="snd__sr">Music </span>
        {on ? 'On' : 'Off'}
      </span>
    </button>
  )
}

export function Logo({ className, title = 'Harshil Barot' }) {
  return (
    <svg className={className} viewBox={LOGO_VIEWBOX} role="img" aria-label={title}>
      <path d={LOGO_PATHS.join(' ')} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

export function Arrow({ dir = 'up-right', className }) {
  const rot = { 'up-right': 0, right: 45, 'down-right': 90, down: 135, left: -135, up: -45 }[dir]
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: PROFILE.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const [h, m] = timeFmt.format(now).split(':')
  return (
    <time className="clock" dateTime={now.toISOString()}>
      {h}
      <span className="clock__colon" style={{ opacity: now.getSeconds() % 2 ? 0.35 : 1 }}>:</span>
      {m}
    </time>
  )
}

// Wraps each word in a clipping mask so it can slide up into view.
export function SplitWords({ text, className = '', wordClass = 'w' }) {
  // The space sits outside the inline-block mask, otherwise it collapses.
  return text.split(' ').map((word, i) => (
    <Fragment key={i}>
      <span className={`mask ${className}`}>
        <span className={wordClass}>{word}</span>
      </span>{' '}
    </Fragment>
  ))
}

// Label/value pair that reveals line by line (used in the header and footer).
export function MaskLine({ children, className = '' }) {
  return (
    <span className={`mask ${className}`}>
      <span className="mask__in">{children}</span>
    </span>
  )
}

// A nav link: a home page section ("#about") or a page ("/work"). On other
// pages (`base="/"`) section links route back to the home page and land there.
export function SectionLink({ base, href, ...rest }) {
  if (href.startsWith('/')) return <Link to={href} {...rest} />
  if (!base) return <a href={href} {...rest} />
  return <Link to={href === '#top' ? base : `${base}${href}`} {...rest} />
}
