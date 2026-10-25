// Secret scanner that never prints secret values: only file, line, rule, length and a placeholder guess.
// Usage: node scan-secrets.mjs <reposRoot>
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
const RULES = [
  ["google-api-key", /AIza[0-9A-Za-z_-]{35}/g],
  ["openai-key", /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/g],
  ["anthropic-key", /sk-ant-[A-Za-z0-9_-]{20,}/g],
  ["openrouter-key", /sk-or-v1-[a-f0-9]{40,}/g],
  ["github-token", /gh[pousr]_[A-Za-z0-9]{30,}/g],
  ["resend-key", /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{10,}/g],
  ["stripe-secret", /\b[sr]k_(?:live|test)_[A-Za-z0-9]{16,}/g],
  ["slack-token", /xox[baprs]-[A-Za-z0-9-]{10,}/g],
  ["aws-access-key", /AKIA[0-9A-Z]{16}/g],
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["jwt", /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g],
  ["twilio-sid", /\bAC[a-f0-9]{32}\b/g],
  ["gmail-app-password", /(?:app[_-]?password|smtp[_-]?pass(?:word)?)["'\s:=]+[a-z]{4}\s?[a-z]{4}\s?[a-z]{4}\s?[a-z]{4}/gi],
  ["generic-assignment", /(?:secret|password|passwd|api[_-]?key|token)["']?\s*[:=]\s*["'][^"'\s]{12,}["']/gi],
];
const SKIP_DIRS = new Set([".git", "node_modules", "dist", "build", ".gradle", "release", "DesignSource"]);
const PLACEHOLDER = /(your|xxx|example|placeholder|changeme|dummy|<|\.\.\.|test_?key|REPLACE)/i;

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (fs.statSync(p).size < 3_000_000) yield p;
  }
}

for (const repo of fs.readdirSync(root)) {
  const dir = path.join(root, repo);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of walk(dir)) {
    let text;
    try { text = fs.readFileSync(file, "utf8"); } catch { continue; }
    if (text.includes("\u0000")) continue;
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const [rule, re] of RULES) {
        for (const m of line.matchAll(re)) {
          const v = m[0];
          // JWTs: report the role claim only (anon keys are publishable by design)
          let note = "";
          if (rule === "jwt") {
            try { note = "role=" + JSON.parse(Buffer.from(v.split(".")[1], "base64url").toString()).role; } catch { note = "role=?"; }
          }
          const ph = PLACEHOLDER.test(v) || PLACEHOLDER.test(line.slice(Math.max(0, m.index - 30), m.index)) ? "placeholder?" : "LIKELY-REAL";
          console.log(`${path.relative(root, file)}:${i + 1}\t${rule}\tlen=${v.length}\t${ph}\t${note}`);
        }
      }
    });
  }
}
