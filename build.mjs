// Builds README.md, LICENSE and .github/assets/{banner,divider}.svg for each repo.
// Usage: node build.mjs <reposRoot> <langsFile> [repoName...]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { THEMES, themedDivider } from "./themes.mjs";
import { DATA } from "./data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const [reposRoot, langsFile, ...only] = process.argv.slice(2);
const config = JSON.parse(fs.readFileSync(path.join(DATA, "repos.json"), "utf8"));
const OWNER = "F0rger123";
const YEAR = 2026;

const langs = Object.fromEntries(
  fs.readFileSync(langsFile, "utf8").trim().split(/\r?\n/).map((line) => {
    const [name, list = ""] = line.split(" ");
    const pairs = list ? list.split(",").map((p) => p.split("=")).map(([k, v]) => [k, Number(v)]) : [];
    return [name, pairs];
  }),
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const hex = (c) => c.replace("#", "");

// ---------- SVG banner ----------
function polygon(cx, cy, r, sides, rot = 0) {
  if (!sides) return null;
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const t = rot + (Math.PI * 2 * i) / sides - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function banner(repo, c, isPrivate) {
  const W = 1280, H = 340;
  const sq = !!c.square;
  const rx = sq ? 0 : 20;
  const titleSize = Math.min(88, Math.floor(860 / (c.title.length * 0.62)));
  const sides = c.sides;
  const cx = 1085, cy = 196;

  // emblem: concentric wireframe polygons (or rings), counter-rotating
  const rings = [96, 70, 44].map((r, i) => {
    const shape = sides
      ? `<polygon points="${polygon(cx, cy, r, sides, i * 0.35)}" fill="none" stroke="url(#acc)" stroke-width="${i === 0 ? 2 : 1.25}" stroke-opacity="${0.9 - i * 0.22}"/>`
      : `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.35}" ry="${r * 0.55}" fill="none" stroke="url(#acc)" stroke-width="${i === 0 ? 2 : 1.25}" stroke-opacity="${0.9 - i * 0.22}"/>`;
    return `<g class="spin${i % 2 ? " rev" : ""}" style="transform-origin:${cx}px ${cy}px;animation-duration:${28 + i * 10}s">${shape}</g>`;
  }).join("\n    ");

  // stack chips
  let x = 64;
  const chips = c.chips.map((label) => {
    const w = Math.round(label.length * 8.6 + 28);
    const g = `<g transform="translate(${x},262)"><rect width="${w}" height="30" rx="${sq ? 0 : 15}" fill="${c.a}" fill-opacity=".08" stroke="${c.a}" stroke-opacity=".45"/><text x="${w / 2}" y="20" text-anchor="middle" class="mono" font-size="13" fill="#e7e7ee">${esc(label)}</text></g>`;
    x += w + 10;
    return g;
  }).join("\n    ");

  const status = `${isPrivate ? "PRIVATE" : "PUBLIC"} · ${c.license === "proprietary" ? "ALL RIGHTS RESERVED" : "MIT"}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.title)}: ${esc(c.tagline)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07070b"/><stop offset="1" stop-color="#11121c"/></linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient>
    <linearGradient id="ttl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient>
    <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.a}" stop-opacity="0"/><stop offset=".5" stop-color="${c.a}" stop-opacity=".9"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></linearGradient>
    <radialGradient id="ga"><stop offset="0" stop-color="${c.a}" stop-opacity=".42"/><stop offset="1" stop-color="${c.a}" stop-opacity="0"/></radialGradient>
    <radialGradient id="gb"><stop offset="0" stop-color="${c.b}" stop-opacity=".34"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#ffffff" stroke-opacity=".045"/></pattern>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="${rx}"/></clipPath>
  </defs>
  <style>
    .sans{font-family:"Segoe UI","Inter","Helvetica Neue",Arial,sans-serif}
    .mono{font-family:"JetBrains Mono","Cascadia Code",Consolas,"SFMono-Regular",Menlo,monospace}
    .spin{animation:spin linear infinite}.rev{animation-direction:reverse}
    .orb{animation:drift 16s ease-in-out infinite alternate}.orb2{animation:drift2 20s ease-in-out infinite alternate}
    .scan{animation:scan 7s linear infinite}.blink{animation:blink 1.1s steps(1) infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes drift{to{transform:translate(140px,40px)}}
    @keyframes drift2{to{transform:translate(-160px,-30px)}}
    @keyframes scan{from{transform:translateX(-500px)}to{transform:translateX(1500px)}}
    @keyframes blink{50%{opacity:0}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important}}
  </style>
  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <circle class="orb" cx="260" cy="40" r="300" fill="url(#ga)"/>
    <circle class="orb2" cx="1050" cy="320" r="320" fill="url(#gb)"/>
    ${rings}
    <circle cx="${cx}" cy="${cy}" r="5" fill="${c.a}"/>
    <text x="64" y="70" class="mono" font-size="14" letter-spacing="3" fill="${c.a}">◆ ${esc(OWNER.toUpperCase())} / ${esc(repo)}</text>
    <text x="${W - 64}" y="70" text-anchor="end" class="mono" font-size="12" letter-spacing="2" fill="#9a9aa8">${status}</text>
    <text x="64" y="${120 + titleSize * 0.62}" class="sans" font-size="${titleSize}" font-weight="800" letter-spacing="-2" fill="url(#ttl)">${esc(c.title)}</text>
    <text x="64" y="${150 + titleSize * 0.62 + 12}" class="mono" font-size="19" fill="#c9c9d6">${esc(c.tagline)}<tspan class="blink" fill="${c.a}"> ▍</tspan></text>
    ${chips}
    <text x="${W - 64}" y="${H - 34}" text-anchor="end" class="mono" font-size="12" letter-spacing="3" fill="#6e6e7c">${esc(c.code)}</text>
    <rect class="scan" x="0" y="${H - 3}" width="420" height="3" fill="url(#scan)"/>
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="${rx}" fill="none" stroke="url(#acc)" stroke-opacity=".35"/>
</svg>
`;
}

function divider(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="14" viewBox="0 0 1280 14" role="presentation">
  <defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.a}" stop-opacity="0"/><stop offset=".5" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></linearGradient></defs>
  <style>.p{animation:p 4s ease-in-out infinite alternate}@keyframes p{from{opacity:.35}to{opacity:1}}@media (prefers-reduced-motion:reduce){.p{animation:none}}</style>
  <rect class="p" x="0" y="6" width="1280" height="2" fill="url(#d)"/>
  <circle cx="640" cy="7" r="4" fill="${c.a}"/>
</svg>
`;
}

// ---------- badges ----------
const LOGOS = {
  "next.js": ["Next.js", "nextdotjs"], "supabase": ["Supabase", "supabase"], "cloudflare": ["Cloudflare", "cloudflare"],
  "typescript": ["TypeScript", "typescript"], "react": ["React", "react"], "kotlin": ["Kotlin", "kotlin"],
  "python": ["Python", "python"], "postgres": ["PostgreSQL", "postgresql"], "tailwind": ["Tailwind", "tailwindcss"],
  "vite": ["Vite", "vite"], "expo": ["Expo", "expo"], "electron": ["Electron", "electron"], "android": ["Android", "android"],
  "dotnet": [".NET 8", "dotnet"], "csharp": ["C%23", "sharp"], "gemini": ["Gemini", "googlegemini"], "claude": ["Claude", "claude"],
  "firebase": ["Firebase", "firebase"], "node": ["Node.js", "nodedotjs"], "githubactions": ["GitHub Actions", "githubactions"],
  "chrome": ["Chrome MV3", "googlechrome"], "html": ["HTML5", "html5"], "css": ["CSS3", "css"], "js": ["JavaScript", "javascript"],
  "java": ["Java", "openjdk"], "compose": ["Jetpack Compose", "jetpackcompose"], "capacitor": ["Capacitor", "capacitor"],
  "drizzle": ["Drizzle", "drizzle"], "docker": ["Docker", "docker"], "gcloud": ["Cloud Run", "googlecloud"], "windows": ["Windows", "windows11"],
  "openai": ["OpenAI API", "openai"], "leaflet": ["Leaflet", "leaflet"], "zustand": ["Zustand", "react"], "stripe": ["Stripe", "stripe"],
  "vitest": ["Vitest", "vitest"], "playwright": ["Playwright", "playwright"], "gmail": ["Gmail", "gmail"], "buffer": ["Buffer", "buffer"],
};

function badges(repo, c, isPrivate, stack) {
  const color = c.badge || hex(c.a === "#ffffff" ? "#121212" : c.a);
  const out = [];
  out.push(`<img src="https://img.shields.io/badge/status-${isPrivate ? "private" : "public"}-${isPrivate ? "555555" : color}?style=for-the-badge" alt="${isPrivate ? "Private" : "Public"}">`);
  out.push(`<img src="https://img.shields.io/badge/license-${c.license === "proprietary" ? "proprietary-555555" : "MIT-" + color}?style=for-the-badge" alt="License">`);
  if (!isPrivate) {
    out.push(`<img src="https://img.shields.io/github/last-commit/${OWNER}/${repo}?style=for-the-badge&color=${color}" alt="Last commit">`);
    out.push(`<img src="https://img.shields.io/github/repo-size/${OWNER}/${repo}?style=for-the-badge&color=${color}" alt="Repo size">`);
  }
  const line2 = stack.map((k) => {
    const [label, logo] = LOGOS[k] || [k, ""];
    return `<img src="https://img.shields.io/badge/${encodeURIComponent(label).replace(/-/g, "--")}-0d1117?style=flat-square&logo=${logo}&logoColor=white" alt="${label.replace("%23", "#")}">`;
  });
  return `<p align="center">\n  ${out.join("\n  ")}\n</p>\n<p align="center">\n  ${line2.join("\n  ")}\n</p>`;
}

