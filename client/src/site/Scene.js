// WebGL scene behind the hero and the work fly-through.
//
// Every pixel of the portrait is a tile cut from a project screenshot (an
// atlas). After the loader the tiles fly in from every side of the screen and
// come together as the face, tinted squares at rest; scrolling breaks it
// apart, the tiles turn into little rounded work cards and the camera flies
// through them past six large project cards.
//
// Layers, back to front: stars, an invisible silhouette that keeps the stars
// from showing through the face, then tiles + project cards (depth-tested).

import { sceneBus } from './sceneBus'

const COMMON = `
precision highp float;
const float CAM = 2.4;
const float NEAR = 1.95;
uniform vec2 uTilt;
uniform vec2 uCenter;
uniform vec2 uRes;
uniform float uScale;

vec3 tilt(vec3 p) {
  float cy = cos(uTilt.x), sy = sin(uTilt.x);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  float cx = cos(uTilt.y), sx = sin(uTilt.y);
  return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
}

// Perspective projection; returns clip position, w (scale factor) in .w slot.
vec4 project(vec3 p, out float w) {
  w = CAM / max(CAM - p.z, 0.05);
  vec2 sp = uCenter + vec2(p.x, -p.y) * uScale * w;
  vec2 clip = sp / uRes * 2.0 - 1.0;
  return vec4(clip.x, -clip.y, clamp((CAM - p.z) / 24.0, 0.0, 1.0) * 2.0 - 1.0, 1.0);
}
`

