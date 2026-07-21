(function () {
  "use strict";

  function setUpCarousel(root) {
    var track = root.querySelector(".carousel__track");
    var prev = root.querySelector(".carousel__arrow--prev");
    var next = root.querySelector(".carousel__arrow--next");
    var dotsWrap = root.querySelector(".carousel__dots");
    if (!track) return;

    var items = Array.prototype.slice.call(track.children);
    var dots = [];

    if (dotsWrap) {
      items.forEach(function (_, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel__dot";
        dot.setAttribute("aria-label", "Go to slide " + (index + 1));
        dot.addEventListener("click", function () {
          items[index].scrollIntoView({
            behavior: "smooth",
            inline: "start",
            block: "nearest",
          });
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function updateActiveDot() {
      if (!dots.length) return;
      var trackRect = track.getBoundingClientRect();
      var closestIndex = 0;
      var closestDistance = Infinity;
      items.forEach(function (item, index) {
        var rect = item.getBoundingClientRect();
        var distance = Math.abs(rect.left - trackRect.left);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle("is-active", index === closestIndex);
      });
    }

    function scrollByAmount(direction) {
      var amount = track.clientWidth * 0.8 * direction;
      track.scrollBy({ left: amount, behavior: "smooth" });
    }

    if (prev) prev.addEventListener("click", function () { scrollByAmount(-1); });
    if (next) next.addEventListener("click", function () { scrollByAmount(1); });

    track.addEventListener(
      "scroll",
      function () {
        window.clearTimeout(track._scrollTimeout);
        track._scrollTimeout = window.setTimeout(updateActiveDot, 100);
      },
      { passive: true }
    );

    updateActiveDot();
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-carousel]"),
    setUpCarousel
  );
})();
