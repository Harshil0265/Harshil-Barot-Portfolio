"""Trace the HB monogram PNG into SVG paths for the site.

Writes a JS module (argv[2]) exporting:
  LOGO_VIEWBOX - viewBox of the traced artwork (1000 units tall)
  LOGO_PATHS   - the whole monogram (header logo, final loader frame)
  LOGO_PARTS   - the monogram split into H, swash and B, each with ordered
                 brush strokes ({d, w}) used to "write" the letter in the loader
Also writes logo_preview.svg next to this script: parts in colour with their
brush centrelines, to check the split and stroke order by eye.

The part regions below are measured from the source artwork (1254px square,
white on black); update them if the logo changes.
"""
import json
import math
import sys
from collections import deque
from pathlib import Path

import numpy as np
import potrace
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from skimage.morphology import skeletonize

src = Path(sys.argv[1])
dest = Path(sys.argv[2])

UP = 2  # trace at 2x so the hairline serifs survive
img = Image.open(src).convert("L")
img = img.resize((img.width * UP, img.height * UP), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.8))
full = np.asarray(img) > 128

ys, xs = np.where(full)
pad = 24
x0, y0 = xs.min() - pad, ys.min() - pad
x1, y1 = xs.max() + pad, ys.max() + pad
full = full[y0:y1, x0:x1]
H, W = full.shape
S = 1000 / H  # crop px -> viewBox units


def to_crop(x, y):
    """Original-artwork pixel -> crop pixel."""
    return x * UP - x0, y * UP - y0


def vb(x, y):
    return x * S, y * S


# --- split into parts (regions in original-artwork pixels) -------------------
yy, xx = np.mgrid[0:H, 0:W]
ox, oy = (xx + x0) / UP, (yy + y0) / UP  # original coords per crop pixel

LEFT_STEM_R, RIGHT_STEM_L, RIGHT_STEM_R = 385, 655, 731
CROSSBAR = (541, 558)

b_region = (ox > RIGHT_STEM_R) & (oy >= 300)
swash_region = (ox > LEFT_STEM_R + 1) & (ox < RIGHT_STEM_L - 1) & (oy > 380) & (oy < 860) & ~(
    (oy >= CROSSBAR[0]) & (oy <= CROSSBAR[1]))
swash = full & swash_region
# The left stem's bottom serif pokes into the swash region; it belongs to H.
lab, n = ndimage.label(swash)
for i in range(1, n + 1):
    comp = lab == i
    if (ox[comp] <= LEFT_STEM_R + 6).any():
        swash &= ~comp
b_part = full & b_region
h_part = full & ~swash & ~b_part

# Overlap neighbours by a couple of pixels so no hairline seam shows.
grow = lambda m: ndimage.binary_dilation(m, iterations=3) & full
parts = {"H": grow(h_part), "a": grow(swash), "B": grow(b_part)}


def trace(mask):
    bm = potrace.Bitmap(~mask)  # potracer fills the "dark" (False) pixels
    plist = bm.trace(turdsize=8, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                     alphamax=1.0, opticurve=True, opttolerance=0.2)

    def pt(p):
        x, y = (p.x, p.y) if hasattr(p, "x") else p
        return f"{x * S:.1f},{y * S:.1f}"

    out = []
    for curve in plist:
        d = [f"M{pt(curve.start_point)}"]
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f"L{pt(seg.c)}L{pt(seg.end_point)}")
            else:
                d.append(f"C{pt(seg.c1)} {pt(seg.c2)} {pt(seg.end_point)}")
        d.append("Z")
        out.append("".join(d))
    return " ".join(out)


# --- brush strokes -----------------------------------------------------------
def line(p, q, width):
    """Straight stroke between original-artwork points."""
    return [to_crop(*p), to_crop(*q)], width * UP


def skeleton_strokes(mask, start_rule, margin=10):
    """One stroke per skeleton branch, longest path first, oriented by start_rule."""
    dist = ndimage.distance_transform_edt(mask)
    skel = skeletonize(mask)
    strokes = []
    lab, n = ndimage.label(skel, structure=np.ones((3, 3)))
    comps = sorted(range(1, n + 1), key=lambda i: -(lab == i).sum())
    for i in comps:
        pts = set(zip(*np.where(lab == i)))
        if len(pts) < 12:
            continue
        while len(pts) >= 12:
            path = diameter(pts)
            if len(path) < 12:
                break
            radius = max(dist[p] for p in path)
            strokes.append((path, radius))
            covered = {p for p in pts if min_dist(p, path) <= radius}
            pts -= covered
    result = []
    for path, radius in strokes:
        path = [(c, r) for r, c in path]  # (x, y)
        if not start_rule(path[0], path[-1]):
            path.reverse()
        path = extend(path[::6] + [path[-1]], radius)
        result.append((path, 2 * radius + margin * UP))
    return result


