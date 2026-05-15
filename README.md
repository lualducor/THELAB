# THELAB

Source for `lucholabs.dev/lab` — a single-page console/matrix-aesthetic site for projects, manifesto, and now/next. Phosphor-green terminal vibe over an animated ASCII matrix backdrop, with snap-scrolling between full-viewport sections.

## Layout

```
index.html          single self-contained file: inlined CSS + JS, 11 snap sections
assets/             static assets referenced by index.html
  lucholabs-favicon.png   TODO: add the blue/cyan LL favicon here
```

No build step. No dependencies beyond Google Fonts (JetBrains Mono + VT323). Open `index.html` in a browser to preview.

## Sections

1. Hero — typewriter "let's talk about: …" cycling ~150 words
2. Manifesto
3. Thesis — accessibility / live-captioning story
4. Stack
5. Projects index
6. Boveda
7. Phishing Shield
8. SUPERFARM
9. The Lab / Now — faux `git log` of recent commits
10. Dead Experiments — `/archive/dead` with postmortems
11. Connect

## Deploy

Drop `index.html` (and `assets/`) at `public/lab/` in the `lucholabs-site` (CV) repo. Vercel serves it at `lucholabs.dev/lab` automatically.

Pair with a `vercel.json` redirect from `/` → `/lab` and a `BrowserRouter basename="/cv"` move for the existing React CV so the URL structure becomes:

- `lucholabs.dev/` → redirects to `/lab` (this site)
- `lucholabs.dev/lab` → this site
- `lucholabs.dev/cv` → the existing React CV

## Local preview

```
cd thelab && python3 -m http.server 8000
# open http://localhost:8000/
```