// ---------- language pie ----------
function langPie(repo, c) {
  const pairs = langs[repo] || [];
  const total = pairs.reduce((s, [, v]) => s + v, 0);
  if (!total) return "";
  const rows = [];
  let other = 0;
  for (const [k, v] of pairs.sort((a, b) => b[1] - a[1])) {
    const pct = (100 * v) / total;
    if (pct < 1.5) other += pct; else rows.push([k, pct]);
  }
  if (other >= 0.1) rows.push(["Other", other]);
  const palette = [c.a === "#ffffff" ? "#e5e5e5" : c.a, c.b, "#64748b", "#94a3b8", "#475569", "#cbd5e1", "#334155"];
  const vars = palette.map((p, i) => `'pie${i + 1}':'${p}'`).join(",");
  return [
    "```mermaid",
    `%%{init: {'theme':'base','themeVariables':{${vars},'pieStrokeColor':'#0d1117','pieOuterStrokeColor':'#0d1117','pieTitleTextColor':'#8b949e','pieLegendTextColor':'#8b949e','pieSectionTextColor':'#0d1117'}}}%%`,
    "pie title Share of the code, by language",
    ...rows.map(([k, p]) => `    "${k}" : ${p.toFixed(1)}`),
    "```",
  ].join("\n");
}

