#!/usr/bin/env bash
# ship-thelab.sh — single-shot driver for THELAB shipping.
#
# Assumes a GitHub remote is already configured. If not, run first:
#   gh repo create lualducor/THELAB --public --source=. --remote=origin
# (or set up via web UI then `git remote add origin <url>`)
#
# Runs:
#   1. Install eta + build the deck
#   2. Stage + commit Phase 1 visible changes + Phase 2D build pipeline
#   3. Push to origin
#
# DOES NOT create the Vercel project. DOES NOT deploy.

set -euo pipefail

cd "$(dirname "$0")/.."  # → THELAB root

CO="Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"

echo "==> Step 1/3: Install + build"
npm install
npm run build

echo "==> Step 2/3: Commit"
git add -A
git commit -m "feat(deck): Phase 1 visible changes + Phase 2D build pipeline

Visible (in index.html):
- Chrome: Blog ↗ link next to View CV
- 3 new sections: Trust strip, Speaking proof, Subscribe (email capture)
- Connect: blog writing row
- Stamp: 01/11 → 01/14 + SECTION_LABELS updated
- Plausible analytics script tag

Build pipeline (Phase 2D scaffolding):
- package.json + build.mjs (eta-based, pure Node, no jq)
- index.template.html (seeded from index.html; incremental eta migration)
- README.md rewritten with build + deploy + source-of-truth rules

Deleted: index-deck-style.html (byte-identical duplicate).

$CO"

echo "==> Step 3/3: Push"
git push

echo ""
echo "==================================================="
echo "✓ THELAB shipped to origin."
echo ""
echo "Next manual steps (Vercel-side):"
echo "  1. Create new Vercel project from the THELAB GitHub repo."
echo "  2. Build command: npm run build"
echo "  3. Output directory: . (or wherever build.mjs writes)"
echo "  4. Note the assigned Vercel URL (e.g. thelab-lucholabs.vercel.app)."
echo "  5. Add /lab rewrite to lucholabs-site/vercel.json pointing at that URL."
echo "  6. Commit + push lucholabs-site to trigger redeploy."
echo "  7. Verify: curl https://lucholabs.dev/lab | grep 'How I Build'"
echo "==================================================="
