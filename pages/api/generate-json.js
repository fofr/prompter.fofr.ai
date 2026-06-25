import { callLists } from "./_all-lists";

// Resolve a single token's inner text, e.g. "art.style" or "art.style, 2".
// Mirrors the semantics of pages/api/generate.js: optional count (default 1,
// capped at 50), "[random]" picks from a random list, unknown lists return null.
const resolveToken = (inner) => {
  const parts = inner.split(",");
  const listName = parts[0].trim();
  let count = parts.length >= 2 ? parseInt(parts[1], 10) : 1;
  if (isNaN(count)) count = 1;
  count = Math.min(Math.max(count, 1), 50);

  if (listName === "random") {
    const names = Object.keys(callLists);
    const picks = [];
    for (let i = 0; i < count; i++) {
      const rnd = names[Math.floor(Math.random() * names.length)];
      picks.push(callLists[rnd](1).join(", "));
    }
    return picks.join(", ");
  }

  if (!callLists[listName]) return null;
  return callLists[listName](count).join(", ");
};

const jsonEscape = (str) =>
  String(str)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");

// A token bracket holds "category.list", "category.list, N", or "random[, N]".
// Anything else (e.g. a real JSON array like ["a", "b"]) is left untouched.
const TOKEN_RE = /^(?:[a-zA-Z][\w]*\.[\w]+|random)(?:\s*,\s*\d+)?$/;

// Walk the template tracking JSON string state, replacing [tokens]:
//   - inside a string -> interpolated in place (escaped)
//   - bare (value position) -> a quoted JSON string of the resolved value
// Returns resolved JSON text (still needs JSON.parse to validate).
const resolveTemplate = (template) => {
  let out = "";
  let inString = false;

  for (let i = 0; i < template.length; i++) {
    const ch = template[i];

    if (inString) {
      if (ch === "\\") {
        out += ch + (template[i + 1] ?? "");
        i++;
        continue;
      }
      if (ch === '"') {
        inString = false;
        out += ch;
        continue;
      }
      if (ch === "[") {
        const end = template.indexOf("]", i);
        if (end !== -1) {
          const inner = template.slice(i + 1, end).trim();
          if (TOKEN_RE.test(inner)) {
            const resolved = resolveToken(inner);
            out += jsonEscape(resolved === null ? `[${inner}]` : resolved);
            i = end;
            continue;
          }
        }
      }
      out += ch;
      continue;
    }

    // Outside a string.
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === "[") {
      const end = template.indexOf("]", i);
      if (end !== -1) {
        const inner = template.slice(i + 1, end).trim();
        if (TOKEN_RE.test(inner)) {
          const resolved = resolveToken(inner);
          out += '"' + jsonEscape(resolved === null ? `[${inner}]` : resolved) + '"';
          i = end;
          continue;
        }
      }
      // Not a token — a real JSON array. Emit "[" and keep scanning so any
      // bare tokens nested inside become their own JSON strings.
    }
    out += ch;
  }

  return out;
};

export default function handler(req, res) {
  const isPost = req.method === "POST";
  if (!isPost && req.method !== "GET") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const template = isPost ? req.body.template : req.query.template;
  let count = (isPost ? req.body.count : req.query.count) || 1;
  count = Math.min(Math.max(parseInt(count, 10) || 1, 1), 100);

  if (!template || !String(template).trim()) {
    return res.status(400).json({ error: "No template provided" });
  }

  // Validate the structure once; resolved tokens vary but the JSON shape doesn't.
  const sample = resolveTemplate(template);
  try {
    JSON.parse(sample);
  } catch (e) {
    return res.status(200).json({
      error: `Template doesn't resolve to valid JSON: ${e.message}`,
      output: sample,
    });
  }

  const prompts = [];
  for (let i = 0; i < count; i++) {
    prompts.push(JSON.parse(resolveTemplate(template)));
  }
  return res.status(200).json({ prompts });
}
