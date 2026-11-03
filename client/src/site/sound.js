import { useSyncExternalStore } from 'react'

// Background music: Chopin's Nocturne in E-flat major, Op. 9 No. 2, played by
// Frank Lévy for Musopen's "Set Chopin Free" project and released into the
// public domain. One player for the whole visit, so it carries on across pages.
//
// Browsers only allow sound once the visitor has interacted with the page, so
// it fades in on the first click, tap or key press, unless they switched it
// off on an earlier visit. It pauses while the tab is hidden.

export const TRACK = {
  title: 'Nocturne in E-flat major, Op. 9 No. 2',
  composer: 'Frédéric Chopin',
  performer: 'Frank Lévy',
  credit: 'Musopen, public domain',
}

// Opus where supported (Chrome, Firefox, Edge), AAC otherwise (Safari, iOS).
const SOURCES = [
  ['/audio/nocturne-op9-no2.webm', 'audio/webm; codecs="opus"'],
  ['/audio/nocturne-op9-no2.m4a', 'audio/mp4; codecs="mp4a.40.2"'],
]
const VOLUME = 0.5
const FADE_IN = 2.6
const FADE_OUT = 0.8
const PREF = 'hb-sound' // 'on' | 'off', the visitor's explicit choice
const GESTURES = ['pointerdown', 'click', 'touchend', 'keydown']

let audio = null
let ctx = null
let gain = null
let wanted = false // the visitor wants music
let audible = false // fading in or playing
let held = false // a page (the admin inbox) asked for silence
let armed = false
let stopTimer = 0
let rampToken = 0
const subs = new Set()

const emit = () => subs.forEach((fn) => fn())

function readPref() {
  try {
    return localStorage.getItem(PREF)
  } catch {
    return null
  }
}
function savePref(value) {
  try {
    localStorage.setItem(PREF, value)
  } catch {
    // Private mode or blocked storage: the choice lasts for this visit only.
  }
}

function ensureAudio() {
  if (audio) return audio
  audio = new Audio()
  const el = audio
  const [src] = SOURCES.find(([, type]) => el.canPlayType(type)) || SOURCES[SOURCES.length - 1]
  audio.src = src
  audio.loop = true
  audio.preload = 'auto'
  // Fades run through Web Audio: iOS ignores element.volume.
  const AC = window.AudioContext || window.webkitAudioContext
  if (AC) {
    try {
      ctx = new AC()
      gain = ctx.createGain()
      gain.gain.value = 0
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination)
    } catch {
      ctx = null
      gain = null
    }
  }
  if (!gain) audio.volume = 0
  setupMediaSession()
  return audio
}

function ramp(to, seconds) {
  if (gain) {
    const now = ctx.currentTime
    const g = gain.gain
    g.cancelScheduledValues(now)
    g.setValueAtTime(g.value, now)
    g.linearRampToValueAtTime(to, now + seconds)
    return
  }
  const token = ++rampToken
  const from = audio.volume
  const t0 = performance.now()
  const step = (t) => {
    if (token !== rampToken) return
    const k = Math.min(1, (t - t0) / (seconds * 1000))
    audio.volume = from + (to - from) * k
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// Resolves true once the browser actually lets it play.
function start() {
  const el = ensureAudio()
  clearTimeout(stopTimer)
  ctx?.resume?.().catch(() => {})
  audible = true
  ramp(VOLUME, FADE_IN)
  return Promise.resolve(el.play()).then(
    () => true,
    (err) => {
      // AbortError: a pause() overtook this play(); not a refusal.
      if (err?.name === 'AbortError') return true
      audible = false
      return false
    },
  )
}

function stop() {
  if (!audio || !audible) return
  audible = false
  ramp(0, FADE_OUT)
  clearTimeout(stopTimer)
  stopTimer = setTimeout(() => !audible && audio.pause(), FADE_OUT * 1000 + 60)
}

function onGesture(e) {
  // The sound button handles its own click; shortcuts (Ctrl + Shift + A) and
  // Escape are not an invitation to play music.
  if (e.target?.closest?.('[data-sound-toggle]')) return
  if (e.type === 'keydown' && (e.ctrlKey || e.metaKey || e.altKey || e.key === 'Escape' || e.key === 'Tab')) return
  if (held || wanted) return disarm()
  start().then((ok) => {
    if (!ok || held) return
    wanted = true
    disarm()
    emit()
  })
}

function disarm() {
  if (!armed) return
  armed = false
  GESTURES.forEach((type) => window.removeEventListener(type, onGesture, true))
}

// Called by the header: waits for the first interaction, unless the visitor
// turned the music off before.
export function armAutoStart() {
  if (armed || wanted || held || readPref() === 'off') return
  armed = true
  GESTURES.forEach((type) => window.addEventListener(type, onGesture, { capture: true, passive: true }))
}

export function setSound(on) {
  savePref(on ? 'on' : 'off')
  disarm()
  wanted = on
  emit()
  if (!on) return stop()
  if (held) return
  start().then((ok) => {
    if (ok) return
    wanted = false
    emit()
  })
}

export const toggleSound = () => setSound(!wanted)

// Silence for a page (the admin inbox), without changing the visitor's choice.
export function holdSound(on) {
  held = on
  if (on) {
    disarm()
    stop()
  } else if (wanted && !document.hidden) {
    start()
  }
}

function setupMediaSession() {
  if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return
  navigator.mediaSession.metadata = new MediaMetadata({
    title: TRACK.title,
    artist: `${TRACK.composer} · ${TRACK.performer}`,
    album: 'Harshil Barot',
    artwork: [{ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  })
  try {
    navigator.mediaSession.setActionHandler('play', () => setSound(true))
    navigator.mediaSession.setActionHandler('pause', () => setSound(false))
  } catch {
    // Older browsers without action handlers.
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!wanted || held) return
    if (document.hidden) stop()
    else start()
  })
}

const subscribe = (fn) => {
  subs.add(fn)
  return () => subs.delete(fn)
}

// true while the visitor has the music on.
export function useSound() {
  return useSyncExternalStore(subscribe, () => wanted, () => false)
}
