/**
 * Renders window.AS5_ARTICLES (js/data/articles.js) into:
 *   [data-articles-teaser]  — 3 non-featured cards (homepage teaser)
 *   [data-articles-grid]    — featured card + remaining grid (Insights index)
 */
(function () {
  "use strict";

  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function formatDate(iso) {
    var parts = iso.split("-");
    var year = parts[0];
    var month = MONTHS[parseInt(parts[1], 10) - 1];
    return month + " " + year;
  }

  function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, "-");
  }

  function buildCard(article, opts) {
    opts = opts || {};
    var featured = !!opts.featured;
    var href = "/insights/" + article.slug + "/";
    var wrapper = document.createElement("article");
    wrapper.className = featured ? "insight-card insight-card--featured" : "insight-card";
    wrapper.setAttribute("data-category", slugify(article.category));
    wrapper.innerHTML =
      '<a href="' + href + '" class="insight-card__media">' +
        '<img src="' + article.heroImage + '" alt="' + article.title + '" />' +
      "</a>" +
      '<div class="flex-col gap-2">' +
        '<div class="project-card__meta">' +
          '<span class="text-label-caps">' + article.category + "</span>" +
          '<span class="text-label-caps">' + formatDate(article.date) + "</span>" +
        "</div>" +
        '<h3 class="text-headline-md"><a href="' + href + '">' + article.title + "</a></h3>" +
        '<p class="text-body-md on-surface-variant">' + article.excerpt + "</p>" +
        '<a href="' + href + '" class="text-label-caps project-card__link">Read Article →</a>' +
      "</div>";
    return wrapper;
  }

  function renderTeaser(container) {
    var picked = window.AS5_ARTICLES.filter(function (a) { return !a.featured; }).slice(0, 3);
    var fragment = document.createDocumentFragment();
    picked.forEach(function (article) {
      fragment.appendChild(buildCard(article, { featured: false }));
    });
    container.appendChild(fragment);
  }

  function renderIndexGrid(container) {
    var featuredArticle = window.AS5_ARTICLES.filter(function (a) { return a.featured; })[0];
    var rest = window.AS5_ARTICLES.filter(function (a) { return a !== featuredArticle; });
    var fragment = document.createDocumentFragment();
    if (featuredArticle) fragment.appendChild(buildCard(featuredArticle, { featured: true }));
    rest.forEach(function (article) {
      fragment.appendChild(buildCard(article, { featured: false }));
    });
    container.appendChild(fragment);
  }

  function renderRelated(container, currentSlug, count) {
    count = count || 3;
    var picked = window.AS5_ARTICLES
      .filter(function (a) { return a.slug !== currentSlug; })
      .slice(0, count);
    var fragment = document.createDocumentFragment();
    picked.forEach(function (article) {
      fragment.appendChild(buildCard(article, { featured: false }));
    });
    container.appendChild(fragment);
  }

  var teaser = document.querySelector("[data-articles-teaser]");
  if (teaser) renderTeaser(teaser);

  var grid = document.querySelector("[data-articles-grid]");
  if (grid) renderIndexGrid(grid);

  var related = document.querySelector("[data-related-articles]");
  if (related) renderRelated(related, related.getAttribute("data-related-articles"), 3);
})();
