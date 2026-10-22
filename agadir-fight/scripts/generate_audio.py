"""Create the original 30-second stereo score, sound design, and film grain."""

from pathlib import Path
import wave

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SR = 48_000
DURATION = 30.0
RNG = np.random.default_rng(9041987)
MIX = np.zeros((int(SR * DURATION), 2), dtype=np.float64)


def pan_gains(pan: float) -> tuple[float, float]:
    angle = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    return float(np.cos(angle)), float(np.sin(angle))


def add(signal: np.ndarray, start: float, gain: float = 1.0, pan: float = 0.0) -> None:
    offset = int(start * SR)
    if offset >= len(MIX) or offset + len(signal) <= 0:
        return
    source_start = max(0, -offset)
    offset = max(0, offset)
    length = min(len(signal) - source_start, len(MIX) - offset)
    left, right = pan_gains(pan)
    segment = signal[source_start : source_start + length, None] * gain
    MIX[offset : offset + length] += segment * np.array([left, right])


def noise(duration: float, color: str = "white") -> np.ndarray:
    count = int(duration * SR)
    source = RNG.normal(0, 1, count)
    spectrum = np.fft.rfft(source)
    frequencies = np.fft.rfftfreq(count, 1 / SR)
    if color == "low":
        curve = 1 / np.maximum(frequencies, 45) ** 0.82
    elif color == "sea":
        curve = 1 / np.maximum(frequencies, 90) ** 0.6
        curve *= 1 - np.exp(-frequencies / 180)
    elif color == "air":
        curve = (1 - np.exp(-frequencies / 900)) * np.exp(-frequencies / 11_000)
    else:
        curve = np.ones_like(frequencies)
    result = np.fft.irfft(spectrum * curve, n=count)
    return result / max(1e-9, np.std(result))


def drum(strength: float = 1.0) -> np.ndarray:
    duration = 1.25
    t = np.arange(int(duration * SR)) / SR
    frequency = 48 + 92 * np.exp(-t * 18)
    phase = 2 * np.pi * np.cumsum(frequency) / SR
    body = np.sin(phase) * np.exp(-t * 5.2)
    skin = noise(duration, "air") * np.exp(-t * 34) * 0.28
    click = noise(duration) * np.exp(-t * 90) * 0.13
    return (body + skin + click) * strength


def metal(strength: float = 1.0) -> np.ndarray:
    duration = 1.7
    t = np.arange(int(duration * SR)) / SR
    signal = np.zeros_like(t)
    for index, frequency in enumerate((1730, 2477, 3599, 4813, 6287, 7901)):
        signal += np.sin(2 * np.pi * frequency * t + index * 0.8) * np.exp(-t * (4.5 + index * 1.7)) / (1 + index * 0.5)
    signal += noise(duration, "air") * np.exp(-t * 24) * 0.5
    return signal * strength * 0.65


def whoosh(duration: float = 0.8, strength: float = 1.0) -> np.ndarray:
    t = np.arange(int(duration * SR)) / SR
    envelope = np.sin(np.pi * t / duration) ** 1.7
    signal = noise(duration, "air") * envelope
    signal += np.sin(2 * np.pi * (75 * t + 260 * t * t / duration)) * envelope * 0.12
    return signal * strength * 0.55


def sub_drop(duration: float = 1.8) -> np.ndarray:
    t = np.arange(int(duration * SR)) / SR
    frequency = 28 + 100 * np.exp(-t * 2.8)
    phase = 2 * np.pi * np.cumsum(frequency) / SR
    return (np.sin(phase) * np.exp(-t * 1.9) + noise(duration, "low") * np.exp(-t * 4) * 0.18) * 0.9


def energy(duration: float, base: float = 70, end: float = 70) -> np.ndarray:
    t = np.arange(int(duration * SR)) / SR
    frequency = base * (end / base) ** (t / duration)
    phase = 2 * np.pi * np.cumsum(frequency) / SR
    envelope = np.sin(np.pi * np.minimum(t / duration, 1)) ** 0.45
    hum = np.sin(phase) + np.sin(phase * 2.01) * 0.25 + np.sin(phase * 0.5) * 0.35
    return (hum * 0.28 + noise(duration, "air") * 0.12) * envelope


def explosion() -> np.ndarray:
    duration = 4.3
    t = np.arange(int(duration * SR)) / SR
    frequency = 24 + 72 * np.exp(-t * 2.3)
    phase = 2 * np.pi * np.cumsum(frequency) / SR
    low = np.sin(phase) * np.exp(-t * 0.95)
    blast = noise(duration, "low") * np.exp(-t * 1.25) * 0.72
    crack = noise(duration, "white") * np.exp(-t * 7.5) * 0.55
    tail = noise(duration, "sea") * np.exp(-t * 0.7) * 0.16
    return low + blast + crack + tail