const TILE_VERT = `${COMMON}
attribute vec3 aPos;
attribute vec3 aColor;
attribute vec4 aRand;
attribute vec4 aSwarm;
attribute float aTile;
uniform float uTime;
uniform float uIntro;
uniform float uScatter;
uniform float uTravel;
uniform float uRange;
uniform float uSwarmFrac;
uniform float uCell;
uniform float uTileW;
uniform float uMaxPoint;
uniform float uFadePx;
uniform float uPortraitY;
uniform float uOccluder;
uniform float uStream;     // 1: the pass drawing pixels that keep flying in to join the face
uniform float uStreamFrac; // share of cells that take part in the stream
uniform vec2 uGrid;
varying vec3 vColor;
varying float vAlpha;
varying float vShape;
varying float vMix;
varying float vShade;
varying vec2 vTile;

void main() {
  vec3 home = vec3(aPos.xy + vec2(0.0, uPortraitY), aPos.z);
  vTile = vec2(mod(aTile, uGrid.x), floor(aTile / uGrid.x));
  float flick = 0.84 + 0.16 * sin(uTime * (1.4 + aRand.y * 4.0) + aRand.z * 40.0);
  float w;

  if (uStream > 0.5) {
    // Once the face has formed, a few pixels at a time keep arriving from
    // around it and dock on their own cell, so the portrait feels alive while
    // the face itself never moves.
    float on = step(fract(aRand.y * 7.31 + aRand.w * 3.71), uStreamFrac);
    float c = fract(uTime / (4.0 + aRand.w * 4.0) + aRand.z * 9.17);
    float k = clamp(c / 0.62, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    float ang = aRand.x * 6.2831 + aRand.w * 3.0;
    vec2 dir = vec2(cos(ang), sin(ang));
    vec3 from = vec3(home.xy + dir * (0.35 + aRand.z * 0.75), home.z + 0.35 + aRand.y * 0.7);
    vec3 p = tilt(mix(from, home, k));
    gl_Position = project(p, w);
    gl_PointSize = uCell * 0.82 * w * on;
    vColor = aColor * flick * (1.0 + (1.0 - k) * 0.8);
    vShape = 0.0;
    vMix = 1.0;
    vShade = 1.0;
    float ready = smoothstep(0.95, 1.0, uIntro) * (1.0 - smoothstep(0.0, 0.12, uScatter));
    vAlpha = on * ready * smoothstep(0.0, 0.14, c) * (1.0 - smoothstep(0.6, 0.78, c));
    return;
  }

  // Assemble: every pixel starts outside the frame, on all sides, and curls
  // in to its place in the face, staggered - then holds perfectly still.
  float t = clamp(uIntro * 1.6 - aRand.x * 0.6, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 3.0);
  float ang = aRand.y * 6.2831 + aRand.w * 1.7;
  vec2 from = vec2(cos(ang) * 1.9, sin(ang) * 1.25) * (1.0 + aRand.z * 0.8);
  float curl = (1.0 - e) * (aRand.w - 0.5) * 2.2;
  vec2 off = mat2(cos(curl), sin(curl), -sin(curl), cos(curl)) * from * (1.0 - e);
  vec3 p = vec3(home.xy + off, home.z + (1.0 - e) * (aRand.z - 0.35) * 1.4);

  // Break-up: each tile leaves on its own beat.
  float s = clamp((uScatter - aRand.x * 0.35) / 0.65, 0.0, 1.0);
  s = s * s * (3.0 - 2.0 * s);
  float swarm = step(aRand.y, uSwarmFrac);
  // Swarm tiles hang in a deep cloud the camera travels through (wrapping).
  float zr = NEAR - fract(aSwarm.z - uTravel / uRange) * uRange;
  vec3 cloud = vec3(aSwarm.xy, zr);
  // The rest burst outward as plain pixels and fade away.
  vec3 burst = vec3(home.xy * 1.5 + (aRand.yz - 0.5) * 1.2, home.z + 0.5 + aRand.w * 0.9);
  p = mix(p, mix(burst, cloud, swarm), s);
  p.z += sin(s * 3.14159) * (0.15 + aRand.w * 0.35) * swarm;

  p = tilt(p);
  gl_Position = project(p, w);

  float cellPx = uCell * mix(0.82, 1.2, uOccluder);
  float tilePx = uTileW * uScale * aSwarm.w;
  float size = mix(cellPx, tilePx, s * swarm) * w;
  gl_PointSize = min(size, uMaxPoint);

  // Brightness-only life: flicker, the odd spark and a slow scanline.
  float spark = step(0.9965, fract(sin(floor(uTime * 6.0) * 12.9898 + aRand.x * 78.233) * 43758.5453));
  float scanY = 0.62 - mod(uTime * 0.16, 2.4);
  float scan = smoothstep(0.03, 0.0, abs(aPos.y - scanY));
  // Pixels still in flight glow a little brighter.
  vColor = (aColor * (flick + scan * 0.9) + spark * 0.75) * (1.0 + (1.0 - e) * 0.5);
  vMix = 1.0 - s * swarm;
  // Thumbnails deep in the cloud sit back in the dark; near ones are bright.
  vShade = mix(1.0, mix(0.3, 1.0, smoothstep(NEAR - uRange, 0.4, zr)), s * swarm);
  vShape = s * swarm;

  float a = smoothstep(0.0, 0.25, t);
  a *= smoothstep(NEAR - 0.02, NEAR - 0.55, p.z);
  a *= mix(1.0, smoothstep(NEAR - uRange, NEAR - uRange + 2.5, zr), s * swarm);
  a *= 1.0 - smoothstep(0.45, 0.95, s) * (1.0 - swarm);
  a *= 1.0 - smoothstep(uFadePx * 0.6, uFadePx, size);
  vAlpha = mix(a, smoothstep(0.85, 1.0, e) * (1.0 - smoothstep(0.0, 0.22, uScatter)), uOccluder);
}`

const TILE_FRAG = `
precision highp float;
uniform sampler2D uAtlas;
uniform float uPass; // 0: opaque fragments (depth-writing), 1: fading ones
uniform float uStream;
uniform vec2 uAtlasCell;
uniform vec2 uTileInset;
uniform vec2 uTileUV;
uniform float uOccluder;
uniform vec3 uBg;
varying vec3 vColor;
varying float vAlpha;
varying float vShape;
varying float vMix;
varying float vShade;
varying vec2 vTile;

void main() {
  if (uOccluder > 0.5) {
    gl_FragColor = vec4(uBg * vAlpha, vAlpha);
    return;
  }
  if (vAlpha < 0.004) discard;
  if (uStream < 0.5 && (uPass < 0.5) != (vAlpha > 0.995)) discard;
  // Square pixel -> 16:10 rounded card as the tile breaks free.
  vec2 pc = gl_PointCoord - 0.5;
  float halfH = mix(0.5, 0.3125, vShape);
  float r = 0.06 * vShape;
  vec2 q = abs(pc) - vec2(0.5 - r, halfH - r);
  if (length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r > 0.0) discard;
  vec2 local = vec2(gl_PointCoord.x, (gl_PointCoord.y - (0.5 - halfH)) / (2.0 * halfH));
  vec3 tex = texture2D(uAtlas, vTile * uAtlasCell + uTileInset + local * uTileUV).rgb;
  // In the face, the portrait sets the tone and the tile tints it.
  vec3 face = vColor * mix(vec3(1.0), tex * 1.3, 0.45);
  gl_FragColor = vec4(mix(tex * vShade, face, vMix) * vAlpha, vAlpha);
}`

