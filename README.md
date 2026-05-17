# THELAB

Source for `lucholabs.dev/lab` — a single-page site for projects, manifesto, and now/next. The deck-style editorial version is the default entrypoint.

## Variants

### `index.html` — Editorial / Brutalist (default)
- Palette: `#191919` dark grey background, `#fffaee` warm off-white, `#00FF41` phosphor-green accent
- Typography: Inter (sans-serif, weights 300–800) for display + text, Pixelify Sans for character moments, JetBrains Mono for technical metadata
- Background: low-opacity ASCII texture (`assets/ascii-texture.png`) + halftone dots + SVG grain overlay
- Chrome: deck-style header (green dot + crumb on left, "View CV ↗" pill on right), footer with `01 / 11 — Hero` slide stamp + pager arrows
- Section register: super labels (`MANIFESTO — what runs through every project`), massive Inter titles with green `<em>` emphasis, hairline rules
- Vibe: editorial print/magazine, brutalist warm, "Born to Build"
- Imports the deck's content patterns: "Three **Ecosystems.**" framing, `BVD · 06` project codes, `<em>` orange-italic emphasis on key syllables

`index-deck-style.html` mirrors the default deck variant for direct editing/comparison.

## How to compare

```
git clone https://github.com/lualducor/THELAB
cd THELAB
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

Or just open each file directly in a browser.

## Assets

```
assets/ascii-texture.png   used by index-deck-style.html (low-opacity overlay)
assets/lucholabs-favicon.png   TODO: add the blue/cyan LL favicon here
```

## Deploy

Deploy this repo so `index.html` is served at `lucholabs.dev/lab`, while the main CV site remains at `lucholabs.dev/`.
