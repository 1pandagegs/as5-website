/**
 * Renders window.AS5_STATISTICS (js/data/statistics.js) into any
 * [data-stat-grid] container as .stat-grid__item entries.
 */
(function () {
  "use strict";

  function renderStats(container) {
    var fragment = document.createDocumentFragment();
    window.AS5_STATISTICS.forEach(function (stat) {
      var item = document.createElement("div");
      item.className = "stat-grid__item";
      item.innerHTML =
        '<span class="text-stat">' + stat.value + "</span>" +
        '<span class="text-label-caps on-surface-variant">' + stat.label + "</span>";
      fragment.appendChild(item);
    });
    container.appendChild(fragment);
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-stat-grid]"),
    renderStats
  );
})();
