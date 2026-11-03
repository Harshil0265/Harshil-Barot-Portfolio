"""Pack tiles cut from the project screenshots into one texture atlas.

Every pixel of the hero portrait is drawn as one of these tiles, so when the
portrait breaks apart on scroll its pixels turn out to be pieces of the work.

Usage: python work_atlas.py <public/work dir>
Reads <slug>.webp (1600x1000) for each project and writes atlas.webp:
2048x2048, 8 x 12 cells of 256x160, each holding a 240x150 tile whose edge
pixels are smeared into the gutter so mipmaps don't bleed between tiles.
"""
import random
import sys
from pathlib import Path

from PIL import Image

SLUGS = ["an-uniforms", "ripper", "pax-immigration", "chaibugs", "shabdsetu", "akshar-nirmaan"]
CELL_W, CELL_H = 256, 160
TILE_W, TILE_H = 240, 150
COLS, ROWS = 8, 12
PER_PROJECT = COLS * ROWS // len(SLUGS)  # 16

work = Path(sys.argv[1])
rng = random.Random(7)


def crops(w, h):
    """Full frame, a 3x3 grid at 1.6x zoom, then six tighter close-ups."""
    out = [(0, 0, w, h)]
    cw, ch = w / 1.6, h / 1.6
    for gy in range(3):
        for gx in range(3):
            x = (w - cw) * gx / 2
            y = (h - ch) * gy / 2
            out.append((x, y, x + cw, y + ch))
    cw, ch = w / 2.6, h / 2.6
    while len(out) < PER_PROJECT:
        x = rng.uniform(0, w - cw)
        y = rng.uniform(0, h - ch)
        out.append((x, y, x + cw, y + ch))
    return out


atlas = Image.new("RGB", (2048, 2048), (10, 10, 10))
gx0, gy0 = (CELL_W - TILE_W) // 2, (CELL_H - TILE_H) // 2
i = 0
for slug in SLUGS:
    img = Image.open(work / f"{slug}.webp").convert("RGB")
    for box in crops(*img.size):
        tile = img.crop(tuple(round(v) for v in box)).resize((TILE_W, TILE_H), Image.LANCZOS)
        # Smear edges into the gutter: stretch the tile over the whole cell, then paste it sharp.
        cell = tile.resize((CELL_W, CELL_H), Image.BILINEAR)
        cell.paste(tile, (gx0, gy0))
        atlas.paste(cell, ((i % COLS) * CELL_W, (i // COLS) * CELL_H))
        i += 1

atlas.save(work / "atlas.webp", "WEBP", quality=74, method=6)
print("tiles", i, "->", work / "atlas.webp", (work / "atlas.webp").stat().st_size // 1024, "KB")
