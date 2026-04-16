// accordion script (project override)
(function () {
  "use strict";

  const accordions = document.querySelectorAll("[data-accordion]");
  accordions.forEach((header) => {
    // Sidebar accordion is controlled by custom-script.html; ignore here.
    if (header.closest("aside.sidebar")) return;

    header.addEventListener("click", () => {
      const accordionItem = header.parentElement;
      if (!accordionItem) return;
      accordionItem.classList.toggle("active");
    });
  });
})();

