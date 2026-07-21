(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------- Navbar ---------------- */
  var navbar = document.querySelector(".navbar");
  var toggle = document.querySelector(".navbar__toggle");
  var mobileMenu = document.querySelector(".navbar__mobile");

  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 80);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMobileMenu() {
    if (!mobileMenu || !toggle || !navbar) return;
    mobileMenu.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    navbar.classList.remove("is-menu-open");
  }

  if (toggle && mobileMenu && navbar) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      navbar.classList.toggle("is-menu-open", isOpen);
    });

    Array.prototype.forEach.call(
      mobileMenu.querySelectorAll("a, button"),
      function (el) {
        el.addEventListener("click", closeMobileMenu);
      }
    );
  }

  /* ---------------- Scroll reveal ---------------- */
  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    Array.prototype.forEach.call(reveals, function (el) {
      observer.observe(el);
    });
  }

  /* ---------------- Hero parallax ---------------- */
  var parallaxMedia = document.querySelector("[data-parallax]");
  if (parallaxMedia && !reduceMotion) {
    var heroEl = parallaxMedia.closest(".hero");
    var ticking = false;

    function updateParallax() {
      ticking = false;
      if (!heroEl) return;
      var rect = heroEl.getBoundingClientRect();
      var progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      parallaxMedia.style.transform = "translateY(" + progress * 20 + "%)";
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* ---------------- Footer year ---------------- */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-year]"),
    function (el) {
      el.textContent = String(new Date().getFullYear());
    }
  );
})();
