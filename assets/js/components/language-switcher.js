(function () {
  "use strict";

  window.PSDocs = window.PSDocs || {};

  // Language switcher interactions.
  window.PSDocs.initLanguageSwitcher = function initLanguageSwitcher() {
    const languageSwitchers = document.querySelectorAll(".ps-lang-switcher");
    if (!languageSwitchers.length) return;

    let comingSoonToastTimer = null;

    function showComingSoonToast(message) {
      let toast = document.querySelector(".ps-lang-coming-soon-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "ps-lang-coming-soon-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
      }

      toast.textContent = message || "Coming Soon";
      toast.classList.add("is-visible");
      if (comingSoonToastTimer) window.clearTimeout(comingSoonToastTimer);
      comingSoonToastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
      }, 1200);
    }

    function getFocusableItems(switcher) {
      return Array.from(
        switcher.querySelectorAll(".ps-lang-switcher-item[href], .ps-lang-switcher-item.disabled")
      );
    }

    languageSwitchers.forEach((switcher) => {
      switcher.addEventListener("toggle", () => {
        if (!switcher.open) return;

        languageSwitchers.forEach((otherSwitcher) => {
          if (otherSwitcher !== switcher) otherSwitcher.open = false;
        });

        const active = switcher.querySelector(".ps-lang-switcher-item.active");
        const firstItem = active || getFocusableItems(switcher)[0];
        if (firstItem && firstItem.focus) {
          window.requestAnimationFrame(() => firstItem.focus());
        }
      });

      switcher.addEventListener("keydown", (event) => {
        if (!switcher.open) return;
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

        const items = getFocusableItems(switcher);
        if (!items.length) return;

        const currentIndex = items.indexOf(document.activeElement);
        let nextIndex = currentIndex;

        if (event.key === "ArrowDown") {
          nextIndex = currentIndex < 0 ? 0 : Math.min(items.length - 1, currentIndex + 1);
        }
        if (event.key === "ArrowUp") {
          nextIndex = currentIndex < 0 ? 0 : Math.max(0, currentIndex - 1);
        }
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = items.length - 1;

        event.preventDefault();
        items[nextIndex].focus();
      });
    });

    document.addEventListener("click", (event) => {
      const disabledItem = event.target.closest(".ps-lang-switcher-item.disabled[data-coming-soon]");
      if (disabledItem) {
        event.preventDefault();
        showComingSoonToast(disabledItem.getAttribute("data-coming-soon"));
        return;
      }

      languageSwitchers.forEach((switcher) => {
        if (switcher.open && !switcher.contains(event.target)) {
          switcher.open = false;
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      languageSwitchers.forEach((switcher) => {
        switcher.open = false;
      });
    });
  };
})();
