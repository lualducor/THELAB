# THELAB

Source for `lucholabs.dev/lab` — a single-page site for projects, manifesto, and now/next. Two visual variants currently live in this repo for side-by-side comparison; same 11-section content, two different aesthetics.

## Variants

### `index.html` — Phosphor / Matrix Console
- Palette: `#050a05` background, `#00FF41` phosphor green, soft glow
- Typography: JetBrains Mono throughout (+ VT323 for occasional display moments)
- Background: animated matrix-rain canvas (falling glyphs, ~30% opacity)
- Chrome: terminal-style top bar (`lucholabs:~/lab $ <section>`), bottom progress bar
- Section register: `$ cat manifesto.md`, `$ ls projects/`, `$ git log --oneline`
- Vibe: hacker terminal, phosphor CRT, cyberpunk HUD

### `index-deck-style.html` — Editorial / Brutalist (from the Deck)
- Palette: `#191919` dark grey background, `#fffaee` warm off-white, `#fe5102` vivid orange accent
- Typography: Inter (sans-serif, weights 300–800) for display + text, Pixelify Sans for character moments, JetBrains Mono for technical metadata
- Background: low-opacity ASCII texture (`assets/ascii-texture.png`) + halftone dots + SVG grain overlay
- Chrome: deck-style header (orange dot + crumb on left, "View CV ↗" pill on right), footer with `01 / 11 — Hero` slide stamp + pager arrows
- Section register: super labels (`MANIFESTO — what runs through every project`), massive Inter titles with orange `<em>` emphasis, hairline rules
- Vibe: editorial print/magazine, brutalist warm, "Born to Build"
- Imports the deck's content patterns: "Three **Ecosystems.**" framing, `BVD · 06` project codes, `<em>` orange-italic emphasis on key syllables

Both files share the same 11 sections, snap-scroll behavior, IntersectionObserver-based section tracking, hash routing, 150-word typewriter cycle, and keyboard nav (↑/↓/PgUp/PgDn/Home/End).

## How to compare

```
git clone https://github.com/lualducor/THELAB
cd THELAB
python3 -m http.server 8000
# open http://localhost:8000/index.html
# then    http://localhost:8000/index-deck-style.html
```

Or just open each file directly in a browser.

## Assets

```
assets/ascii-texture.png   used by index-deck-style.html (low-opacity overlay)
assets/lucholabs-favicon.png   TODO: add the blue/cyan LL favicon here
```

## Deploy

Once you pick a variant, copy that file to `public/lab/index.html` in the `lucholabs-site` (CV) repo. Vercel serves it at `lucholabs.dev/lab` automatically.

Pair with a `vercel.json` redirect from `/` → `/lab` and a `BrowserRouter basename="/cv"` move for the existing React CV so the URL structure becomes:

- `lucholabs.dev/` → redirects to `/lab` (this site)
- `lucholabs.dev/lab` → this site
- `lucholabs.dev/cv` → the existing React CV
