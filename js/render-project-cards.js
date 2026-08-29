/**
 * Renders .project-card elements from window.AS5_PROJECTS (js/data/projects.js)
 * into designated containers, so the same card markup/data isn't hand-duplicated
 * across the portfolio grid, the homepage featured section, and every project
 * page's "related projects" block.
 *
 * Must run (and finish appending cards) before js/portfolio-filter.js reads
 * the grid's children — load order in <script defer> tags matters:
 *   data/projects.js -> render-project-cards.js -> portfolio-filter.js
 */
(function () {
  "use strict";

  var STATUS_LABELS = {
    completed: "Completed",
    "in-progress": "In Progress",
    "concept-approved": "Concept Approved",
    awarded: "Awarded",
    partnership: "Partnership",
  };

  function el(html) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    return wrapper.firstElementChild;
  }

  function buildCard(project, opts) {
    opts = opts || {};
    var showMeta = opts.showMeta !== false;
    var showDescription = opts.showDescription !== false;
    var linkLabel = opts.linkLabel || "View Specification →";
    var href = "/portfolio/" + project.slug + "/";
    var statusLabel = STATUS_LABELS[project.status] || project.status;

    var metaHtml = showMeta
      ? '<div class="project-card__meta">' +
        '<span class="text-label-caps">' + project.type + "</span>" +
        '<span class="text-label-caps">' + project.location + "</span>" +
        '<span class="text-label-caps">' + project.year + "</span>" +
        "</div>"
      : "";

    var descHtml = showDescription
      ? '<p class="text-body-md on-surface-variant">' + project.tagline + "</p>"
      : "";

    var wideClass = opts.wide ? " project-card--wide" : "";
    var card = el(
      '<article class="project-card' + wideClass + '" data-status="' + project.status + '" data-category="' + project.category + '">' +
        '<a href="' + href + '" class="project-card__media">' +
          '<img src="' + project.heroImage + '" alt="' + project.title + ' — ' + project.tagline + '"' + (project.fallbackImage ? ' onerror="this.onerror=null;this.src=\'' + project.fallbackImage + '\'"' : '') + ' />' +
          '<span class="project-card__badge text-label-caps">' + statusLabel + "</span>" +
        "</a>" +
        '<div class="flex-col gap-2">' +
          metaHtml +
          '<h3 class="text-headline-md"><a href="' + href + '">' + project.title + "</a></h3>" +
          descHtml +
          '<a href="' + href + '" class="text-label-caps project-card__link">' + linkLabel + "</a>" +
        "</div>" +
      "</article>"
    );

    return card;
  }

  function renderInto(container, projects, opts) {
    if (!container) return;
    var wideIndices = opts.wideIndices || [];
    var fragment = document.createDocumentFragment();
    projects.forEach(function (project, index) {
      var cardOpts = opts;
      if (wideIndices.indexOf(index) !== -1) {
        cardOpts = Object.create(opts);
        cardOpts.wide = true;
      }
      fragment.appendChild(buildCard(project, cardOpts));
    });
    container.appendChild(fragment);
  }

  function renderProjectGrid(container) {
    if (!container) return;
    var projects = window.AS5_PROJECTS;
    var visibleCategories = (container.getAttribute("data-visible-categories") || "")
      .split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (visibleCategories.length) {
      projects = projects.filter(function (project) {
        return visibleCategories.indexOf(project.category) !== -1;
      });
    }
    renderInto(container, projects, {
      showMeta: true,
      showDescription: true,
      linkLabel: "View Specification →",
      // A wider first card and one mid-page featured partnership card
      // breaks up the grid so it doesn't read as a flat catalogue.
      wideIndices: [0, 6],
    });
  }

  function renderFeaturedProjects(container, slugs) {
    if (!container) return;
    var bySlug = {};
    window.AS5_PROJECTS.forEach(function (project) {
      bySlug[project.slug] = project;
    });
    var picked = slugs.map(function (slug) { return bySlug[slug]; }).filter(Boolean);
    renderInto(container, picked, {
      showMeta: true,
      showDescription: true,
      linkLabel: "View Project →",
    });
  }

  function renderRelatedProjects(container, currentSlug, count) {
    if (!container) return;
    count = count || 3;
    var all = window.AS5_PROJECTS.filter(function (p) { return p.slug !== currentSlug; });
    var current = window.AS5_PROJECTS.filter(function (p) { return p.slug === currentSlug; })[0];
    var sameCategory = current
      ? all.filter(function (p) { return p.category === current.category; })
      : all;
    var pool = sameCategory.length >= count ? sameCategory : all;
    var picked = pool.slice(0, count);
    renderInto(container, picked, {
      showMeta: false,
      showDescription: false,
      linkLabel: "View Project →",
    });
  }

  // Auto-wire declarative containers present on the page.
  var grid = document.querySelector("[data-project-grid]");
  if (grid) renderProjectGrid(grid);

  var featured = document.querySelector("[data-featured-projects]");
  if (featured) {
    var slugsAttr = featured.getAttribute("data-featured-projects");
    var slugs = slugsAttr
      ? slugsAttr.split(",").map(function (s) { return s.trim(); })
      : window.AS5_PROJECTS.slice(0, 4).map(function (p) { return p.slug; });
    renderFeaturedProjects(featured, slugs);
  }

  var related = document.querySelector("[data-related-projects]");
  if (related) {
    renderRelatedProjects(related, related.getAttribute("data-related-projects"), 3);
  }
})();
