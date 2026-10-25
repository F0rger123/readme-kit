// Writes the AI-agent guide for each repo and records where it lives (guide-paths.json) so build.mjs
// can add the README "AI agents: start here" block.
// - No AGENTS.md yet: the guide becomes AGENTS.md.
// - AGENTS.md already holds developer rules: the guide goes to docs/AI_GUIDE.md and AGENTS.md gets a
//   "0. First thing" section pointing to it (once).
// - Repos with an existing setup wizard keep it; they only get llms.txt and the README block.
// - keepAgents: AGENTS.md must stay byte-identical to CLAUDE.md (a repo check enforces it), so only docs/AI_GUIDE.md is written.
// Usage: node agents.mjs <reposRoot>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DATA } from "./data.mjs";
import { COMMON_NEVER } from "./never.mjs";

const { GUIDES } = await import(pathToFileURL(path.join(DATA, "guides.mjs")).href);

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.argv[2];
const OWNER = "F0rger123";
const raw = (repo, p) => `https://raw.githubusercontent.com/${OWNER}/${repo}/main/${p}`;
const out = {};

function render(repo, g, hasClaude) {
  const L = [];
  L.push(`# AI guide: ${repo}`, "");
  L.push(`**For AI assistants (Claude, ChatGPT, Codex, Cursor, Gemini).** Someone gave you a link to this repository. Use this page to explain it, set it up, or help them use it. Talk in plain English; the person may not be technical.`, "");
  L.push("## What this is", "", g.what, "", `**Usually used by:** ${g.who}`, "");
  if (g.ask?.length) L.push("## Ask first", "", "Ask these together in one short message, then repeat back what you heard in a line or two. Skip anything they already told you.", "", ...g.ask.map((q) => `- ${q}`), "");
  if (g.setup?.length) {
    L.push("## Set it up", "", "Do one step at a time. Check each one worked before moving on.", "", "| # | Do this | It worked if |", "|---|---|---|");
    g.setup.forEach(([d, c], i) => L.push(`| ${i + 1} | ${d} | ${c} |`));
    L.push("");
  }
  if (g.use?.length) L.push("## Use it", "", ...g.use.map((u) => `- ${u}`), "");
  if (g.how?.length) L.push("## How it works, in plain words", "", ...g.how.map((h, i) => `${i + 1}. ${h}`), "");
  L.push("## Never", "", ...[...COMMON_NEVER, ...(g.never || [])].map((n) => `- ${n}`), "");
  const docs = [...(g.docs || [])];
  if (hasClaude) docs.unshift(["Rules for coding agents", "CLAUDE.md"]);
  if (docs.length) L.push("## Read next", "", ...docs.map(([l, p]) => `- [${l}](${p})`), "");
  L.push("## When you're done", "", "Tell the person, in a few lines: what is set up and checked, what isn't yet, and two or three things they can ask you next.", "");
  return L.join("\n");
}

function llms(repo, g, guidePath) {
  const lines = [`# ${repo}`, "", `> ${g.what}`, "", "If a person shared this repository with you, read the AI guide first.", "", "## Start here", `- [AI guide](${raw(repo, guidePath)}): what it is, what to ask, setup steps, how to use it`, `- [README](${raw(repo, "README.md")})`];
  for (const [l, p] of g.docs || []) lines.push(`- [${l}](${raw(repo, p)})`);
  return lines.join("\n") + "\n";
}

for (const [repo, g] of Object.entries(GUIDES)) {
  const dir = path.join(root, repo);
  if (!fs.existsSync(dir)) continue;
  const agents = path.join(dir, "AGENTS.md");
  const hasClaude = fs.existsSync(path.join(dir, "CLAUDE.md"));
  let guidePath;
  if (g.wizard) {
    guidePath = g.wizard;
  } else if (fs.existsSync(agents) && !fs.readFileSync(agents, "utf8").startsWith("# AI guide:")) {
    // AGENTS.md was written by a person (developer rules): keep it and put the guide beside it
    guidePath = "docs/AI_GUIDE.md";
    fs.mkdirSync(path.join(dir, "docs"), { recursive: true });
    fs.writeFileSync(path.join(dir, guidePath), render(repo, g, hasClaude));
    let a = fs.readFileSync(agents, "utf8");
    if (!g.keepAgents && !/AI_GUIDE\.md/.test(a)) {
      const section = `## 0. First thing\n\nSomeone pasted this repo's link and asked what it is or how to set it up? Follow [\`docs/AI_GUIDE.md\`](docs/AI_GUIDE.md): what it is in plain words, what to ask, setup steps with checks. The rules below still apply.\n\n`;
      const i = a.search(/^## /m);
      a = i >= 0 ? a.slice(0, i) + section + a.slice(i) : a + "\n" + section;
      fs.writeFileSync(agents, a);
    }
  } else {
    guidePath = "AGENTS.md";
    fs.writeFileSync(agents, render(repo, g, hasClaude));
  }
  const llmsPath = path.join(dir, "llms.txt");
  if (!g.noLlms && !fs.existsSync(llmsPath)) fs.writeFileSync(llmsPath, llms(repo, g, guidePath));
  out[repo] = guidePath;
  console.log(`${repo}: guide at ${guidePath}`);
}
// Merge, so a run with only some repos cloned keeps the others' entries.
const pathsFile = path.join(DATA, "guide-paths.json");
const prev = fs.existsSync(pathsFile) ? JSON.parse(fs.readFileSync(pathsFile, "utf8")) : {};
fs.writeFileSync(pathsFile, JSON.stringify({ ...prev, ...out }, null, 1));
