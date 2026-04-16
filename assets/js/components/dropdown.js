(function () {
  "use strict";

  window.PSDocs = window.PSDocs || {};

  // Mobile top navigation dropdown toggle behavior.
  window.PSDocs.initMobileNavDropdowns = function initMobileNavDropdowns() {
    const dropdownMenuToggler = document.querySelectorAll(".nav-dropdown > .nav-link");
    dropdownMenuToggler.forEach((toggler) => {
      toggler?.addEventListener("click", (event) => {
        event.currentTarget?.parentElement?.classList.toggle("active");
      });
    });
  };
})();
