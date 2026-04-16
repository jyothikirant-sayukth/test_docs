(function () {
  "use strict";

  window.PSDocs = window.PSDocs || {};

  // Adds copy buttons to markdown code blocks.
  window.PSDocs.initCodeCopy = function initCodeCopy() {
    const blocks = document.querySelectorAll("pre");

    async function copyCode(block, button) {
      const code = block.querySelector("code");
      const text = code?.innerText || "";
      await navigator.clipboard.writeText(text);
      button.innerText = "copied";
      setTimeout(() => {
        button.innerText = "copy";
      }, 700);
    }

    blocks.forEach((block) => {
      if (!navigator.clipboard) return;

      const button = document.createElement("span");
      button.innerText = "copy";
      button.className = "copy";
      block.appendChild(button);
      button.addEventListener("click", async () => {
        await copyCode(block, button);
      });
    });
  };
})();
