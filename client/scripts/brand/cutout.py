"""Cut the subject out of the portrait photo for the hero.

Output (into argv[2], normally client/public):
  portrait-particles.webp - transparent cut-out cropped to the subject; the
                            WebGL particle portrait samples it at runtime
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

src = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

photo = Image.open(src).convert("RGB")

session = new_session("isnet-general-use")
cut = remove(photo, session=session, post_process_mask=True)
alpha = np.asarray(cut.split()[-1]).astype(np.float32) / 255.0

# Soften the mask edge a touch so the particle silhouette has no jaggies.
a_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
rgba = photo.copy()
rgba.putalpha(a_img)

# Crop to the subject's bounding box (with a small margin on top/sides).
ys, xs = np.where(np.asarray(a_img) > 24)
top, bottom = max(ys.min() - 20, 0), photo.height
left, right = max(xs.min() - 20, 0), min(xs.max() + 20, photo.width)
rgba = rgba.crop((left, top, right, bottom))

# 480px tall is plenty: the runtime samples it down to at most 150 rows.
scale = 480 / rgba.height
rgba = rgba.resize((round(rgba.width * scale), 480), Image.LANCZOS)
rgba.save(out / "portrait-particles.webp", "WEBP", quality=90, method=6)
print("portrait", rgba.size, "crop", (left, top, right, bottom))
