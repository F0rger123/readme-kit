// Static preview server for banners: serves the cloned repos root on :5179.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "work");
const types = {
  ".svg": "image/svg+xml", ".html": "text/html; charset=utf-8", ".md": "text/plain; charset=utf-8",
  ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".ico": "image/x-icon", ".mp4": "video/mp4",
};

http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/") {
    const repos = fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, ".github/assets/banner.svg")));
    res.writeHead(200, { "content-type": "text/html" });
    res.end(`<body style="background:#0d1117;margin:24px;display:grid;gap:18px">${repos.map((r) => `<div><img src="/${r}/.github/assets/banner.svg" style="width:100%;max-width:1280px"><img src="/${r}/.github/assets/divider.svg" style="width:100%;max-width:1280px"></div>`).join("")}</body>`);
    return;
  }
  // /view/<repo>: render README.md roughly like GitHub (marked + mermaid) to catch diagram errors
  const view = rel.match(/^\/view\/([^/]+)$/);
  if (view) {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(`<!doctype html><meta charset="utf-8"><base href="/${view[1]}/">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.1/github-markdown-dark.css">
<body style="background:#0d1117"><article class="markdown-body" id="md" style="max-width:1012px;margin:24px auto;padding:24px"></article>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script type="module">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs";
const md = await (await fetch("README.md")).text();
const el = document.getElementById("md");
el.innerHTML = marked.parse(md);
el.querySelectorAll("code.language-mermaid").forEach((c) => { const d = document.createElement("pre"); d.className = "mermaid"; d.textContent = c.textContent; c.parentElement.replaceWith(d); });
mermaid.initialize({ startOnLoad: false, theme: "dark" });
window.mermaidErrors = [];
for (const n of document.querySelectorAll("pre.mermaid")) { try { await mermaid.run({ nodes: [n] }); } catch (e) { window.mermaidErrors.push(String(e.message || e).slice(0, 200)); } }
window.done = true;
</script>`);
    return;
  }
  // /img/<path>: show an SVG the way GitHub does, as an <img> (no scripts, no external loads)
  if (rel.startsWith("/img/")) {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(`<body style="margin:0;background:#0d1117"><img id="i" src="/${rel.slice(5)}" style="display:block;width:1280px"></body>`);
    return;
  }
  const file = path.join(root, rel);
  if (!file.startsWith(path.resolve(root)) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(5179);
