(function () {
  "use strict";

  var grid = document.querySelector("[data-portfolio-grid]");
  if (!grid) return;

  // Cards are prerendered into the HTML (scripts/prerender.js); the filter
  // controls stay hidden until this script can make them work.
  var items = Array.prototype.slice.call(grid.querySelectorAll(".project-card"));
  var chips = document.querySelectorAll(".filter-chip");
  var controls = document.querySelector("[data-filter-controls]");
  if (controls) controls.hidden = false;
  var emptyState = document.querySelector("[data-portfolio-empty]");
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var fadeDuration = reduceMotion ? 0 : 300;

  function getFiltersFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return {
      status: params.get("status") || "",
      category: params.get("category") || "",
    };
  }

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

  function applyFilters(filters) {
    var visibleCount = 0;

    items.forEach(function (item) {
      var matchesStatus =
        !filters.status || item.getAttribute("data-status") === filters.status;
      var matchesCategory =
        !filters.category || item.getAttribute("data-category") === filters.category;
      var visible = matchesStatus && matchesCategory;
      if (visible) visibleCount += 1;
      setItemVisible(item, visible);
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    Array.prototype.forEach.call(chips, function (chip) {
      var group = chip.getAttribute("data-filter-group");
      var value = chip.getAttribute("data-filter-value");
      var active = filters[group] === value;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
  }

  function updateUrl(filters) {
    var params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.category) params.set("category", filters.category);
    var query = params.toString();
    var newUrl = window.location.pathname + (query ? "?" + query : "");
    window.history.replaceState(null, "", newUrl);
  }

  var currentFilters = getFiltersFromUrl();
  applyFilters(currentFilters);

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener("click", function () {
      var group = chip.getAttribute("data-filter-group");
      var value = chip.getAttribute("data-filter-value");
      currentFilters[group] = currentFilters[group] === value ? "" : value;
      applyFilters(currentFilters);
      updateUrl(currentFilters);
    });
  });
})();