const CARD_VERT = `${COMMON}
attribute vec2 aCorner;
uniform vec3 uCardPos;
uniform vec2 uCardSize;
varying vec2 vUV;
varying vec2 vPx;

void main() {
  vec3 p = tilt(uCardPos + vec3(aCorner * uCardSize, 0.0));
  float w;
  gl_Position = project(p, w);
  vUV = vec2(aCorner.x + 0.5, 0.5 - aCorner.y);
  vPx = uCardSize * uScale * w;
}`

const CARD_FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uAlpha;
uniform float uHover; // 0..1 while the pointer is over the card
varying vec2 vUV;
varying vec2 vPx;

void main() {
  vec2 local = (vUV - 0.5) * vPx;
  float r = min(vPx.x, vPx.y) * 0.035;
  vec2 q = abs(local) - (vPx * 0.5 - r);
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  if (sd > 0.0) discard;
  // Hairline edge so dark screenshots still read as cards; under the pointer
  // it becomes a clear white outline.
  vec3 col = texture2D(uTex, vUV).rgb;
  float edge = 1.0 - smoothstep(0.0, mix(1.5, 3.0, uHover), -sd);
  col = mix(col, vec3(1.0), edge * mix(0.22, 0.95, uHover));
  gl_FragColor = vec4(col * uAlpha, uAlpha);
}`

const STAR_VERT = `${COMMON}
attribute vec3 aStar;
attribute float aSeed;
uniform float uTime;
uniform float uTravel;
uniform float uPx;
uniform float uFade;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float z = fract(aStar.z + uTravel * 0.06);
  vec3 p = vec3(aStar.xy * 2.6, mix(-14.0, NEAR, z));
  float w;
  gl_Position = project(tilt(p), w);
  gl_PointSize = (0.9 + aSeed * 1.6) * uPx * min(w, 4.0) * 0.7;
  float tw = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed * 2.0) + aSeed * 50.0);
  vAlpha = smoothstep(0.0, 0.3, z) * (1.0 - smoothstep(0.85, 1.0, z)) * (0.18 + aSeed * 0.55) * tw * uFade;
  vColor = mix(vec3(1.0), vec3(0.55, 0.75, 1.0), step(0.86, aSeed));
}`

const STAR_FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() { gl_FragColor = vec4(vColor * vAlpha, 1.0); }`

// Atlas layout written by scripts/brand/work_atlas.py.
const ATLAS = { size: 2048, cols: 8, rows: 12, cellW: 256, cellH: 160, tileW: 240, tileH: 150 }
const TILE_COUNT = ATLAS.cols * ATLAS.rows

// Project cards: spacing along the flight path and where each one sits.
const CARD_SPACING = 4.2
// The flight runs on a little past the last card.
const FLIGHT_TAIL = 0.55
// Where card i comes into focus, as a share of the fly-through's scroll.
export const cardProgress = (i, count) => i / (count - 1 + FLIGHT_TAIL)
const CARD_OFFSETS = [
  [-0.16, 0.04],
  [0.18, -0.03],
  [-0.2, 0.05],
  [0.17, -0.04],
  [-0.18, 0.03],
  [0.15, -0.02],
]
const BG = [10 / 255, 10 / 255, 10 / 255]
// Share of portrait cells that keep flying in to join the finished face.
const STREAM_SHARE = 0.03

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh))
  return sh
}

function program(gl, vert, frag) {
  const p = gl.createProgram()
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vert))
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  const u = {}
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < n; i++) {
    const { name } = gl.getActiveUniform(p, i)
    u[name] = gl.getUniformLocation(p, name)
  }
  const a = {}
  const na = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES)
  for (let i = 0; i < na; i++) {
    const { name } = gl.getActiveAttrib(p, i)
    a[name] = gl.getAttribLocation(p, name)
  }
  return { p, u, a }
}

