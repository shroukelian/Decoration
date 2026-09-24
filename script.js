(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero swatch field ---------- */
  var field = document.getElementById("swatchField");
  var palette = [
    "#B08D57", "#1E1A16", "#8A4A2B", "#2B2520",
    "#CBA76C", "#3A322A", "#6E5236", "#1E1A16"
  ];

  if (field) {
    var cells = 16;
    for (var i = 0; i < cells; i++) {
      var span = document.createElement("span");
      var color = palette[i % palette.length];
      span.style.background = color;
      field.appendChild(span);
    }
  }

  function runHeroSequence() {
    if (!field) return;
    var swatches = field.querySelectorAll("span");

    if (reduceMotion) {
      swatches.forEach(function (s) { s.style.transform = "scale(1)"; });
      return;
    }

    swatches.forEach(function (s, i) {
      var delay = Math.random() * 500;
      setTimeout(function () {
        s.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
        s.style.transform = "scale(1)";
      }, delay);
    });

    // after swatches settle, wipe the headline lines in, then fade the rest
    var wipeLines = document.querySelectorAll("[data-wipe]");
    wipeLines.forEach(function (el, i) {
      setTimeout(function () {
        el.style.transition = "clip-path .9s cubic-bezier(.2,.8,.2,1)";
        el.style.clipPath = "inset(0 0 0 0)";
      }, 550 + i * 260);
    });

    var sub = document.querySelector(".hero-sub");
    var actions = document.querySelector(".hero-actions");
    setTimeout(function () {
      [sub, actions].forEach(function (el) {
        if (!el) return;
        el.style.transition = "opacity .7s ease";
        el.style.opacity = "1";
      });
    }, 550 + wipeLines.length * 260 + 150);
  }

  if (document.readyState === "complete") {
    runHeroSequence();
  } else {
    window.addEventListener("load", runHeroSequence);
  }

  /* ---------- Service list reveal (line draws under each row) ---------- */
  var serviceItems = document.querySelectorAll(".service-item");
  if ("IntersectionObserver" in window && serviceItems.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    serviceItems.forEach(function (item) { io.observe(item); });
  } else {
    serviceItems.forEach(function (item) { item.classList.add("in-view"); });
  }

  /* ---------- Gallery grid staggered reveal ---------- */
  var galleryGrid = document.querySelector(".gallery-grid");
  if (galleryGrid) {
    var galleryItems = galleryGrid.querySelectorAll(".gallery-item");
    if (!reduceMotion) {
      galleryItems.forEach(function (item) {
        item.style.opacity = "0";
        item.style.transform = "scale(0.94)";
      });
    }
    if ("IntersectionObserver" in window && !reduceMotion) {
      var galleryIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              galleryItems.forEach(function (item, i) {
                setTimeout(function () {
                  item.style.transition = "opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1)";
                  item.style.opacity = "1";
                  item.style.transform = "scale(1)";
                }, i * 70);
              });
              galleryIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      galleryIo.observe(galleryGrid);
    } else {
      galleryItems.forEach(function (item) {
        item.style.opacity = "1";
        item.style.transform = "scale(1)";
      });
    }
  }
  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("nav-open");
      navToggle.classList.toggle("is-active", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("nav-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();