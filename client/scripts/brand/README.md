# Brand asset generators

The homepage's photo and logo are generated from source artwork by
these scripts. Run them again when the photo or logo changes.

```bash
python -m venv .venv && .venv/Scripts/activate      # macOS/Linux: source .venv/bin/activate
pip install "rembg[cpu]" pillow numpy scipy scikit-image potracer

# Photo -> public/portrait-particles.webp (the WebGL pixel portrait)
python scripts/brand/cutout.py path/to/photo.png public

# HB monogram PNG (white on black) -> src/site/logoPaths.js
# (header logo, plus the H / swash / B parts and brush strokes the loader writes)
python scripts/brand/trace_logo.py path/to/logo.png src/site/logoPaths.js

# Project screenshots (public/work/<slug>.webp) -> public/work/atlas.webp
# (the tiles the hero portrait breaks into; rerun after changing a screenshot)
python scripts/brand/work_atlas.py public/work
```

`trace_logo.py` also writes `logo_preview.svg` beside itself so the result can
be checked in a browser before reloading the site.

## Link-preview images

`og_cards.cjs` makes `public/og/*.jpg`, the 1200x630 pictures shown when a page
is shared: the real hero for the home page, a card for `/work` and one per
project. Run it after adding a project or changing a screenshot, with the built
site being served in another terminal:

```bash
npm run build && npx vite preview --port 4173
npm i --no-save puppeteer-core
CHROME="/path/to/chrome" node scripts/brand/og_cards.cjs
```

Case study galleries read `public/work/<slug>/d1.webp …` (desktop, 1600x1000)
and `m1.webp …` (phone, 540x1169); `shots` in `src/site/data.js` says how many
of each a project has.
