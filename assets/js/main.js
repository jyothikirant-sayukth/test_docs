// Main script entrypoint.
(function () {
  "use strict";

  const app = window.PSDocs || {};

  app.initNavbarToggler?.();
  app.initSidebarToggler?.();
  app.initMobileNavDropdowns?.();
  app.initLanguageSwitcher?.();
  app.initCodeCopy?.();
  app.initChangelogScrollMenu?.();
})();
