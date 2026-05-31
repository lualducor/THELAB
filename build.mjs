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
const SITE_URL = 'https://lucholabs.dev';
const CONTENT_PATH = resolve(__dirname, '../lucholabs/lucholabs-site/src/data/content.json');
const INDEX_TEMPLATE_PATH = resolve(__dirname, 'index.template.html');
const PROJECT_TEMPLATE_PATH = resolve(__dirname, 'project.template.html');
const ARCHIVE_TEMPLATE_PATH = resolve(__dirname, 'archive.template.html');
const PROJECT_PAGES = [
  { slug: 'boveda', projectId: 'bvd' },
  { slug: 'anti-phishing-shield', projectId: 'phs' },
  { slug: 'superfarm', projectId: 'sfm' },
];

if (!existsSync(CONTENT_PATH)) {
  console.error(`[build] content.json not found at ${CONTENT_PATH}`);
  console.error('[build] THELAB expects lucholabs-site to be at ../lucholabs/lucholabs-site/');
  process.exit(1);
}

for (const templatePath of [INDEX_TEMPLATE_PATH, PROJECT_TEMPLATE_PATH, ARCHIVE_TEMPLATE_PATH]) {
  if (!existsSync(templatePath)) {
    console.error(`[build] Template not found at ${templatePath}`);
    process.exit(1);
  }
}

const content = JSON.parse(readFileSync(CONTENT_PATH, 'utf-8'));

// Shared vocabulary — single source of truth for the hero typewriter AND the
// animated ASCII background. Injected into every page as window.LAB_WORDS.
const VOCAB_PATH = resolve(__dirname, 'lab-vocabulary.json');
const vocabulary = existsSync(VOCAB_PATH) ? JSON.parse(readFileSync(VOCAB_PATH, 'utf-8')) : [];
const vocabularyJson = JSON.stringify(vocabulary);

const indexTemplate = readFileSync(INDEX_TEMPLATE_PATH, 'utf-8');
const projectTemplate = readFileSync(PROJECT_TEMPLATE_PATH, 'utf-8');
const archiveTemplate = readFileSync(ARCHIVE_TEMPLATE_PATH, 'utf-8');

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

function renderTemplate(template, data) {
  return eta.renderString(template, data);
}

function renderIndex(locale) {
  return renderTemplate(indexTemplate, { ...content, t, locale, vocabularyJson });
}

function writeOutput(outputPath, html) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
}

function getProjects() {
  if (!Array.isArray(content.projects)) {
    console.error('[build] content.json does not contain a top-level projects array.');
    process.exit(1);
  }

  return content.projects;
}

function getProjectBySlug(slug) {
  const project = getProjects().find((item) => item.slug === slug);

  if (!project) {
    console.error(`[build] Project with slug "${slug}" was not found in content.json.`);
    process.exit(1);
  }

  return project;
}

function getArchiveProjects() {
  const archiveProjects = getProjects().filter((project) => project.isArchived);

  if (!archiveProjects.length) {
    console.error('[build] No archived projects were found in content.json.');
    process.exit(1);
  }

  return archiveProjects;
}

function getLabUrl(locale, slug = '') {
  const base = locale === 'es' ? `${SITE_URL}/es/lab` : `${SITE_URL}/lab`;
  return slug ? `${base}/${slug}` : base;
}

function getCvUrl(locale) {
  return locale === 'es' ? `${SITE_URL}/es/` : `${SITE_URL}/`;
}

function getBlogUrl(locale) {
  return locale === 'es' ? `${SITE_URL}/es/blog` : `${SITE_URL}/blog`;
}

function getStatusKey(status) {
  const normalizedStatus = t(status || '').toLowerCase();

  if (normalizedStatus.includes('progress')) return 'progress';
  if (normalizedStatus.includes('prototype')) return 'prototype';
  if (normalizedStatus.includes('research')) return 'research';
  if (normalizedStatus.includes('killed')) return 'killed';

  return 'progress';
}

function uniqueParagraphs(values, locale = 'en') {
  return [...new Set(values.map((value) => t(value, locale)?.trim()).filter(Boolean))];
}

function buildExternalLinks(project) {
  const entries = [
    { label: 'GitHub', href: project.links?.github },
    { label: 'Demo', href: project.links?.demo },
    { label: 'Paper', href: project.links?.paper },
    { label: 'Repository', href: project.repoUrl },
  ];

  return entries.filter((entry, index, items) => {
    if (!entry.href) return false;
    return items.findIndex((candidate) => candidate.href === entry.href) === index;
  });
}