// ---------- licenses ----------
const MIT = (extra = "") => `MIT License

Copyright (c) ${YEAR} ${OWNER}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
${extra}`;

// MIT for the code, with brand assets (photos, logos, names) excluded. Set "assetsOwner" in repos.json.
const MIT_ASSETS = (owner) => MIT(`
---

Exclusion: the MIT License above covers the source code only. Photographs,
logos, business names and other brand assets in assets/ belong to
${owner || "their respective owner"} and are not licensed for reuse.
`);

const PROPRIETARY = `Copyright (c) ${YEAR} ${OWNER}. All rights reserved.

This repository and all of its contents, including source code, designs,
documentation, database schemas and assets, are proprietary and confidential.

No license, express or implied, is granted to any person to use, copy, modify,
merge, publish, distribute, sublicense or sell any part of this repository
without the prior written permission of the copyright holder.

Access to this repository does not grant any rights beyond those explicitly
agreed in writing with the copyright holder.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED.
`;

// ---------- assemble ----------
// Each repo's README from before the kit took over lives in originals/<repo>.md (shown under "Field manual").
function originalBody(repo, strip) {
  const p = path.join(DATA, "originals", `${repo}.md`);
  if (!fs.existsSync(p)) return "";
  let text = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
  if (strip) for (const re of strip) text = text.replace(new RegExp(re, "m"), "");
  return text.trim();
}

