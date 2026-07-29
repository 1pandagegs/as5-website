/**
 * Category filter for the Insights index grid — same pattern as
 * js/portfolio-filter.js (single filter dimension, URL-persisted,
 * fade transition), scoped to [data-articles-grid] instead of the
 * portfolio grid. Kept as a separate small script rather than a
 * shared module, matching this codebase's existing convention of
 * not sharing logic between independent page-specific filters.
 */
(function () {
  "use strict";

  var grid = document.querySelector("[data-articles-grid]");
  if (!grid) return;

  var chips = document.querySelectorAll("[data-insights-filter] .filter-chip");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fadeDuration = reduceMotion ? 0 : 300;

  function setItemVisible(item, visible) {
    if (visible) {
      item.style.display = "";
      window.requestAnimationFrame(function () {
        item.style.opacity = "1";
      });
    } else {
      item.style.opacity = "0";
      window.setTimeout(function () {
        item.style.display = "none";
      }, fadeDuration);
    }
  }

  function applyFilter(category) {
    var items = Array.prototype.slice.call(grid.children);
    items.forEach(function (item) {
      var visible = !category || item.getAttribute("data-category") === category;
      setItemVisible(item, visible);
    });
    Array.prototype.forEach.call(chips, function (chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-filter-value") === category);
    });
  }

  var current = "";
  applyFilter(current);

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener("click", function () {
      var value = chip.getAttribute("data-filter-value");
      current = current === value ? "" : value;
      applyFilter(current);
    });
  });
})();