function buildProjectJsonLd(project, locale, canonicalUrl) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: `${project.name} — THELAB`,
      description: project.description,
      isPartOf: { '@id': getLabUrl(locale) },
      about: {
        '@type': 'SoftwareApplication',
        name: project.name,
        description: project.description,
      },
      inLanguage: locale,
    },
    null,
    2,
  );
}

function buildArchiveJsonLd(locale, canonicalUrl) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: 'Archive — THELAB',
      description: 'Postmortems for archived experiments from lucholabs.',
      isPartOf: { '@id': getLabUrl(locale) },
      inLanguage: locale,
    },
    null,
    2,
  );
}

function buildProjectPage(project, locale, projectId) {
  const canonicalUrl = getLabUrl(locale, project.slug);
  const localeSwapUrl = getLabUrl(locale === 'es' ? 'en' : 'es', project.slug);
  const cvUrl = getCvUrl(locale);

  return {
    title: `${project.name} — lucholabs.dev/lab`,
    description: project.description,
    ogTitle: `${project.name} — lucholabs.dev/lab`,
    ogDescription: project.labTagline || project.tagline || project.description,
    canonicalUrl,
    localeSwapUrl,
    locale,
    backUrl: getLabUrl(locale),
    blogUrl: getBlogUrl(locale),
    cvUrl,
    code: projectId.toUpperCase(),
    statusKey: getStatusKey(project.status),
    statusBadge: project.status,
    subtitle: project.labTagline || project.tagline || project.description,
    quote: project.labQuote || '',
    paragraphs: uniqueParagraphs([project.labDescription, project.cvDescription], locale),
    bullets: Array.isArray(project.labFeatures) ? project.labFeatures : [],
    note: project.labVision || '',
    relatedHref: `${cvUrl}#projects`,
    relatedKicker: t(content.lab?.copy?.relatedKicker, locale) || 'CV projects section',
    relatedLabel: t(content.lab?.copy?.relatedLabel, locale) || 'Projects section',
    externalLinks: buildExternalLinks(project),
    jsonLd: buildProjectJsonLd(project, locale, canonicalUrl),
  };
}

function buildArchivePage(locale) {
  const canonicalUrl = getLabUrl(locale, 'archive');
  const localeSwapUrl = getLabUrl(locale === 'es' ? 'en' : 'es', 'archive');
  const cvUrl = getCvUrl(locale);

  return {
    title: t(content.lab?.copy?.archiveTitle, locale) || 'Archive — lucholabs.dev/lab',
    description: t(content.lab?.copy?.archiveDescription, locale) || 'Postmortems for archived experiments from lucholabs.',
    ogTitle: t(content.lab?.copy?.archiveTitle, locale) || 'Archive — lucholabs.dev/lab',
    ogDescription: t(content.lab?.copy?.archiveDescription, locale) || 'Postmortems for archived experiments from lucholabs.',
    canonicalUrl,
    localeSwapUrl,
    locale,
    backUrl: getLabUrl(locale),
    blogUrl: getBlogUrl(locale),
    cvUrl,
    relatedHref: `${cvUrl}#projects`,
    relatedLabel: t(content.lab?.copy?.relatedLabel, locale) || 'Projects section',
    jsonLd: buildArchiveJsonLd(locale, canonicalUrl),
  };
}

writeOutput(resolve(__dirname, 'index.html'), renderIndex('en'));
console.log('✓ Built index.html (en)');

writeOutput(resolve(__dirname, 'es/index.html'), renderIndex('es'));
console.log('✓ Built es/index.html (es)');

for (const locale of ['en', 'es']) {
  for (const { slug, projectId } of PROJECT_PAGES) {
    const project = getProjectBySlug(slug);
    const outputPath = resolve(
      __dirname,
      locale === 'es' ? `es/${slug}/index.html` : `${slug}/index.html`,
    );

    writeOutput(
      outputPath,
      renderTemplate(projectTemplate, {
        ...content,
        t,
        locale,
        vocabularyJson,
        page: buildProjectPage(project, locale, projectId),
        project,
      }),
    );

    console.log(`✓ Built ${locale === 'es' ? `es/${slug}/index.html` : `${slug}/index.html`} (${locale})`);
  }

  const archiveOutputPath = resolve(
    __dirname,
    locale === 'es' ? 'es/archive/index.html' : 'archive/index.html',
  );

  writeOutput(
    archiveOutputPath,
    renderTemplate(archiveTemplate, {
      ...content,
      t,
      locale,
      vocabularyJson,
      page: buildArchivePage(locale),
      projects: getArchiveProjects(),
    }),
  );

  console.log(`✓ Built ${locale === 'es' ? 'es/archive/index.html' : 'archive/index.html'} (${locale})`);
}

console.log('\n[build] Done. Open index.html or run `python3 -m http.server 8000` to preview.');
