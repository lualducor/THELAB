// THELAB build pipeline.
// Reads content.json from the CV repo, renders index.template.html via eta,
// writes index.html (en) + es/index.html (es).
//
// This is the source of truth for the deployed deck. Do NOT hand-edit
// index.html — edit index.template.html and rerun `npm run build`.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Eta } from 'eta';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = resolve(__dirname, '../lucholabs/lucholabs-site/src/data/content.json');
const TEMPLATE_PATH = resolve(__dirname, 'index.template.html');

if (!existsSync(CONTENT_PATH)) {
  console.error(`[build] content.json not found at ${CONTENT_PATH}`);
  console.error('[build] THELAB expects lucholabs-site to be at ../lucholabs/lucholabs-site/');
  process.exit(1);
}

if (!existsSync(TEMPLATE_PATH)) {
  console.error(`[build] index.template.html not found at ${TEMPLATE_PATH}`);
  process.exit(1);
}

const content = JSON.parse(readFileSync(CONTENT_PATH, 'utf-8'));
const template = readFileSync(TEMPLATE_PATH, 'utf-8');

const eta = new Eta({
  autoEscape: true,
  views: __dirname,
  tags: ['<%', '%>'],
});

function t(value, locale = 'en') {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value[locale] || value.en || '';
  }
  return '';
}

function render(locale) {
  const data = { ...content, t, locale };
  return eta.renderString(template, data);
}

// Build English (root)
writeFileSync(resolve(__dirname, 'index.html'), render('en'));
console.log('✓ Built index.html (en)');

// Build Spanish mirror
const esDir = resolve(__dirname, 'es');
mkdirSync(esDir, { recursive: true });
writeFileSync(resolve(esDir, 'index.html'), render('es'));
console.log('✓ Built es/index.html (es)');

console.log('\n[build] Done. Open index.html or run `python3 -m http.server 8000` to preview.');
