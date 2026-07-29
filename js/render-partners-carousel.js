/**
 * Renders an infinite auto-scrolling partner-logo marquee from
 * window.AS5_PARTNERS (js/data/partners.js) into every
 * [data-partners-carousel] container on the page.
 *
 * The loop/pause behavior is pure CSS (see .partner-marquee in
 * css/styles.css): this script only builds the DOM, duplicating the
 * partner list once so the CSS keyframe can scroll a continuous strip
 * and jump back unnoticed at the halfway point.
 */
(function () {
  "use strict";

  function buildLogo(partner) {
    var span = document.createElement("span");
    span.className = "partner-logo";
    span.textContent = partner.logoText || partner.name;
    if (partner.websiteUrl) {
      var link = document.createElement("a");
      link.className = "partner-logo";
      link.href = partner.websiteUrl;
      link.textContent = partner.logoText || partner.name;
      link.setAttribute("aria-label", partner.name);
      return link;
    }
    span.setAttribute("aria-label", partner.name);
    return span;
  }

  function renderCarousel(container) {
    var track = document.createElement("div");
    track.className = "partner-marquee__track";

    // Render the list twice back-to-back so the CSS animation can loop
    // seamlessly (scrolling exactly one copy's width, then resetting).
    [window.AS5_PARTNERS, window.AS5_PARTNERS].forEach(function (list) {
      list.forEach(function (partner) {
        track.appendChild(buildLogo(partner));
      });
    });

    container.classList.add("partner-marquee");
    container.appendChild(track);
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-partners-carousel]"),
    renderCarousel
  );
})();
