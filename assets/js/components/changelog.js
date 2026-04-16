(function () {
  "use strict";

  window.PSDocs = window.PSDocs || {};

  // Initializes changelog in-page scroll menu.
  window.PSDocs.initChangelogScrollMenu = function initChangelogScrollMenu() {
    const changelogLink = document.querySelector(".changelog-link a");
    if (!changelogLink) return;

    new ScrollMenu(".changelog-link a", {
      duration: 50,
      activeOffset: 110,
      scrollOffset: 105,
    });
  };
})();
