# THELAB

Source for `lucholabs.dev/lab` — the editorial deck.

Single-page static HTML with an [eta](https://eta.js.org/) templating pipeline that consumes `content.json` from the CV repo so the deck never drifts from canonical content.

## Layout

```
THELAB/
  index.template.html   ← source of truth (edit this)
  build.mjs             ← reads content.json, renders index.template.html via eta
  index.html            ← BUILD OUTPUT (do not hand-edit)
  es/index.html         ← BUILD OUTPUT (Spanish mirror, falls back to en when es missing)
  assets/               ← static assets (ascii-texture.png etc.)
  package.json          ← node tooling
```

## Local development

```bash
npm install      # one-time, installs eta
npm run build    # produces index.html + es/index.html from index.template.html
npm run dev      # build + serve on http://localhost:8000
```

## Deploy (separate Vercel project)

1. Push this repo to GitHub (separate from lucholabs-site).
2. Create a new Vercel project from the GitHub repo.
3. Build command: `npm run build`
4. Output directory: `.` (project root)
5. Note: the build needs `content.json` accessible. Options:
   - Include lucholabs-site as a git submodule, OR
   - Vendor a copy of `content.json` into this repo at build time via a sync script, OR
   - Run the build locally and commit the rendered `index.html` (simplest).

6. In `lucholabs-site/vercel.json`, add a `/lab/:path*` rewrite pointing at your THELAB Vercel URL.

## Source-of-truth rule

`content.json` (in the CV repo) is canonical for: identity, projects, manifesto, speaking, contact, faq, dead experiments. Eta tags in `index.template.html` read from it. Hand-edits to `index.html` are overwritten on next `npm run build`.

The current `index.template.html` is seeded from the previous hardcoded `index.html`. Eta-tag migration is incremental — each section can be converted from hardcoded to `<%= it.section %>` as needed without breaking the build.

## Visual identity

- Palette: `#191919` background, `#fffaee` warm off-white, `#00FF41` phosphor green accent
- Typography: Inter (display + body), Pixelify Sans (character), JetBrains Mono (metadata)
- Background: low-opacity ASCII texture (`assets/ascii-texture.png`) + halftone dots + SVG grain
- Chrome: deck-style header (green dot + crumb + Blog/CV pills), footer with section stamp + pager
- Vibe: editorial brutalist warm, "Born to Build"

## Section register (14 sections)

01 Hero · 02 Manifesto · 03 Thesis · 04 Stack · 05 Projects index · 06 Boveda · 07 Phishing Shield · 08 Superfarm · 09 Trust · 10 Speaking · 11 Now & Next · 12 Archive · 13 Subscribe · 14 Connect
