# Agadir — Infinity / Bankai

A 30-second, 24 fps, 1920×1080 Remotion action sequence set on Agadir's coast.
The supplied Shunsui and Gojo art was used as the character reference. The
Agadir environments and additional pose art were created for this sequence.

## Run

```bash
npm install
npm run dev
```

Open the `AgadirFight` composition in Remotion Studio.

## Render

```bash
npm run render
```

The render script uses the npm-packaged Chromium binary and writes:

```
out/agadir-infinity-bankai.mp4
```

For a poster frame:

```bash
npm run still
```

## Timeline

| Time | Sequence |
| --- | --- |
| 0–4 s | Golden-hour standoff on the promenade |
| 4–8 s | Dual-katana blitz and Infinity impact |
| 8–11.5 s | Cursed Technique Reversal: Red |
| 11.5–15 s | Shadow dodge and palm-shadow counterattack |
| 15–20 s | Six Eyes and Bankai reveals |
| 20–24 s | Hollow Purple charge |
| 24–28.5 s | Aerial clash above Agadir Bay |
| 28.5–30 s | Shockwave dissipates over the Atlantic |

All animation is deterministic and frame-based. `scripts/generate_audio.py`
creates the original stereo score and sound design; no external audio is used.
`scripts/prepare_assets.py` documents the character-cutout preparation.
