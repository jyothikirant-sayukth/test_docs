(function initFaqChat() {
  if (window.__FAQ_CHAT_LOADED__) return;
  window.__FAQ_CHAT_LOADED__ = true;

  const FAQS = [
    {
      question: "How do I upload backup data?",
      answer:
        "Open the menu and select Data Backup Upload. Pick the backup file, then follow the steps shown on screen until upload is complete.",
    },
    {
      question: "How do I add family member details?",
      answer:
        "Go to Household Details and tap +Add Member. Enter each member's required fields, then save. Repeat for all family members.",
    },
    {
      question: "What is Panchayat Survey App used for?",
      answer:
        "Panchayat Survey App is used to collect property and citizen details for Panchayat survey work in a structured way.",
    },
    {
      question: "How do I capture geo location?",
      answer:
        "Open Capture Geo Location, place the pin on the exact property spot, and confirm before moving to the next step.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Use Forgot Password. Enter OTP from your registered mobile/email, then set a new password and log in again.",
    },
    {
      question: "How do I log in to the app for the first time?",
      answer:
        "Open the app, enter your username and password, choose your Panchayat if prompted, and continue to the dashboard.",
    },
    {
      question: "What should I do if login fails with wrong credentials?",
      answer:
        "Recheck username and password carefully, including uppercase and lowercase. If still failing, use Forgot Password or contact support.",
    },
    {
      question: "How do I select the correct Panchayat after login?",
      answer:
        "On the Panchayat selection screen, search or choose your assigned Panchayat and confirm before starting surveys.",
    },
    {
      question: "How do I register a new user in the app?",
      answer:
        "Open Registration, fill required user details, verify with OTP, and submit. Wait for approval if your workflow requires it.",
    },
    {
      question: "Why am I not receiving OTP during registration?",
      answer:
        "Check network signal, verify registered mobile number, and retry after a short wait. If it still fails, contact helpline.",
    },
    {
      question: "How do I change app language?",
      answer:
        "Use the language selector available in the app or documentation header and pick your preferred language.",
    },
    {
      question: "What is the difference between House and Vacant Land surveys?",
      answer:
        "House survey captures building and household details, while Vacant Land survey focuses on land-specific fields and ownership details.",
    },
    {
      question: "How do I start a new House survey?",
      answer:
        "Go to Survey Properties, choose House, tap Create, complete required sections, and save each section before submission.",
    },
    {
      question: "How do I create a Trade License survey record?",
      answer:
        "Open Survey Properties, select Trade License, enter business and owner details, complete required fields, and save.",
    },
    {
      question: "How do I add an Advertisement survey?",
      answer:
        "Select Advertisement from survey types, enter board/location details, capture required fields, and save the record.",
    },
    {
      question: "How do I create Panchayat Asset Auction survey data?",
      answer:
        "Choose Panchayat Asset Auction, provide asset and bidder details, verify mandatory fields, and save the survey.",
    },
    {
      question: "How do I enter Door Locked survey details?",
      answer:
        "Select Door Locked category, capture property details available on site, mark lock status, and save for follow-up.",
    },
    {
      question: "How do I fill Panchayat Staff survey information?",
      answer:
        "Open Panchayat Staff survey, add employee-related details section by section, and save after validating required fields.",
    },
    {
      question: "How do I create a Katarusum survey?",
      answer:
        "Go to the Katarusum survey module, fill category and property details, then review and save before upload.",
    },
    {
      question: "How do I add owner details in a property survey?",
      answer:
        "Open Owner section, fill name/contact/address fields, attach required documents if needed, and save.",
    },
    {
      question: "How do I add building details for a house record?",
      answer:
        "In Building Details, add roof type, usage, measurements, and other mandatory fields, then confirm and save.",
    },
    {
      question: "How do I add household member information?",
      answer:
        "Use Household Details, tap Add Member, enter each member’s details, and save each entry.",
    },
    {
      question: "How do I edit an existing survey record?",
      answer:
        "Open survey list, search and select the record, tap Edit, update fields, and save changes.",
    },
    {
      question: "How do I delete a survey record?",
      answer:
        "Open the target record, choose Delete, confirm the action, and ensure the record is removed from the list.",
    },
    {
      question: "What are required fields and how do I find them quickly?",
      answer:
        "Required fields are mandatory for save/submit and are usually highlighted. Fill all marked fields before proceeding.",
    },
    {
      question: "Why is Save button not working in a survey form?",
      answer:
        "Usually one or more required fields are missing or invalid. Scroll through sections and complete highlighted fields.",
    },
    {
      question: "How do I capture property location with GPS?",
      answer:
        "Open location capture, allow permissions, wait for accurate GPS lock, place/confirm pin, and save coordinates.",
    },
    {
      question: "What should I do if GPS is not accurate?",
      answer:
        "Move to open sky, enable high-accuracy location, wait for better signal, then recapture and confirm pin position.",
    },
    {
      question: "How do I use GIS maps in the app?",
      answer:
        "Open GIS/Archive GIS Maps from login flow or menu, download required maps, and use them while capturing locations.",
    },
    {
      question: "How do I upload survey data to server?",
      answer:
        "Go to Upload and Backup, choose Upload, review pending records, and send data when internet is stable.",
    },
    {
      question: "How do I check failed upload records?",
      answer:
        "In Upload section, open Failed Records to view errors, correct problematic entries, and retry upload.",
    },
    {
      question: "How do I take a data backup?",
      answer:
        "Open Data Backup, create backup file, verify file creation, and store it safely before reinstall or migration.",
    },
    {
      question: "How do I upload backup file to restore data?",
      answer:
        "Use Data Backup Upload, select the backup file, confirm restore prompts, and wait for process completion.",
    },
    {
      question: "When should I use Send/Receive in backup flow?",
      answer:
        "Use Send to upload local data and Receive to pull server-side updates, based on your role and workflow stage.",
    },
    {
      question: "How do I continue an incomplete survey later?",
      answer:
        "Open saved/pending records list, select the draft entry, continue remaining sections, and save again.",
    },
    {
      question: "How do I complete survey submission after field work?",
      answer:
        "Use Complete Survey option, verify pending uploads are done, confirm checklist/OTP if required, then finalize.",
    },
    {
      question: "What does unsaved changes warning mean?",
      answer:
        "It means you modified data but did not save yet. Save changes before exiting to avoid losing updates.",
    },
    {
      question: "How do I resolve duplicate record warning?",
      answer:
        "Check existing records with similar details, edit existing entry if same property, or confirm and continue only if distinct.",
    },
    {
      question: "How do I search records quickly in list screen?",
      answer:
        "Use search box with owner name, property number, or category keywords to filter records instantly.",
    },
    {
      question: "How do I view only pending upload records?",
      answer:
        "Open records list filters and choose Pending Upload status to focus only on records that need syncing.",
    },
    {
      question: "How do I verify if record upload was successful?",
      answer:
        "Check Upload Success/Completed status in upload history and confirm record is no longer in pending list.",
    },
    {
      question: "What should I do when app shows connection lost?",
      answer:
        "Save local progress, move to stable network, then retry upload/sync. Do not uninstall before taking backup.",
    },
    {
      question: "Can I work offline in Panchayat Survey App?",
      answer:
        "Yes, you can collect data offline. Upload/sync actions require internet, so push data when network is available.",
    },
    {
      question: "How do I contact support from the app flow?",
      answer:
        "Use Helpline/Support section in documentation or app menu to get support contact and issue reporting steps.",
    },
    {
      question: "What is the role of Survey Executive?",
      answer:
        "Survey Executive usually performs field data collection, form filling, and uploading records assigned by management.",
    },
    {
      question: "What is the role of Field Inspector?",
      answer:
        "Field Inspector typically verifies survey quality, validates entries, and flags corrections where needed.",
    },
    {
      question: "What is the role of Panchayat Secretary in workflow?",
      answer:
        "Panchayat Secretary generally reviews and oversees official survey data and administrative approvals.",
    },
    {
      question: "How do I understand basic survey terminology?",
      answer:
        "Check Basic Details and Terminology pages in documentation for definitions used across all survey modules.",
    },
    {
      question: "Where can I find user manuals and videos?",
      answer:
        "Open User Manuals section in docs to access step-by-step guides and videos for key app processes.",
    },
    {
      question: "How do I check terms and conditions quickly?",
      answer:
        "Open Terms and Conditions section from docs/pages menu to review policy and usage terms.",
    },
    {
      question: "Where is privacy policy available?",
      answer:
        "Go to Pages -> Privacy Policy in documentation to read data handling and privacy statements.",
    },
    {
      question: "How do I logout safely without losing data?",
      answer:
        "Save current form, ensure pending changes are stored, then use Logout option from menu.",
    },
    {
      question: "How do I reopen recently created survey entries?",
      answer:
        "Navigate to the relevant survey list screen, sort/filter by latest, and open the required record.",
    },
    {
      question: "What should I check before final upload?",
      answer:
        "Verify mandatory fields, location capture, attachments, and status of each section before upload.",
    },
    {
      question: "How do I fix records stuck in failed state?",
      answer:
        "Open failed list, read error reason, correct data/network issue, save record again, and retry upload.",
    },
    {
      question: "Can I update location after saving survey?",
      answer:
        "Yes, reopen the record in edit mode, recapture or update geo location, and save changes.",
    },
    {
      question: "How do I know which module to choose for a property?",
      answer:
        "Pick the survey module that matches the property type: House, Vacant Land, Trade License, Advertisement, etc.",
    },
    {
      question: "How do I handle app permissions alerts?",
      answer:
        "Grant required permissions like location/storage/camera in device settings, then reopen the app and retry.",
    },
    {
      question: "How do I report an issue with screenshot evidence?",
      answer:
        "Capture screenshot, note record ID and issue steps, then share details through support/helpline channel.",
    },
    {
      question: "How can I learn complete app flow step by step?",
      answer:
        "Start from Getting Started docs, then follow Basic Details, Survey Properties, Upload/Backup, and Complete Survey sections.",
    },
  ];

  function addStylesheet() {
    if (document.getElementById("faq-chat-css")) return;
    const link = document.createElement("link");
    link.id = "faq-chat-css";
    link.rel = "stylesheet";
    link.href = "/css/faq-chat.css";
    document.head.appendChild(link);
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function simplifyText(text) {
    return String(text || "")
      .replace(/\bmandatory\b/gi, "required")
      .replace(/\bverify\b/gi, "check")
      .replace(/\bproceed\b/gi, "continue")
      .replace(/\bprompted\b/gi, "asked")
      .replace(/\bworkflow\b/gi, "process")
      .replace(/\bvalidate\b/gi, "check")
      .replace(/\bsync(ing)?\b/gi, "upload")
      .replace(/\s+/g, " ")
      .trim();
  }

  function capitalize(text) {
    const t = String(text || "").trim();
    if (!t) return "";
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function splitParts(text) {
    return String(text || "")
      .split(/[.?!,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function buildDetailedPoints(faq) {
    const q = String(faq?.question || "").toLowerCase().trim();
    const answer = simplifyText(faq?.answer || "");
    const parts = splitParts(answer);
    const first = parts[0] || answer;
    const rest = parts.slice(1);

    const points = [];

    if (q.startsWith("what") || q.startsWith("why")) {
      points.push(`Meaning: ${capitalize(first)}.`);
      if (rest[0]) points.push(`In simple terms: ${capitalize(rest[0])}.`);
      if (rest[1]) points.push(`What to do: ${capitalize(rest[1])}.`);
      if (!rest.length) points.push("What to do: Follow this section step by step in the app and save after each section.");
      points.push("Tip: If you are unsure, open the related module in docs and follow screenshots in order.");
      return points.slice(0, 5);
    }

    points.push(`Step 1: ${capitalize(first)}.`);
    if (rest[0]) points.push(`Step 2: ${capitalize(rest[0])}.`);
    if (rest[1]) points.push(`Step 3: ${capitalize(rest[1])}.`);
    if (rest[2]) points.push(`Step 4: ${capitalize(rest[2])}.`);

    const safetyHint =
      q.includes("upload") || q.includes("backup") || q.includes("sync")
        ? "Before finish: Check internet is stable and review failed records, if any."
        : q.includes("gps") || q.includes("location") || q.includes("map")
        ? "Before finish: Confirm pin is correct and location accuracy is acceptable."
        : "Before finish: Check required fields are filled, then save.";
    points.push(safetyHint);

    return points.slice(0, 6);
  }

  function toPointList(answer) {
    const cleaned = simplifyText(answer).replace(/\s+/g, " ").trim();
    if (!cleaned) return [];

    const points = [];
    const sentences = cleaned
      .split(/[.?!]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    sentences.forEach((sentence) => {
      if (sentence.length > 90 && sentence.includes(",")) {
        sentence
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean)
          .forEach((part) => points.push(part));
      } else {
        points.push(sentence);
      }
    });

    return points
      .map((p) => p.replace(/^\+/, "").trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  function buildUi() {
    const root = document.createElement("div");
    root.className = "faq-chat-root faq-fab-root";
    root.innerHTML = `
      <div class="faq-fab-wrap">
        <div class="faq-fab-menu" role="menu" aria-label="Assistant tools">
          <button type="button" class="faq-fab-tool" data-tool="ask-ai" role="menuitem">Ask AI</button>
          <button type="button" class="faq-fab-tool" data-tool="summary" role="menuitem">Summary</button>
          <button type="button" class="faq-fab-tool" data-tool="read-page" role="menuitem">Read This Page</button>
          <button type="button" class="faq-fab-tool" data-tool="faq" role="menuitem">FAQ</button>
        </div>
        <button class="faq-fab-trigger" aria-label="Open assistant tools" aria-expanded="false" title="Assistant Tools">FAQ's</button>
      </div>
      <section class="faq-assistant-panel" aria-live="polite" hidden>
        <div class="faq-assistant-header">
          <span class="faq-assistant-title">Ask AI</span>
          <button class="faq-assistant-close" aria-label="Close assistant panel">×</button>
        </div>
        <div class="faq-assistant-content">
          <div class="faq-tool-view is-active" data-view="ask-ai">
            <label class="faq-tool-label" for="faq-ai-input">Ask AI</label>
            <input id="faq-ai-input" class="faq-tool-input" type="text" placeholder="Ask something about this page..." />
            <p class="faq-tool-note">AI backend will be connected later.</p>
          </div>

          <div class="faq-tool-view" data-view="summary">
            <label class="faq-tool-label">Summary</label>
            <div class="faq-tool-card faq-summary-card" data-summary-output>
              Click <strong>Summary</strong> to generate this page summary.
            </div>
          </div>

          <div class="faq-tool-view" data-view="read-page">
            <label class="faq-tool-label">Read This Page</label>
            <div class="faq-tool-actions">
              <button type="button" class="faq-tool-btn" data-action="read-start">Start Reading</button>
              <button type="button" class="faq-tool-btn faq-tool-btn-secondary" data-action="read-stop">Stop</button>
            </div>
            <p class="faq-tool-note" data-read-status>Ready to read page content.</p>
          </div>

          <div class="faq-tool-view" data-view="faq">
            <label class="faq-tool-label">Frequently Asked Questions</label>
            <ol class="faq-tool-list">
              <li>How does this feature work?</li>
              <li>What data is collected?</li>
              <li>How do I submit a survey?</li>
            </ol>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(root);

    const triggerBtn = root.querySelector(".faq-fab-trigger");
    const menuButtons = Array.from(root.querySelectorAll(".faq-fab-tool"));
    const panel = root.querySelector(".faq-assistant-panel");
    const panelTitle = root.querySelector(".faq-assistant-title");
    const panelCloseBtn = root.querySelector(".faq-assistant-close");
    const toolViews = Array.from(root.querySelectorAll(".faq-tool-view"));
    const aiInput = root.querySelector("#faq-ai-input");
    const summaryOutput = root.querySelector("[data-summary-output]");
    const readStatus = root.querySelector("[data-read-status]");
    const readStartBtn = root.querySelector('[data-action="read-start"]');
    const readStopBtn = root.querySelector('[data-action="read-stop"]');

    let activeUtterance = null;

    function closeMenu() {
      root.classList.remove("menu-open");
      triggerBtn.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
      const nextOpen = !root.classList.contains("menu-open");
      root.classList.toggle("menu-open", nextOpen);
      triggerBtn.setAttribute("aria-expanded", String(nextOpen));
    }

    function setActiveTool(toolKey) {
      const map = {
        "ask-ai": "Ask AI",
        summary: "Summary",
        "read-page": "Read This Page",
        faq: "FAQ",
      };

      panelTitle.textContent = map[toolKey] || "Assistant";
      toolViews.forEach((view) => {
        const isCurrent = view.getAttribute("data-view") === toolKey;
        view.classList.toggle("is-active", isCurrent);
      });
    }

    function openToolPanel(toolKey) {
      setActiveTool(toolKey);
      panel.hidden = false;
      panel.classList.add("open");
      closeMenu();
      if (toolKey === "summary") {
        renderSummaryForCurrentPage();
      }
      if (toolKey === "ask-ai") {
        aiInput?.focus();
      }
    }

    function closeToolPanel() {
      panel.classList.remove("open");
      panel.hidden = true;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      activeUtterance = null;
      if (readStatus) {
        readStatus.textContent = "Ready to read page content.";
      }
    }

    function getMainArticleText() {
      const article = document.querySelector("article.content");
      if (!article) return "";
      const text = String(article.innerText || article.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
      return text;
    }

    function pickTop(list, max = 3) {
      return list.filter(Boolean).slice(0, max);
    }

    function shortSentence(text, maxWords = 24) {
      const words = String(text || "")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean);
      if (!words.length) return "";
      if (words.length <= maxWords) return words.join(" ");
      return `${words.slice(0, maxWords).join(" ")}...`;
    }

    function toSimpleLanguage(text) {
      return String(text || "")
        .replace(/\bapplication\b/gi, "app")
        .replace(/\bspecifically\b/gi, "mainly")
        .replace(/\bcomprehensive\b/gi, "complete")
        .replace(/\battributes\b/gi, "details")
        .replace(/\bcharacteristics\b/gi, "information")
        .replace(/\bverify\b/gi, "check")
        .replace(/\bproceed\b/gi, "go ahead")
        .replace(/\butilize\b/gi, "use")
        .replace(/\s+/g, " ")
        .trim();
    }

    function isEnglishPage() {
      const htmlLang = String(document.documentElement?.lang || "")
        .toLowerCase()
        .trim();
      const path = String(window.location.pathname || "").toLowerCase();
      if (htmlLang && htmlLang !== "en" && !htmlLang.startsWith("en-")) return false;
      if (/\/(hi|ta|te)(\/|$)/.test(path)) return false;
      return true;
    }

    function getCurrentArticleData() {
      const article = document.querySelector("article.content");
      if (!article) return null;

      const title = String(article.querySelector("h1")?.textContent || document.title || "This page")
        .replace(/\s+/g, " ")
        .trim();

      const sectionTitles = Array.from(article.querySelectorAll("h2, h3, h4"))
        .map((n) => String(n.textContent || "").replace(/\s+/g, " ").trim())
        .filter(Boolean);

      const paragraphs = Array.from(article.querySelectorAll("p"))
        .map((n) => String(n.textContent || "").replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 40);

      const listItems = Array.from(article.querySelectorAll("li"))
        .map((n) => String(n.textContent || "").replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 15);

      return { title, sectionTitles, paragraphs, listItems };
    }

    function buildSummarySteps(data) {
      if (!data) return [];
      const steps = [];
      const intro = pickTop(data.paragraphs, 1)[0];
      const sections = pickTop(data.sectionTitles, 3);
      const actions = pickTop(data.listItems, 3);

      steps.push({
        title: "Step 1: What this page is about",
        text: toSimpleLanguage(shortSentence(intro || `${data.title} explains the main process and what you should do.`)),
      });

      if (sections.length) {
        steps.push({
          title: "Step 2: Main topics covered",
          text: toSimpleLanguage(sections.join(" -> ")),
        });
      }

      if (actions.length) {
        steps.push({
          title: "Step 3: What you need to do",
          text: toSimpleLanguage(actions.map((a, i) => `${i + 1}) ${shortSentence(a, 14)}`).join("  ")),
        });
      } else {
        const fallback = pickTop(data.paragraphs.slice(1), 1)[0] || intro || "";
        steps.push({
          title: "Step 3: Key action",
          text: toSimpleLanguage(shortSentence(fallback || "Follow the page instructions from top to bottom and complete each section.")),
        });
      }

      steps.push({
        title: "Step 4: Quick tip",
        text: "Complete one section at a time, save often, and cross-check required fields before moving forward.",
      });

      return steps;
    }

    function renderSummaryForCurrentPage() {
      if (!summaryOutput) return;
      if (!isEnglishPage()) {
        summaryOutput.innerHTML = `<p class="faq-summary-empty">Summary is currently available for English pages only. Please switch language to English.</p>`;
        return;
      }
      const data = getCurrentArticleData();
      if (!data) {
        summaryOutput.innerHTML = `<p class="faq-summary-empty">I could not find article content on this page.</p>`;
        return;
      }

      const steps = buildSummarySteps(data);
      const stepHtml = steps
        .map(
          (step) => `
            <li class="faq-summary-step">
              <h4>${step.title}</h4>
              <p>${step.text}</p>
            </li>
          `,
        )
        .join("");

      summaryOutput.innerHTML = `
        <div class="faq-summary-head">Simple summary for: <strong>${data.title}</strong></div>
        <ol class="faq-summary-list">${stepHtml}</ol>
      `;
    }

    function startReadingPage() {
      if (!readStatus) return;
      if (!("speechSynthesis" in window)) {
        readStatus.textContent = "Text-to-speech is not supported in this browser.";
        return;
      }

      const content = getMainArticleText();
      if (!content) {
        readStatus.textContent = "No readable page content found.";
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = function () {
        readStatus.textContent = "Reading this page...";
      };
      utterance.onend = function () {
        readStatus.textContent = "Finished reading.";
        activeUtterance = null;
      };
      utterance.onerror = function () {
        readStatus.textContent = "Unable to read this page right now.";
        activeUtterance = null;
      };
      activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }

    function stopReadingPage() {
      if (!readStatus) return;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      activeUtterance = null;
      readStatus.textContent = "Reading stopped.";
    }

    triggerBtn.addEventListener("click", function () {
      toggleMenu();
    });

    menuButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        openToolPanel(String(btn.getAttribute("data-tool") || "ask-ai"));
      });
    });

    panelCloseBtn.addEventListener("click", function () {
      closeToolPanel();
    });

    readStartBtn?.addEventListener("click", startReadingPage);
    readStopBtn?.addEventListener("click", stopReadingPage);

    document.addEventListener("click", function (event) {
      if (!root.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        if (!panel.hidden) {
          closeToolPanel();
        }
      }
    });
  }

  addStylesheet();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUi);
  } else {
    buildUi();
  }
})();
