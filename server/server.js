const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  buildDocumentIndex,
  rankRelevantDocs,
  createContextFromDocs,
} = require("./docs-loader");

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || 3001);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_API_VERSION = process.env.GEMINI_API_VERSION || "v1";
const DOCS_CONTENT_DIR = process.env.DOCS_CONTENT_DIR || "../content";
const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 600);
const MAX_HISTORY_MESSAGES = Number(process.env.MAX_HISTORY_MESSAGES || 8);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const BLOCKED_REPLY =
  "Sorry, I can only answer questions related to this documentation.";

const SYSTEM_PROMPT = [
  "You are an AI assistant for a documentation website.",
  "Only answer questions related to this documentation context.",
  "If a user asks something unrelated, reply exactly: Sorry, I can only answer questions related to this documentation.",
  "If answer is unknown from context, say that clearly and suggest where to look in docs.",
  "Keep responses concise, practical, and documentation-focused.",
].join(" ");

if (!GEMINI_API_KEY) {
  console.warn("[WARN] GEMINI_API_KEY is missing. Set it in server/.env");
}

const docIndex = buildDocumentIndex({
  contentDir: path.resolve(__dirname, DOCS_CONTENT_DIR),
});

const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    docsIndexed: docIndex.totalDocs,
    docsIndexedAt: docIndex.builtAt,
  });
});

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item && item.role === "assistant" ? "assistant" : "user",
      content: String(item && item.content ? item.content : "").slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content.trim().length > 0);
}

function isLikelyDocsQuestion(message) {
  const ranked = rankRelevantDocs({
    query: message,
    docs: docIndex.docs,
    limit: 4,
  });

  if (!ranked.length) return { relevant: false, ranked: [] };

  const topScore = ranked[0].score;
  return {
    relevant: topScore >= 0.12,
    ranked,
  };
}

async function callGemini({ question, history, context }) {
  const preferredVersions = [GEMINI_API_VERSION, "v1", "v1beta"].filter(Boolean);
  const versions = [...new Set(preferredVersions)];
  const preferredModels = [
    GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro-latest",
  ].filter(Boolean);
  const models = [...new Set(preferredModels)];

  const formattedHistory = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const userPrompt = [
    "Follow these assistant rules:",
    SYSTEM_PROMPT,
    "Documentation context starts below.",
    context,
    "Documentation context ends above.",
    `User question: ${question}`,
  ].join("\n\n");

  const payload = {
    contents: [...formattedHistory, { role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 700,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_ONLY_HIGH",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_ONLY_HIGH",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_ONLY_HIGH",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH",
      },
    ],
  };

  let lastError = null;

  for (const version of versions) {
    for (const model of models) {
      const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const answer =
          data?.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("\n")
            .trim() || "";

        return (
          answer ||
          "I could not find a clear answer in the documentation."
        );
      }

      const text = await response.text();
      let parsed = null;

      try {
        parsed = JSON.parse(text);
      } catch (_err) {
        parsed = null;
      }

      const apiError = parsed?.error || {};
      const reason =
        apiError?.details?.find((detail) => detail?.reason)?.reason || apiError?.status || "";
      const providerMessage = String(apiError?.message || "").trim();

      const err = new Error(providerMessage || `Gemini API error ${response.status}`);
      err.httpStatus = response.status;
      err.code = reason;
      err.providerMessage = providerMessage;
      err.providerRaw = text;
      err.modelTried = model;
      err.apiVersionTried = version;
      lastError = err;

      // For model-not-found we try the next candidate. For any other error, fail immediately.
      if (response.status !== 404 && reason !== "NOT_FOUND") {
        throw err;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error("Unable to reach Gemini API.");
}

app.post("/api/chat", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Server is not configured. Missing GEMINI_API_KEY.",
      });
    }

    const message = String(req.body?.message || "").trim();
    const history = sanitizeHistory(req.body?.history);

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    const relevance = isLikelyDocsQuestion(message);
    if (!relevance.relevant) {
      return res.json({
        answer: BLOCKED_REPLY,
        blocked: true,
      });
    }

    const context = createContextFromDocs(relevance.ranked, 10000);
    const answer = await callGemini({
      question: message,
      history,
      context,
    });

    return res.json({
      answer,
      blocked: false,
      sources: relevance.ranked.map((doc) => doc.source),
    });
  } catch (error) {
    console.error("/api/chat error:", error);

    if (error?.code === "API_KEY_INVALID") {
      return res.status(500).json({
        error:
          "Invalid GEMINI_API_KEY in server/.env. Replace it with a valid Gemini API key and restart the backend.",
      });
    }

    if (error?.code === "PERMISSION_DENIED" || error?.httpStatus === 403) {
      return res.status(502).json({
        error:
          "Gemini API access denied. Ensure the API key has access to Generative Language API.",
      });
    }

    if (error?.code === "RESOURCE_EXHAUSTED" || error?.httpStatus === 429) {
      return res.status(502).json({
        error: "Gemini API quota exceeded. Check billing/quota and try again.",
      });
    }

    if (error?.code === "NOT_FOUND" || error?.httpStatus === 404) {
      return res.status(502).json({
        error:
          "No compatible Gemini model found for this API key. Set GEMINI_MODEL in server/.env (for example: gemini-2.0-flash) and restart backend.",
      });
    }

    return res.status(500).json({
      error: "Something went wrong while processing the request.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`[docs-chat] Server running on http://localhost:${PORT}`);
  console.log(`[docs-chat] Indexed docs: ${docIndex.totalDocs}`);
});
