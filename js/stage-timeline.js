/**
 * Restrained click-to-reveal timeline component. Each [data-stage-timeline]
 * root contains a row of [data-stage] buttons (numbered stage triggers) and
 * a single [data-stage-detail-text] panel that shows the active stage's
 * description, read from the button's data-description attribute.
 */
(function () {
  "use strict";

  function setupTimeline(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll("[data-stage]"));
    var detailText = root.querySelector("[data-stage-detail-text]");
    if (!items.length || !detailText) return;

    function activate(item) {
      items.forEach(function (i) {
        i.classList.toggle("is-active", i === item);
      });
      detailText.textContent = item.getAttribute("data-description") || "";
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        activate(item);
      });
    });

    activate(items[0]);
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-stage-timeline]"),
    setupTimeline
  );
})();