def neighbours(p, pts):
    r, c = p
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            q = (r + dr, c + dc)
            if q != p and q in pts:
                yield q


def bfs(start, pts):
    prev = {start: None}
    queue = deque([start])
    last = start
    while queue:
        last = queue.popleft()
        for q in neighbours(last, pts):
            if q not in prev:
                prev[q] = last
                queue.append(q)
    return last, prev


def diameter(pts):
    a, _ = bfs(next(iter(pts)), pts)
    b, prev = bfs(a, pts)
    path = [b]
    while prev[path[-1]] is not None:
        path.append(prev[path[-1]])
    return path


def min_dist(p, path):
    return min(math.dist(p, q) for q in path[::4])


def extend(path, by):
    """Push both ends outwards along their tangents so butt caps clear the stroke ends."""
    def push(a, b):
        dx, dy = a[0] - b[0], a[1] - b[1]
        k = by / (math.hypot(dx, dy) or 1)
        return (a[0] + dx * k, a[1] + dy * k)
    return [push(path[0], path[min(3, len(path) - 1)])] + path + [push(path[-1], path[-min(4, len(path))])]


def smooth_d(points):
    pts = [vb(*p) for p in points]
    d = [f"M{pts[0][0]:.1f} {pts[0][1]:.1f}"]
    ext = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(ext) - 2):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}")
    return "".join(d)


# H: left stem down, crossbar left to right, right stem down (stem brushes span the serifs).
h_strokes = [
    line((346.5, 252), (346.5, 842), 240),
    line((380, 549.5), (660, 549.5), 34),
    line((692.5, 252), (692.5, 988), 240),
]
# Swash: each curve starts where it leaves the stem (its top end); upper arc first.
a_strokes = sorted(skeleton_strokes(parts["a"], lambda s, e: s[1] < e[1]), key=lambda st: st[0][1][1])
# B: from the top of the upper bowl round to the foot.
b_strokes = skeleton_strokes(parts["B"], lambda s, e: s[1] < e[1], margin=14)

LOGO_PARTS = []
for name, strokes in (("H", h_strokes), ("a", a_strokes), ("B", b_strokes)):
    # Coverage check: how much of the part the brushes reveal.
    canvas = Image.new("L", (W, H), 0)
    draw = ImageDraw.Draw(canvas)
    for pts, w in strokes:
        draw.line([(round(x), round(y)) for x, y in pts], fill=255, width=round(w), joint="curve")
    covered = (np.asarray(canvas) > 0) & parts[name]
    print(f"{name}: {len(strokes)} strokes, coverage {covered.sum() / parts[name].sum():.4f}")
    LOGO_PARTS.append({
        "name": name,
        "d": trace(parts[name]),
        "strokes": [{"d": smooth_d(pts), "w": round(w * S, 1)} for pts, w in strokes],
    })

full_d = trace(full)
vbox = f"0 0 {W * S:.0f} 1000"
dest.write_text(
    "// Generated from the HB monogram artwork by scripts/brand/trace_logo.py.\n"
    f"export const LOGO_VIEWBOX = '{vbox}'\n\n"
    f"export const LOGO_PATHS = {json.dumps([full_d])}\n\n"
    f"export const LOGO_PARTS = {json.dumps(LOGO_PARTS, indent=2)}\n",
    encoding="utf-8",
)

colors = {"H": "#e8e2d6", "a": "#ff8a7a", "B": "#7ab8ff"}
preview = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbox}" width="{W * S / 2:.0f}" height="500">',
           '<rect width="100%" height="100%" fill="#000"/>']
for part in LOGO_PARTS:
    preview.append(f'<path d="{part["d"]}" fill="{colors[part["name"]]}" fill-rule="evenodd" opacity="0.85"/>')
    for i, s in enumerate(part["strokes"]):
        preview.append(f'<path d="{s["d"]}" fill="none" stroke="#0f0" stroke-width="3"/>')
        preview.append(f'<path d="{s["d"]}" fill="none" stroke="#0f0" stroke-opacity="0.12" stroke-width="{s["w"]}"/>')
preview.append("</svg>")
Path(__file__).with_name("logo_preview.svg").write_text("".join(preview), encoding="utf-8")
print("viewBox", vbox)