// GitHub heading anchors: lowercase, drop punctuation (keeps letters, numbers, spaces, hyphens), spaces -> hyphens.
const slug = (h) => h.trim().toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "").replace(/ /g, "-");

// {{NAV}}: a centered link row built from the README's own "## " headings (skipping the field manual's inner ones).
function nav(md) {
  const top = md.split(/^## 📚 Field manual|^## Field manual/m)[0];
  const heads = [...top.matchAll(/^## (.+)$/gm)].map((m) => m[1]).filter((h) => !/license/i.test(h));
  const label = (h) => h.replace(/^[^\p{L}\p{N}]+/u, "").replace(/^\d+\s*[·/—-]\s*/, "");
  const links = [...heads, ...[...md.matchAll(/^## (.*(?:Field manual|License).*)$/gm)].map((m) => m[1])];
  return `<p align="center">\n${links.map((h) => `  <a href="#${slug(h)}">${label(h)}</a>`).join(" ·\n")}\n</p>`;
}

// Give every Mermaid block the repo's brand palette (unless it sets its own init).
function brandMermaid(md, c) {
  if (!c.mermaid) return md;
  const m = c.mermaid;
  const vars = { primaryColor: m.fill, primaryTextColor: m.text, primaryBorderColor: m.border, lineColor: m.line, secondaryColor: m.fill2 || m.fill, tertiaryColor: m.fill3 || m.fill, clusterBkg: m.cluster || "transparent", clusterBorder: m.border, noteBkgColor: m.fill2 || m.fill, noteTextColor: m.text, actorBkg: m.fill, actorTextColor: m.text, actorBorder: m.border, signalColor: m.line, signalTextColor: m.line, labelBoxBkgColor: m.fill, fontFamily: m.font || "inherit" };
  const init = `%%{init: {'theme':'base','themeVariables':${JSON.stringify(vars).replace(/"/g, "'")}}}%%`;
  return md.replace(/```mermaid\n(?!%%\{init)/g, "```mermaid\n" + init + "\n");
}

const guidePathsFile = path.join(DATA, "guide-paths.json");
const guidePaths = fs.existsSync(guidePathsFile) ? JSON.parse(fs.readFileSync(guidePathsFile, "utf8")) : {};

const visibility = JSON.parse(fs.readFileSync(path.join(DATA, "visibility.json"), "utf8"));
const names = only.length ? only : Object.keys(config);
for (const repo of names) {
  const c = config[repo];
  const dir = path.join(reposRoot, repo);
  const srcPath = path.join(DATA, "readmes", `${repo}.md`);
  if (!fs.existsSync(srcPath)) { console.log(`skip ${repo}: no readmes/${repo}.md`); continue; }
  const isPrivate = visibility[repo] === "PRIVATE";
  // Normalise Windows line endings so every regex below sees plain newlines
  let src = fs.readFileSync(srcPath, "utf8").replace(/\r\n/g, "\n");

  // front matter: first line "<!-- stack: a,b,c | strip: regex;;regex -->"
  const fm = src.match(/^<!--\s*stack:\s*([^|]*?)\s*(?:\|\s*strip:\s*(.*?))?\s*-->\r?\n/);
  const stack = fm ? fm[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
  const strip = fm && fm[2] ? fm[2].split(";;") : null;
  if (fm) src = src.slice(fm[0].length);

  const original = src.includes("{{ORIGINAL}}") ? originalBody(repo, strip) : "";
  const licenseLine = c.license === "proprietary"
    ? `Proprietary. © ${YEAR} ${OWNER}. All rights reserved. See [\`LICENSE\`](LICENSE).`
    : c.license === "mit-assets"
      ? `Code released under the [MIT License](LICENSE). Photos, logos and brand assets belong to ${c.assetsOwner || "their owner"} and are **not** covered.`
      : `Released under the [MIT License](LICENSE). Use it, fork it, ship it.`;

  const alt = `${esc(c.title)}: ${esc(c.tagline)}`;
  // Themes that draw a separate dark-mode banner set "darkBanner": true in repos.json
  const bannerTag = c.darkBanner
    ? `<picture>\n    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner-dark.svg">\n    <img src=".github/assets/banner.svg" alt="${alt}" width="100%">\n  </picture>`
    : `<img src=".github/assets/banner.svg" alt="${alt}" width="100%">`;
  const header = `<p align="center">\n  ${bannerTag}\n</p>\n\n${badges(repo, c, isPrivate, stack)}`;
  const div = `<p align="center"><img src=".github/assets/divider.svg" width="100%" alt=""></p>`;
  const footer = `${div}\n\n<p align="center">\n  <sub>Built by <a href="https://github.com/${OWNER}"><b>@${OWNER}</b></a> · ${c.license === "proprietary" ? "Proprietary" : "MIT licensed"}</sub>\n</p>`;

  const out = src
    .replaceAll("{{HEADER}}", header)
    .replaceAll("{{DIVIDER}}", div)
    .replaceAll("{{LANGS}}", langPie(repo, c))
    .replaceAll("{{LICENSE}}", licenseLine)
    .replaceAll("{{ORIGINAL}}", original)
    .replaceAll("{{FOOTER}}", footer)
    .replace(/\n{3,}/g, "\n\n");
  let final = brandMermaid(out.replaceAll("{{NAV}}", nav(out)), c);
  // "AI agents: start here" block, right after the nav row (or after the badges when there is none)
  const guide = guidePaths[repo];
  if (guide) {
    const rawUrl = (p) => `https://raw.githubusercontent.com/${OWNER}/${repo}/main/${p}`;
    const block = `> [!TIP]\n> **🤖 Pasted this link into Claude or ChatGPT?** AI assistants: read [\`${guide}\`](${rawUrl(guide)}) first. It explains what this is in plain words, which questions to ask, and how to set it up step by step.${fs.existsSync(path.join(dir, "llms.txt")) ? ` Plain-text index: [\`llms.txt\`](${rawUrl("llms.txt")}).` : ""}\n`;
    const anchor = final.indexOf("\n</p>\n", final.indexOf('<a href="#'));
    const navEnd = anchor > 0 && final.indexOf('<a href="#') < final.indexOf("## ") ? anchor + 6 : final.indexOf("\n## ") + 1;
    final = final.slice(0, navEnd) + "\n" + block + "\n" + final.slice(navEnd);
  }

  const assets = path.join(dir, ".github", "assets");
  fs.mkdirSync(assets, { recursive: true });
  if (c.theme) {
    fs.writeFileSync(path.join(assets, "banner.svg"), THEMES[c.theme](c, { isPrivate, dark: false }));
    if (c.darkBanner) fs.writeFileSync(path.join(assets, "banner-dark.svg"), THEMES[c.theme](c, { isPrivate, dark: true }));
    fs.writeFileSync(path.join(assets, "divider.svg"), themedDivider(c));
  } else {
    fs.writeFileSync(path.join(assets, "banner.svg"), banner(repo, c, isPrivate));
    fs.writeFileSync(path.join(assets, "divider.svg"), divider(c));
  }
  fs.writeFileSync(path.join(dir, "README.md"), final.trimEnd() + "\n");
  const lic = path.join(dir, "LICENSE");
  if (!fs.existsSync(lic)) fs.writeFileSync(lic, c.license === "proprietary" ? PROPRIETARY : c.license === "mit-assets" ? MIT_ASSETS(c.assetsOwner) : MIT());
  console.log(`built ${repo}`);
}