function buffer(gl, data) {
  const b = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, b)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  return b
}

// Uploads an image as a mipmapped power-of-two texture (stretched to fit).
function texture(gl, img, size) {
  let src = img
  if (size) {
    const c = document.createElement('canvas')
    c.width = c.height = size
    c.getContext('2d').drawImage(img, 0, 0, size, size)
    src = c
  }
  const t = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return t
}

// Deterministic PRNG so the portrait looks identical on every visit.
function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Digital accent colours sprinkled through the portrait.
const ACCENTS = [
  [0.36, 0.86, 1.0],
  [1.0, 0.42, 0.86],
  [0.55, 1.0, 0.55],
  [0.42, 0.5, 1.0],
  [1.0, 0.82, 0.4],
]

// Samples the cut-out photo into tiles (visible) and a full-density
// silhouette (occluder) in portrait space: height 1, centred, y up.
function samplePortrait(img, rows) {
  const cols = Math.round((rows * img.naturalWidth) / img.naturalHeight)
  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, cols, rows)
  const px = ctx.getImageData(0, 0, cols, rows).data
  const alphaAt = (x, y) => (x < 0 || y < 0 || x >= cols || y >= rows ? 0 : px[(y * cols + x) * 4 + 3] / 255)

  const rand = mulberry32(1987)
  const aspect = cols / rows
  const make = () => ({ pos: [], col: [], rnd: [], swarm: [], tile: [] })
  const tiles = make()
  const occ = make()

  const push = (set, x, y, z, rgb) => {
    set.pos.push((x / cols - 0.5) * aspect, 0.5 - y / rows, z)
    set.col.push(rgb[0], rgb[1], rgb[2])
    set.rnd.push(rand(), rand(), rand(), rand())
    // Swarm slot in the cloud, with a clear tube around the flight path so
    // tiles don't sit on the focused card.
    const r = 0.3 + Math.pow(rand(), 0.7) * 1.0
    const th = rand() * Math.PI * 2
    // Mostly small thumbnails, with the odd larger card among them.
    set.swarm.push(Math.cos(th) * r * 1.45, Math.sin(th) * r * 0.8, rand(), 0.6 + Math.pow(rand(), 3) * 2.4)
    set.tile.push(Math.floor(rand() * TILE_COUNT))
  }

  for (let y = 0; y < rows; y++) {
    const bottomFade = 1 - clamp01((y / rows - 0.72) / 0.28) * 0.75
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      const a = px[i + 3] / 255
      const r = px[i] / 255
      const g = px[i + 1] / 255
      const b = px[i + 2] / 255
      const nx = x / cols - 0.5

      if (a < 0.5) {
        // Sparse halo of stray pixels around the silhouette.
        let near = 0
        for (let k = 2; k <= 6; k += 2) {
          near = Math.max(near, alphaAt(x + k, y), alphaAt(x - k, y), alphaAt(x, y + k), alphaAt(x, y - k))
        }
        if (near > 0.5 && rand() < 0.07) {
          const acc = ACCENTS[(rand() * ACCENTS.length) | 0]
          const v = 0.12 + rand() * 0.25
          push(tiles, x, y, (rand() - 0.5) * 0.2, rand() < 0.5 ? acc.map((c) => c * v) : [v, v, v])
        } else if (rand() < 0.004) {
          const v = 0.08 + rand() * 0.12
          push(tiles, x, y, (rand() - 0.5) * 0.4, [v, v, v])
        }
        continue
      }

      const dome = 0.06 * (1 - Math.min(1, Math.abs(nx) * 2.2))
      push(occ, x, y, dome, BG)

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
      // Contrast curve: crush the darkest tones, open up the skin highlights.
      let L = Math.pow(clamp01((lum - 0.06) * 1.45), 0.85)
      const max = Math.max(r, g, b)
      const sat = max > 0 ? (max - Math.min(r, g, b)) / max : 0
      const edge = Math.min(alphaAt(x + 1, y), alphaAt(x - 1, y), alphaAt(x, y + 1), alphaAt(x, y - 1)) < 0.5

      // Dark suit and hair: a dim, sparse speckle instead of a solid block.
      if (L < 0.14) {
        if (rand() > 0.62) continue
        L = 0.07 + rand() * 0.1
      }
      if (edge) L = Math.min(1, L + 0.22)
      L *= bottomFade

      let rgb
      if (sat > 0.72 && r > 0.62 && g < 0.24 && b < 0.28 && r > g * 2.8) {
        // Only vivid pure red (the tilak) stays in colour.
        rgb = [Math.min(1, r * 1.3), g * 0.4, b * 0.45]
      } else if (rand() < 0.085 * (0.3 + L)) {
        const acc = ACCENTS[(rand() * ACCENTS.length) | 0]
        const v = 0.3 + L * 0.85
        rgb = acc.map((c) => c * v)
      } else {
        rgb = [lerp(L, r * 1.2, 0.16), lerp(L, g * 1.2, 0.16), lerp(L, b * 1.2, 0.16)]
      }
      push(tiles, x, y, L * 0.1 + dome, rgb)
    }
  }

  const pack = (set) => ({
    count: set.tile.length,
    aPos: new Float32Array(set.pos),
    aColor: new Float32Array(set.col),
    aRand: new Float32Array(set.rnd),
    aSwarm: new Float32Array(set.swarm),
    aTile: new Float32Array(set.tile),
  })
  return { tiles: pack(tiles), occluder: pack(occ) }
}

