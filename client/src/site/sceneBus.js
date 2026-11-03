// Per-frame state from the WebGL scene for DOM overlays (the fly-through HUD):
// { active: project in focus, hover: project card under the pointer (-1: none),
//   rect: where the card link sits on screen (the hovered card, else the card
//   in focus), or null }.
const listeners = new Set()

export const sceneBus = {
  emit(state) {
    for (const fn of listeners) fn(state)
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
