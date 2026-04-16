(function () {
  "use strict";

  window.PSDocs = window.PSDocs || {};

  // Navbar toggle behavior for small screens.
  window.PSDocs.initNavbarToggler = function initNavbarToggler() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarMenu = document.querySelector(".navbar-wrapper");
    navbarToggler?.addEventListener("click", () => {
      navbarToggler.classList.toggle("active");
      navbarMenu?.classList.toggle("active");
    });
  };
})();