const SIZES = { aPos: 3, aColor: 3, aRand: 4, aSwarm: 4, aTile: 1, aStar: 3, aSeed: 1, aCorner: 2 }

export class Scene {
  constructor(canvas, { portrait, atlas, cardCount }) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, depth: true })
    if (!gl) throw new Error('WebGL unavailable')
    this.gl = gl
    this.canvas = canvas
    this.portraitImg = portrait
    this.tileProg = program(gl, TILE_VERT, TILE_FRAG)
    this.cardProg = program(gl, CARD_VERT, CARD_FRAG)
    this.starProg = program(gl, STAR_VERT, STAR_FRAG)
    this.maxPoint = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1] || 256
    this.atlas = texture(gl, atlas)
    this.cardTex = new Array(cardCount).fill(null)
    this.cardCount = cardCount
    // Hover: the card under the pointer (-1: none) and each card's eased outline.
    this.hover = -1
    this.hoverAmt = new Float32Array(cardCount)
    this.pointer = null
    this.touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    this.stream = true
    this.cardQuad = { aCorner: buffer(gl, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5])) }

    this.state = {
      intro: 0,
      scatter: 0,
      hero: 0,
      work: 0,
      travel: -CARD_SPACING * 0.85,
      tilt: [0, 0],
      tiltTarget: [0, 0],
      // Tilt actually applied: none while the face is intact, so it stays put.
      view: [0, 0],
      velocity: 0,
      starTravel: 0,
      // Sideways shift of the whole view (px) while the box is open on the left.
      shift: 0,
      visible: true,
      active: -1,
    }
    this.start = performance.now()
    this.last = this.start

    this.buildStars()
    this.resize()
    this.loop = this.loop.bind(this)
    this.raf = requestAnimationFrame(this.loop)
  }

  setCardImage(i, img) {
    this.cardTex[i] = texture(this.gl, img, 1024)
  }

  buildStars() {
    const n = 900
    const rand = mulberry32(42)
    const star = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      star[i * 3] = (rand() - 0.5) * 3.2
      star[i * 3 + 1] = (rand() - 0.5) * 2.0
      star[i * 3 + 2] = rand()
      seed[i] = rand()
    }
    this.stars = { count: n, aStar: buffer(this.gl, star), aSeed: buffer(this.gl, seed) }
  }

  buildPortrait(rows) {
    const gl = this.gl
    const { tiles, occluder } = samplePortrait(this.portraitImg, rows)
    const upload = (set) => {
      const out = { count: set.count }
      for (const k of ['aPos', 'aColor', 'aRand', 'aSwarm', 'aTile']) out[k] = buffer(gl, set[k])
      return out
    }
    ;[this.tiles, this.occluder].forEach((set) => set && Object.values(set).forEach((b) => b instanceof WebGLBuffer && gl.deleteBuffer(b)))
    this.tiles = upload(tiles)
    this.occluder = upload(occluder)
    this.rows = rows
    this.aspect = this.portraitImg.naturalWidth / this.portraitImg.naturalHeight
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const vw = window.innerWidth
    const vh = window.innerHeight
    const mobile = vw < 760
    this.dpr = dpr
    this.canvas.width = Math.round(vw * dpr)
    this.canvas.height = Math.round(vh * dpr)

    const rows = mobile ? 118 : 150
    if (rows !== this.rows) this.buildPortrait(rows)

    // One world unit = the portrait's display height in px.
    const dispH = mobile ? Math.min(vh * 0.6, (vw * 1.08) / this.aspect) : vh * 0.9
    const portraitCy = mobile ? vh * 0.44 : vh - dispH * 0.5 + vh * 0.035
    // Project cards stay modest in focus (about a sixth of the screen) and
    // only grow large as they fly past.
    const cardPx = mobile ? vw * 0.52 : Math.min(vw * 0.18, 380)
    this.layout = {
      vw,
      vh,
      dispH,
      cx: vw / 2,
      cy: vh / 2,
      portraitY: (vh / 2 - portraitCy) / dispH,
      cardW: cardPx / dispH,
      tileW: mobile ? 0.03 : 0.022,
      offsetScale: mobile ? 0.25 : 1,
      // A sparse cloud: lots of dark space around the cards.
      swarmCount: mobile ? 200 : 340,
    }
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  // `delay` lets the loader's curtain clear before the pixels fly in.
  play(duration = 3.6, delay = 0) {
    this.introStart = performance.now() + delay * 1000
    this.introDuration = duration * 1000
  }

  // Reduced motion: show the finished face, without the joining stream.
  skipIntro() {
    this.introStart = performance.now() - 1e6
    this.introDuration = 1
    this.stream = false
  }

  // The pointer only steers the camera in the fly-through; the face ignores it.
  setPointer(clientX, clientY) {
    this.pointer = { x: clientX, y: clientY }
    this.state.tiltTarget = [((clientX / window.innerWidth) * 2 - 1) * 0.16, ((clientY / window.innerHeight) * 2 - 1) * 0.1]
  }

  clearPointer() {
    this.pointer = null
    this.state.tiltTarget = [0, 0]
  }

  // Hero scroll (0..1): the face breaks apart and the first card approaches.
  setHero(p) {
    this.state.hero = p
  }

  // Fly-through scroll (0..1) across the six cards.
  setWork(p) {
    this.state.work = p
  }

  setVelocity(v) {
    this.state.velocity = v
  }

  // With the box open on the left, the portrait and cards move right to sit
  // centred in the space beside it (the box: clamp(460px, 42vw, 780px) wide,
  // one gutter in; see .box in site.css). Phones show the box full width.
  setBoxed(on) {
    this.boxed = on
  }

  boxShift() {
    const { vw } = this.layout
    if (!this.boxed || vw <= 760) return 0
    const box = Math.min(780, Math.max(460, vw * 0.42))
    const gutter = Math.min(36, Math.max(16, vw * 0.019))
    return (box + gutter) / 2
  }

  setVisible(v) {
    this.state.visible = v
    if (v && !this.raf) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.loop)
    }
  }

  travelTarget() {
    const { hero, work } = this.state
    const span = (this.cardCount - 1 + FLIGHT_TAIL) * CARD_SPACING
    return work > 0 ? work * span : -CARD_SPACING * 0.85 * (1 - hero)
  }

  loop(now) {
    const s = this.state
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    if (!s.visible || document.hidden) {
      this.raf = 0
      this.hover = -1
      sceneBus.emit({ active: this.activeIndex(), hover: -1, rect: null })
      return
    }
    if (this.introStart != null) s.intro = clamp01((now - this.introStart) / this.introDuration)

    const k = 1 - Math.pow(0.0015, dt)
    s.tilt[0] = lerp(s.tilt[0], s.tiltTarget[0], k * 0.5)
    s.tilt[1] = lerp(s.tilt[1], s.tiltTarget[1], k * 0.5)
    const h = s.hero
    s.scatter = lerp(s.scatter, h * h * (3 - 2 * h), k * 0.9)
    const free = smooth(0.4, 1, s.scatter)
    s.view = [s.tilt[0] * free, s.tilt[1] * free]
    s.travel = lerp(s.travel, this.travelTarget(), k * 0.75)
    s.starTravel += dt * (0.2 + Math.min(Math.abs(s.velocity), 80) * 0.05)
    s.velocity *= 0.92
    s.shift = lerp(s.shift, this.boxShift(), k * 0.55)

    this.render((now - this.start) / 1000)
    this.emit()
    this.raf = requestAnimationFrame(this.loop)
  }

  cardPos(i) {
    const { cardW } = this.layout
    const [ox, oy] = CARD_OFFSETS[i % CARD_OFFSETS.length]
    const k = this.layout.offsetScale
    return [ox * k, oy * k, this.state.travel - i * CARD_SPACING, cardW, cardW * 0.625]
  }

  cardAlpha(z) {
    return smooth(-10, -6.5, z) * (1 - smooth(0.9, 1.6, z)) * smooth(0.25, 0.75, this.state.scatter)
  }

  activeIndex() {
    return Math.max(0, Math.min(this.cardCount - 1, Math.round(this.state.travel / CARD_SPACING)))
  }

  // Card i on screen (px), with the same tilt + projection as the vertex
  // shader applied to its centre.
  screenRect(i) {
    const s = this.state
    const [x0, y0, z0, w, h] = this.cardPos(i)
    const [ty, tx] = s.view
    let x = x0 * Math.cos(ty) + z0 * Math.sin(ty)
    let z = -x0 * Math.sin(ty) + z0 * Math.cos(ty)
    const y = y0 * Math.cos(tx) - z * Math.sin(tx)
    z = y0 * Math.sin(tx) + z * Math.cos(tx)
    const { dispH, cy } = this.layout
    const cx = this.layout.cx + s.shift
    const k = 2.4 / (2.4 - z)
    const sw = w * dispH * k
    const sh = h * dispH * k
    return { i, z: z0, x: cx + x * dispH * k - sw / 2, y: cy - y * dispH * k - sh / 2, w: sw, h: sh }
  }

  // Tell the DOM which card is in focus, which one is under the pointer (any
  // card in view, near or further back) and where the link should sit: over
  // the hovered card, otherwise over the card in focus.
  emit() {
    const s = this.state
    const active = this.activeIndex()
    const cards = []
    if (s.scatter > 0.85) {
      for (let i = 0; i < this.cardCount; i++) {
        const [, , z] = this.cardPos(i)
        if (this.cardTex[i] && this.cardAlpha(z) > 0.5) cards.push(this.screenRect(i))
      }
      cards.sort((a, b) => b.z - a.z) // nearest first: it covers the ones behind
    }
    const p = this.pointer
    const over = p && !this.touch ? cards.find((r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) : null
    this.hover = over ? over.i : -1
    const focus = cards.find((r) => r.i === active && Math.abs(r.z) < CARD_SPACING * 0.42)
    sceneBus.emit({ active, hover: this.hover, rect: over || focus || null })
  }

  render(time) {
    const gl = this.gl
    const s = this.state
    const L = this.layout
    const dpr = this.dpr
    gl.clearColor(0, 0, 0, 0)
    gl.clearDepth(1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const common = (prog) => {
      gl.useProgram(prog.p)
      gl.uniform2f(prog.u.uTilt, s.view[0], s.view[1])
      gl.uniform2f(prog.u.uCenter, (L.cx + s.shift) * dpr, L.cy * dpr)
      gl.uniform2f(prog.u.uRes, this.canvas.width, this.canvas.height)
      gl.uniform1f(prog.u.uScale, L.dispH * dpr)
    }

    // Stars: additive, behind everything.
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    const st = this.starProg
    common(st)
    gl.uniform1f(st.u.uTime, time)
    gl.uniform1f(st.u.uTravel, s.starTravel)
    gl.uniform1f(st.u.uPx, dpr)
    gl.uniform1f(st.u.uFade, Math.min(1, s.intro * 2))
    this.draw(st, this.stars, gl.POINTS, this.stars.count)

    // Tiles share most uniforms with the occluder pass.
    const tp = this.tileProg
    common(tp)
    gl.uniform1f(tp.u.uTime, time)
    gl.uniform1f(tp.u.uStream, 0)
    gl.uniform1f(tp.u.uIntro, s.intro)
    gl.uniform1f(tp.u.uScatter, s.scatter)
    gl.uniform1f(tp.u.uTravel, s.travel)
    gl.uniform1f(tp.u.uRange, 11)
    gl.uniform1f(tp.u.uCell, (L.dispH / this.rows) * dpr)
    gl.uniform1f(tp.u.uTileW, L.tileW)
    gl.uniform1f(tp.u.uMaxPoint, this.maxPoint)
    gl.uniform1f(tp.u.uFadePx, 240 * dpr)
    gl.uniform1f(tp.u.uSwarmFrac, Math.min(1, L.swarmCount / this.tiles.count))
    gl.uniform1f(tp.u.uPortraitY, L.portraitY)
    gl.uniform2f(tp.u.uGrid, ATLAS.cols, ATLAS.rows)
    gl.uniform2f(tp.u.uAtlasCell, ATLAS.cellW / ATLAS.size, ATLAS.cellH / ATLAS.size)
    gl.uniform2f(tp.u.uTileInset, (ATLAS.cellW - ATLAS.tileW) / 2 / ATLAS.size, (ATLAS.cellH - ATLAS.tileH) / 2 / ATLAS.size)
    gl.uniform2f(tp.u.uTileUV, ATLAS.tileW / ATLAS.size, ATLAS.tileH / ATLAS.size)
    gl.uniform3f(tp.u.uBg, BG[0], BG[1], BG[2])
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.atlas)
    gl.uniform1i(tp.u.uAtlas, 0)

    // Occluder: the head's silhouette in the page colour, so the stars behind
    // don't show through the gaps in the face.
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    if (s.scatter < 0.25) {
      gl.uniform1f(tp.u.uOccluder, 1)
      this.draw(tp, this.occluder, gl.POINTS, this.occluder.count)
    }
    gl.uniform1f(tp.u.uOccluder, 0)

    // Opaque tiles and cards write depth; fading ones blend on top afterwards.
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)
    gl.depthMask(true)
    gl.uniform1f(tp.u.uPass, 0)
    this.draw(tp, this.tiles, gl.POINTS, this.tiles.count)

    const cp = this.cardProg
    common(cp)
    gl.uniform1i(cp.u.uTex, 0)
    const cards = []
    for (let i = 0; i < this.cardCount; i++) {
      const [x, y, z, w, h] = this.cardPos(i)
      const a = this.cardAlpha(z)
      if (this.cardTex[i] && a > 0.001) cards.push({ i, x, y, z, w, h, a })
    }
    const drawCard = (c) => {
      this.hoverAmt[c.i] = lerp(this.hoverAmt[c.i], c.i === this.hover ? 1 : 0, 0.18)
      gl.uniform1f(cp.u.uHover, this.hoverAmt[c.i])
      gl.bindTexture(gl.TEXTURE_2D, this.cardTex[c.i])
      gl.uniform3f(cp.u.uCardPos, c.x, c.y, c.z)
      gl.uniform2f(cp.u.uCardSize, c.w, c.h)
      gl.uniform1f(cp.u.uAlpha, c.a)
      this.draw(cp, this.cardQuad, gl.TRIANGLE_STRIP, 4)
    }
    cards.filter((c) => c.a >= 0.995).forEach(drawCard)
    gl.depthMask(false)
    cards.filter((c) => c.a < 0.995).sort((a, b) => a.z - b.z).forEach(drawCard)

    gl.useProgram(tp.p)
    gl.bindTexture(gl.TEXTURE_2D, this.atlas)
    gl.uniform1f(tp.u.uPass, 1)
    this.draw(tp, this.tiles, gl.POINTS, this.tiles.count)

    // Pixels that keep arriving to join the finished face.
    if (this.stream && s.intro > 0.95 && s.scatter < 0.12) {
      gl.uniform1f(tp.u.uStream, 1)
      gl.uniform1f(tp.u.uStreamFrac, STREAM_SHARE)
      this.draw(tp, this.tiles, gl.POINTS, this.tiles.count)
      gl.uniform1f(tp.u.uStream, 0)
    }
    gl.depthMask(true)
  }

  draw(prog, buffers, mode, count) {
    const gl = this.gl
    const used = []
    for (const [name, loc] of Object.entries(prog.a)) {
      const buf = buffers[name]
      if (!buf) continue
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, SIZES[name], gl.FLOAT, false, 0, 0)
      used.push(loc)
    }
    gl.drawArrays(mode, 0, count)
    used.forEach((loc) => gl.disableVertexAttribArray(loc))
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    const ext = this.gl.getExtension('WEBGL_lose_context')
    if (ext) ext.loseContext()
  }
}
