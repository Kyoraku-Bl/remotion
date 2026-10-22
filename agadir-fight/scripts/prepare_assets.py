"""Remove the connected white studio background from generated character art.

The generated poses use closed ink contours. A border flood fill removes only the
background, preserving white hair, eyes, and clothing enclosed by those contours.
Run with Python 3, Pillow, and NumPy installed.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

PUBLIC = Path(__file__).resolve().parents[1] / "public"
POSES = (
    "shunsui-stance",
    "shunsui-attack",
    "gojo-stance",
    "gojo-red",
    "gojo-ultimate",
)


def remove_white_background(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image)
    height, width = rgb.shape[:2]
    minimum = rgb.min(axis=2)
    maximum = rgb.max(axis=2)

    # Only bright, nearly neutral pixels can participate in the background.
    candidate = (minimum > 210) & ((maximum - minimum) < 30)
    connected = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        for y in (0, height - 1):
            if candidate[y, x] and not connected[y, x]:
                connected[y, x] = True
                queue.append((y, x))
    for y in range(height):
        for x in (0, width - 1):
            if candidate[y, x] and not connected[y, x]:
                connected[y, x] = True
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if (
                0 <= ny < height
                and 0 <= nx < width
                and candidate[ny, nx]
                and not connected[ny, nx]
            ):
                connected[ny, nx] = True
                queue.append((ny, nx))

    alpha = np.full((height, width), 255, dtype=np.uint8)
    # Feather near-white edge pixels instead of leaving a white cutout halo.
    feather = np.clip((248 - minimum.astype(np.float32)) * 10.5, 0, 255)
    alpha[connected] = feather[connected].astype(np.uint8)
    rgba = np.dstack((rgb, alpha))
    ys, xs = np.where(alpha > 8)
    if not len(xs):
        raise RuntimeError(f"No foreground found in {source}")
    pad = 8
    left = max(0, int(xs.min()) - pad)
    right = min(width, int(xs.max()) + pad + 1)
    top = max(0, int(ys.min()) - pad)
    bottom = min(height, int(ys.max()) + pad + 1)
    Image.fromarray(rgba[top:bottom, left:right]).save(destination, optimize=True)
    print(f"{source.name}: {width}x{height} -> {right-left}x{bottom-top}")


if __name__ == "__main__":
    for pose in POSES:
        remove_white_background(PUBLIC / f"{pose}.png", PUBLIC / f"{pose}-cutout.png")
