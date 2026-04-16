(function initDocsChat() {
  if (window.__DOCS_CHAT_LOADED__) return;
  window.__DOCS_CHAT_LOADED__ = true;

  const cfg = window.DOCS_CHAT_CONFIG || {};
  const apiUrl = normalizeApiUrl(cfg.apiUrl || "/api/chat");
  const maxMessageLength = Number(cfg.maxMessageLength || 600);

  const state = {
    loading: false,
    history: [],
  };

  function normalizeApiUrl(url) {
    let normalized = String(url || "").trim();
    if (
      (normalized.startsWith("\"") && normalized.endsWith("\"")) ||
      (normalized.startsWith("'") && normalized.endsWith("'"))
    ) {
      normalized = normalized.slice(1, -1).trim();
    }
    return normalized || "/api/chat";
  }

  function resolveNetworkErrorMessage(err) {
    const errMsg = String((err && err.message) || "").toLowerCase();
    const isFetchFailure =
      errMsg.includes("failed to fetch") || errMsg.includes("networkerror");
    if (!isFetchFailure) return "";

    const origin = window.location.origin;
    const isHttpsPage = window.location.protocol === "https:";
    const isHttpApi = /^http:\/\//i.test(apiUrl);

    if (isHttpsPage && isHttpApi) {
      return "Chat backend is HTTP but this page is HTTPS. Use an HTTPS chat API URL or proxy /api/chat on the same domain.";
    }

    return `Unable to reach chat backend (${apiUrl}). Ensure backend is running and ALLOWED_ORIGIN includes ${origin}.`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function addMessage(messagesEl, role, text, extraClass) {
    const el = document.createElement("div");
    el.className = `docs-chat-message ${role}${extraClass ? ` ${extraClass}` : ""}`;
    el.innerHTML = escapeHtml(text);
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setLoading(loadingEl, input, button, isLoading) {
    state.loading = isLoading;
    loadingEl.classList.toggle("show", isLoading);
    input.disabled = isLoading;
    button.disabled = isLoading;
  }

  function buildUi() {
    const root = document.createElement("div");
    root.className = "docs-chat-root";
    root.innerHTML = `
      <button class="docs-chat-button" aria-label="Open documentation assistant" title="Ask documentation assistant">💬</button>
      <section class="docs-chat-panel" aria-live="polite">
        <header class="docs-chat-header">
          <div>
            <p class="docs-chat-title">Documentation Assistant</p>
            <p class="docs-chat-subtitle">Answers only from this documentation</p>
          </div>
          <button class="docs-chat-close" aria-label="Close chat">×</button>
        </header>

        <div class="docs-chat-messages" role="log" aria-live="polite"></div>

        <div class="docs-chat-input-row">
          <div class="docs-chat-loading">Assistant is typing...</div>
          <form class="docs-chat-form">
            <input class="docs-chat-input" type="text" maxlength="${maxMessageLength}" placeholder="Ask a question about this documentation..." required />
            <button class="docs-chat-send" type="submit">Send</button>
          </form>
          <div class="docs-chat-counter">0/${maxMessageLength}</div>
        </div>
      </section>
    `;

    document.body.appendChild(root);

    const openBtn = root.querySelector(".docs-chat-button");
    const panel = root.querySelector(".docs-chat-panel");
    const closeBtn = root.querySelector(".docs-chat-close");
    const form = root.querySelector(".docs-chat-form");
    const input = root.querySelector(".docs-chat-input");
    const sendBtn = root.querySelector(".docs-chat-send");
    const loadingEl = root.querySelector(".docs-chat-loading");
    const messagesEl = root.querySelector(".docs-chat-messages");
    const counterEl = root.querySelector(".docs-chat-counter");

    addMessage(
      messagesEl,
      "assistant",
      "Hi, I can help with questions about this documentation."
    );

    input.addEventListener("input", function () {
      counterEl.textContent = `${input.value.length}/${maxMessageLength}`;
    });

    openBtn.addEventListener("click", function () {
      panel.classList.add("open");
      input.focus();
    });

    closeBtn.addEventListener("click", function () {
      panel.classList.remove("open");
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (state.loading) return;

      const message = input.value.trim();
      if (!message) return;

      if (message.length > maxMessageLength) {
        addMessage(
          messagesEl,
          "assistant",
          `Message too long. Maximum ${maxMessageLength} characters.`,
          "error"
        );
        return;
      }

      addMessage(messagesEl, "user", message);
      input.value = "";
      counterEl.textContent = `0/${maxMessageLength}`;
      setLoading(loadingEl, input, sendBtn, true);

      try {
        const resp = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            history: state.history,
          }),
        });

        const contentType = String(resp.headers.get("content-type") || "");
        const rawBody = await resp.text();
        let data = null;

        if (contentType.includes("application/json")) {
          try {
            data = JSON.parse(rawBody);
          } catch (_err) {
            throw new Error("Chat API returned invalid JSON.");
          }
        } else {
          throw new Error(
            "Chat API returned HTML instead of JSON. Check docsChatApiUrl and ensure backend is running."
          );
        }

        if (!resp.ok) {
          throw new Error(data && data.error ? data.error : `Request failed (${resp.status}).`);
        }

        const answer = String(data && data.answer ? data.answer : "No response.");
        addMessage(messagesEl, "assistant", answer);

        state.history.push(
          { role: "user", content: message },
          { role: "assistant", content: answer }
        );

        if (state.history.length > 16) {
          state.history = state.history.slice(-16);
        }
      } catch (err) {
        const fallbackMessage =
          "Unable to contact chat backend. Start server and verify docsChatApiUrl.";
        const networkHint = resolveNetworkErrorMessage(err);
        addMessage(
          messagesEl,
          "assistant",
          networkHint ||
          (err && err.message
            ? err.message
            : fallbackMessage),
          "error"
        );
      } finally {
        setLoading(loadingEl, input, sendBtn, false);
        input.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildUi);
  } else {
    buildUi();
  }
})();
