(function () {
  "use strict";

  window.PSDocs = window.PSDocs || {};

  // Sidebar toggle behavior for small screens.
  window.PSDocs.initSidebarToggler = function initSidebarToggler() {
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggleBtn = document.querySelector(".sidebar-toggler");
    const overlay = document.querySelector(".sidebar-overlay");

    overlay?.addEventListener("click", () => {
      if (sidebarToggleBtn?.classList.contains("active")) {
        sidebarToggleBtn.click();
      }
    });

    sidebarToggleBtn?.addEventListener("click", () => {
      sidebarToggleBtn.classList.toggle("active");
      sidebar?.classList.toggle("active");
    });
  };
})();
