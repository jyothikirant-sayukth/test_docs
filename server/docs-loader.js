const fs = require("fs");
const path = require("path");

const DOC_EXTENSIONS = new Set([".md", ".markdown", ".mdx"]);
const FRONT_MATTER_REGEX = /^---\n[\s\S]*?\n---\n?/;

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#+>*_~=|\\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMarkdown(raw) {
  return String(raw || "")
    .replace(FRONT_MATTER_REGEX, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^[#>\-*\d.\s]+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function walkDir(rootDir) {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (DOC_EXTENSIONS.has(ext)) files.push(fullPath);
  }

  return files;
}

function tokenize(text) {
  return normalizeText(text)
    .split(" ")
    .filter((token) => token.length > 2);
}

function buildDocumentIndex({ contentDir }) {
  const absoluteDir = path.resolve(contentDir);

  if (!fs.existsSync(absoluteDir)) {
    throw new Error(`Docs content directory not found: ${absoluteDir}`);
  }

  const files = walkDir(absoluteDir);
  const docs = files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf8");
      const cleaned = cleanMarkdown(raw);
      if (!cleaned) return null;

      const rel = path.relative(absoluteDir, filePath).replace(/\\/g, "/");
      const tokenSet = new Set(tokenize(cleaned));
      return {
        id: rel,
        source: rel,
        text: cleaned,
        tokenSet,
      };
    })
    .filter(Boolean);

  return {
    docs,
    totalDocs: docs.length,
    builtAt: new Date().toISOString(),
  };
}

function rankRelevantDocs({ query, docs, limit = 4 }) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const scored = docs
    .map((doc) => {
      let overlap = 0;
      for (const token of queryTokens) {
        if (doc.tokenSet.has(token)) overlap += 1;
      }
      const score = overlap / Math.max(queryTokens.length, 1);
      return {
        ...doc,
        score,
      };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

function createContextFromDocs(docs, maxChars = 10000) {
  let used = 0;
  const chunks = [];

  for (const doc of docs) {
    const header = `Source: ${doc.source}\n`;
    const bodyLimit = Math.max(200, Math.min(2600, maxChars - used - header.length));
    if (bodyLimit <= 0) break;

    const body = doc.text.slice(0, bodyLimit);
    const chunk = `${header}${body}\n`;

    if (used + chunk.length > maxChars) break;

    chunks.push(chunk);
    used += chunk.length;
  }

  return chunks.join("\n---\n");
}

module.exports = {
  buildDocumentIndex,
  rankRelevantDocs,
  createContextFromDocs,
};
