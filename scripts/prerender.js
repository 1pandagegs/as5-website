/**
 * Bakes the data-driven parts of the site into the static HTML so every
 * page works without JavaScript (and is fully visible to search engines):
 *
 *   [data-project-grid]        Portfolio index grid
 *   [data-featured-projects]   Homepage featured carousel
 *   [data-related-projects]    "More AS5 Work" on project pages
 *   [data-articles-grid]       Insights index grid
 *   [data-related-articles]    "More Insights" on article pages
 *
 * It also regenerates sitemap.xml from every page that isn't noindex.
 *
 * Source data lives in js/data/*.js. After editing it, run:
 *
 *   npm run prerender
 *
 * Rendered markup sits between <!-- prerender --> and <!-- /prerender -->
 * inside each container, so the script can be re-run safely.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const SITE = "https://as5group.com";

function loadData(file) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
  return sandbox.window;
}

const { AS5_PROJECTS: projects } = loadData("js/data/projects.js");
const { AS5_ARTICLES: articles } = loadData("js/data/articles.js");

const STATUS_LABELS = {
  completed: "Completed",
  "in-progress": "In Progress",
  "concept-approved": "Concept Approved",
  awarded: "Awarded",
  partnership: "Partnership",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const dimensionCache = {};
async function imageAttrs(src) {
  if (!dimensionCache[src]) {
    const meta = await sharp(path.join(root, src)).metadata();
    dimensionCache[src] = `width="${meta.width}" height="${meta.height}"`;
  }
  return dimensionCache[src];
}

// The image link duplicates the title link, so it is hidden from assistive
// tech and skipped in the tab order; the image itself is decorative.
async function mediaLink(href, className, src) {
  return (
    `<a href="${href}" class="${className}" tabindex="-1" aria-hidden="true">` +
    `<img src="${src}" alt="" ${await imageAttrs(src)} loading="lazy" decoding="async" />`
  );
}

async function projectCard(project, opts) {
  const href = `/portfolio/${project.slug}/`;
  const meta = opts.showMeta
    ? '<div class="project-card__meta">' +
      `<span class="text-label-caps">${escapeHtml(project.type)}</span>` +
      `<span class="text-label-caps">${escapeHtml(project.location)}</span>` +
      `<span class="text-label-caps">${escapeHtml(project.year)}</span>` +
      "</div>"
    : "";
  const description = opts.showDescription
    ? `<p class="text-body-md on-surface-variant">${escapeHtml(project.tagline)}</p>`
    : "";
  return (
    `<article class="project-card${opts.wide ? " project-card--wide" : ""}" data-status="${project.status}" data-category="${project.category}">` +
    (await mediaLink(href, "project-card__media", project.heroImage)) +
    `<span class="project-card__badge text-label-caps">${STATUS_LABELS[project.status] || project.status}</span>` +
    "</a>" +
    '<div class="flex-col gap-2">' +
    meta +
    `<h3 class="text-headline-md"><a href="${href}">${escapeHtml(project.title)}</a></h3>` +
    description +
    `<a href="${href}" class="text-label-caps project-card__link" aria-hidden="true" tabindex="-1">${opts.linkLabel}</a>` +
    "</div>" +
    "</article>"
  );
}

async function articleCard(article, featured) {
  const href = `/insights/${article.slug}/`;
  const [year, month] = article.date.split("-");
  return (
    `<article class="insight-card${featured ? " insight-card--featured" : ""}" data-category="${article.category.toLowerCase().replace(/\s+/g, "-")}">` +
    (await mediaLink(href, "insight-card__media", article.heroImage)) +
    "</a>" +
    '<div class="flex-col gap-2">' +
    '<div class="project-card__meta">' +
    `<span class="text-label-caps">${escapeHtml(article.category)}</span>` +
    `<span class="text-label-caps">${MONTHS[parseInt(month, 10) - 1]} ${year}</span>` +
    "</div>" +
    `<h3 class="text-headline-md"><a href="${href}">${escapeHtml(article.title)}</a></h3>` +
    `<p class="text-body-md on-surface-variant">${escapeHtml(article.excerpt)}</p>` +
    `<a href="${href}" class="text-label-caps project-card__link" aria-hidden="true" tabindex="-1">Read Article →</a>` +
    "</div>" +
    "</article>"
  );
}

async function renderProjectGrid(attrs) {
  const visible = (attr(attrs, "data-visible-categories") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const list = visible.length ? projects.filter((p) => visible.includes(p.category)) : projects;
  // A wider first card and one mid-page card break up the grid so it
  // doesn't read as a flat catalogue.
  const wideIndices = [0, 6];
  const cards = [];
  for (const [i, project] of list.entries()) {
    cards.push(await projectCard(project, {
      showMeta: true,
      showDescription: true,
      linkLabel: "View Specification →",
      wide: wideIndices.includes(i),
    }));
  }
  return cards.join("\n");
}

async function renderFeaturedProjects(attrs) {
  const slugs = (attr(attrs, "data-featured-projects") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const picked = slugs.length
    ? slugs.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean)
    : projects.slice(0, 4);
  const cards = [];
  for (const project of picked) {
    cards.push(await projectCard(project, { showMeta: true, showDescription: true, linkLabel: "View Project →" }));
  }
  return cards.join("\n");
}

async function renderRelatedProjects(attrs) {
  const currentSlug = attr(attrs, "data-related-projects");
  const count = 3;
  const others = projects.filter((p) => p.slug !== currentSlug);
  const current = projects.find((p) => p.slug === currentSlug);
  const sameCategory = current ? others.filter((p) => p.category === current.category) : others;
  const pool = sameCategory.length >= count ? sameCategory : others;
  const cards = [];
  for (const project of pool.slice(0, count)) {
    cards.push(await projectCard(project, { showMeta: false, showDescription: false, linkLabel: "View Project →" }));
  }
  return cards.join("\n");
}

async function renderArticlesGrid() {
  const featured = articles.find((a) => a.featured);
  const cards = [];
  if (featured) cards.push(await articleCard(featured, true));
  for (const article of articles.filter((a) => a !== featured)) {
    cards.push(await articleCard(article, false));
  }
  return cards.join("\n");
}

async function renderRelatedArticles(attrs) {
  const currentSlug = attr(attrs, "data-related-articles");
  const cards = [];
  for (const article of articles.filter((a) => a.slug !== currentSlug).slice(0, 3)) {
    cards.push(await articleCard(article, false));
  }
  return cards.join("\n");
}

const RENDERERS = [
  ["data-project-grid", renderProjectGrid],
  ["data-featured-projects", renderFeaturedProjects],
  ["data-related-projects", renderRelatedProjects],
  ["data-articles-grid", renderArticlesGrid],
  ["data-related-articles", renderRelatedArticles],
];

function attr(attrs, name) {
  const match = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : null;
}

function htmlFiles(dir = root) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (["node_modules", ".git", "server", "api", "scripts"].includes(entry.name)) return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

async function prerenderFile(file) {
  let html = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const [attribute, render] of RENDERERS) {
    const pattern = new RegExp(
      `(<div\\b[^>]*\\b${attribute}(?:="[^"]*")?[^>]*>)(?:<!-- prerender -->[\\s\\S]*?<!-- /prerender -->)?(</div>)`
    );
    const match = html.match(pattern);
    if (!match) continue;
    const inner = await render(match[1]);
    html = html.replace(pattern, () => `${match[1]}<!-- prerender -->\n${inner}\n<!-- /prerender -->${match[2]}`);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, html);
    console.log("prerendered " + path.relative(root, file));
  }
}

function writeSitemap(files) {
  const urls = files
    .filter((file) => !/content="noindex"/.test(fs.readFileSync(file, "utf8")))
    .map((file) => "/" + path.relative(root, file).replace(/\\/g, "/").replace(/index\.html$/, ""))
    .filter((url) => !url.endsWith(".html"))
    .sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b));
  const body = urls.map((url) => `  <url><loc>${SITE}${url}</loc></url>`).join("\n");
  fs.writeFileSync(
    path.join(root, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
  console.log(`sitemap.xml (${urls.length} URLs)`);
}

(async () => {
  const files = htmlFiles();
  for (const file of files) await prerenderFile(file);
  writeSitemap(files);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