# Ocean and wind form a quiet, continuous bed.
sea = noise(DURATION, "sea") * 0.017
sea *= 0.55 + 0.45 * np.sin(np.arange(len(sea)) / SR * 0.72) ** 2
add(sea, 0, pan=-0.35)
add(noise(DURATION, "sea") * 0.013, 0, pan=0.5)

# Low cinematic D-minor drone, intentionally sparse under the fight.
t = np.arange(int(24 * SR)) / SR
drone = np.zeros_like(t)
for frequency, level in ((36.71, 0.35), (73.42, 0.2), (110.0, 0.08), (146.83, 0.055)):
    drone += np.sin(2 * np.pi * frequency * t) * level
drone *= 0.5 + 0.5 * np.sin(np.pi * t / 24) ** 2
add(drone, 0, 0.24)

# Taiko pulse and accelerating action percussion.
for beat, strength in ((0.55, 0.55), (1.55, 0.45), (2.55, 0.5), (3.55, 0.75), (4.0, 0.85)):
    add(drum(strength), beat, 0.36, pan=-0.1)
for beat in np.arange(14.9, 25.6, 0.5):
    strength = 0.25 + (beat - 14.9) / 10.7 * 0.3
    add(drum(strength), float(beat), 0.22, pan=float(RNG.uniform(-0.35, 0.35)))
for beat in np.arange(20.0, 25.5, 0.25):
    tick = noise(0.12, "air") * np.exp(-np.arange(int(0.12 * SR)) / SR * 48)
    add(tick, float(beat), 0.035, pan=float(RNG.uniform(-0.7, 0.7)))

# Blitz, blade impacts, Red, and shadow counter.
add(whoosh(0.85, 1.1), 3.95, 0.6, pan=-0.65)
add(metal(1.1), 118 / 24, 0.52, pan=0.3)
add(drum(1.15), 118 / 24, 0.55)
add(sub_drop(1.5), 118 / 24, 0.28)
add(energy(1.45, 65, 150), 8.0, 0.25, pan=-0.25)
add(whoosh(0.65, 1.2), 9.12, 0.65, pan=0.35)
add(explosion() * 0.62, 226 / 24, 0.48, pan=0.25)
add(sub_drop(2.0), 11.45, 0.42)
add(whoosh(1.0, 0.8), 12.1, 0.48, pan=-0.5)
add(metal(0.95), 323 / 24, 0.48, pan=-0.15)
add(drum(1.0), 323 / 24, 0.46)

# Eye reveal shimmer and the heavier Bankai entrance.
shimmer_t = np.arange(int(2.2 * SR)) / SR
shimmer = np.zeros_like(shimmer_t)
for frequency in (1244.5, 1864.7, 2489.0):
    shimmer += np.sin(2 * np.pi * frequency * shimmer_t) * np.exp(-shimmer_t * 2.3) / 3
add(shimmer, 16.42, 0.11, pan=0.25)
add(sub_drop(2.8), 17.55, 0.5)
add(drum(1.2), 17.58, 0.5)
add(energy(2.4, 38, 52), 17.6, 0.24, pan=-0.25)

# Ultimate charge and the coastline collision.
add(energy(5.65, 48, 620), 20.0, 0.32, pan=0.25)
add(whoosh(1.7, 0.75), 23.9, 0.32)
add(explosion(), 617 / 24, 0.9)
add(drum(1.5), 617 / 24, 0.6)
add(sub_drop(4.0), 617 / 24, 0.55)
add(metal(0.35), 617 / 24 + 0.05, 0.15)

# Gentle mastering, headroom, and clean fades.
MIX[: int(0.18 * SR)] *= np.linspace(0, 1, int(0.18 * SR))[:, None]
MIX[-int(1.1 * SR) :] *= np.linspace(1, 0, int(1.1 * SR))[:, None]
MIX = np.tanh(MIX * 1.18)
peak = np.max(np.abs(MIX))
MIX *= 0.94 / max(peak, 1e-9)
pcm = (MIX * 32767).astype("<i2")
output = PUBLIC / "soundtrack.wav"
with wave.open(str(output), "wb") as wav:
    wav.setnchannels(2)
    wav.setsampwidth(2)
    wav.setframerate(SR)
    wav.writeframes(pcm.tobytes())
print(f"Wrote {output.name}: {DURATION:.1f}s stereo, peak {np.max(np.abs(MIX)):.3f}")

grain = RNG.integers(0, 256, (256, 256), dtype=np.uint8)
Image.fromarray(grain, mode="L").convert("RGB").save(PUBLIC / "grain.png", optimize=True)
print("Wrote grain.png")
