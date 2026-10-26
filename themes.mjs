// Brand-matched banner themes. Each theme mirrors the real app's UI: its colors, fonts and signature motifs.
// Fonts are embedded as base64 woff2 so GitHub (which renders SVG as an image) shows the real typeface.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const FONT_DIR = process.env.RDM_FONTS || path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "fonts");
const FILES = {
  geist: "geist-800.woff2", geistmono: "geist-mono-500.woff2", schibsted: "schibsted-800.woff2", plexmono: "plexmono-600.woff2",
  bebas: "bebas-400.woff2", cormorant: "cormorant-700.woff2", lora: "lora-500.woff2", fraunces: "fraunces-700.woff2",
  inter: "inter-500.woff2", inter900: "inter-900.woff2", inter900i: "inter-900i.woff2", spacegrotesk: "spacegrotesk-700.woff2",
  jakarta: "jakarta-600.woff2", jbmono: "jbmono-600.woff2", bodoni: "bodoni-800i.woff2",
};
export const fontFace = (...names) => names.map((n) => {
  const b64 = fs.readFileSync(path.join(FONT_DIR, FILES[n])).toString("base64");
  return `@font-face{font-family:"${n}";src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
}).join("");

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const W = 1280, H = 420;
const svg = (label, style, body, extraDefs = "") => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<defs>${extraDefs}</defs>
<style>${style}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>
${body}
</svg>
`;

// ---------------------------------------------------------------- mono: black site hero, Geist, ASCII "0", numbered strip
function asciiZero(cx, cy, rx, ry, cls) {
  const chars = "+=-:=+-=:";
  let out = "";
  const n = 34;
  for (let i = 0; i < n; i++) {
    const t = (Math.PI * 2 * i) / n;
    const x = cx + rx * Math.cos(t), y = cy + ry * Math.sin(t);
    out += `<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" class="${cls}">${chars[i % chars.length]}</text>`;
  }
  return out;
}
export function agency(c, { isPrivate }) {
  const strip = c.strip || ["Software", "Websites", "SEO & AEO", "Meta ads", "Social", "Video"];
  const cellW = (W - 112) / strip.length;
  const cells = strip.map((s, i) => {
    const x = 56 + i * cellW;
    return `${i ? `<line x1="${x}" y1="352" x2="${x}" y2="398" class="hair"/>` : ""}<text x="${x + 14}" y="381" class="mono num">${String(i + 1).padStart(2, "0")}</text><text x="${x + cellW - 14}" y="381" text-anchor="end" class="mono cell">${esc(s)}</text>`;
  }).join("");
  const title = esc(c.title);
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("geist", "geistmono")}
.g{font-family:geist,"Segoe UI",Arial,sans-serif}.mono{font-family:geistmono,Consolas,monospace}
.hair{stroke:#2a2a2a;stroke-width:1}.num{font-size:13px;fill:#6b6b6b;letter-spacing:2px}.cell{font-size:15px;fill:#e5e5e5}
.ascii{font-family:geistmono,monospace;font-size:15px;fill:#ffffff;opacity:.16}
.flick{animation:flick 5s steps(1) infinite}@keyframes flick{0%,100%{opacity:1}47%{opacity:.4}48%{opacity:1}83%{opacity:.6}84%{opacity:1}}
.ga,.gb{opacity:0}.ga{fill:#737373;animation:ga 7s linear infinite}.gb{fill:#a3a3a3;animation:gb 7s linear infinite}
@keyframes ga{0%,90.9%,96%,100%{opacity:0;transform:translate(0,0)}91%{opacity:.85;transform:translate(-4px,0)}93%{opacity:.85;transform:translate(3px,0)}95%{opacity:.6;transform:translate(-2px,0)}}
@keyframes gb{0%,91.4%,96.5%,100%{opacity:0;transform:translate(0,0)}91.5%{opacity:.8;transform:translate(4px,0)}94%{opacity:.7;transform:translate(-3px,0)}}
.dot{animation:pulse 2.4s ease-in-out infinite}@keyframes pulse{50%{opacity:.25}}`,
  `<rect width="${W}" height="${H}" fill="#0a0a0a"/>
<rect width="${W}" height="${H}" fill="url(#vig)"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<g class="flick">${asciiZero(1040, 150, 70, 105, "ascii")}${asciiZero(1170, 270, 52, 78, "ascii")}</g>
<rect x="${W - 268}" y="34" width="212" height="44" fill="#f4f4f2"/>
<text x="${W - 162}" y="61" text-anchor="middle" class="mono" font-size="12" letter-spacing="3" fill="#0a0a0a">${isPrivate ? "PRIVATE REPO" : "OPEN SOURCE"} →</text>
<circle class="dot" cx="62" cy="60" r="4" fill="#f4f4f2"/>
<text x="78" y="65" class="mono" font-size="13" letter-spacing="3.5" fill="#8a8a8a">${esc(c.eyebrow)}</text>
<g class="g" font-size="${c.titleSize || 128}" letter-spacing="-6">
  <text x="52" y="226" class="ga">${title}</text><text x="52" y="226" class="gb">${title}</text>
  <text x="52" y="226" fill="#f4f4f2">${title}</text>
</g>
<text x="58" y="290" class="g" font-size="27" letter-spacing="-.8" fill="#f4f4f2">${esc(c.tagline)}</text>
<text x="58" y="324" class="mono" font-size="12" letter-spacing="3" fill="#6b6b6b">${esc(c.kicker || "")}</text>
<line x1="56" y1="352" x2="${W - 56}" y2="352" class="hair"/>${cells}`,
  `<radialGradient id="vig" cx=".85" cy="0" r=".9"><stop offset="0" stop-color="#ffffff" stop-opacity=".07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity=".03"/></pattern>`);
}






// ---------------------------------------------------------------- Field-service CRM (cream + deep green for SaaS, monochrome for starter)
export function fieldcrm(c) {
  const p = c.palette || { bg: "#f4f8f5", card: "#ffffff", line: "#dce6e0", ink: "#1f3a31", accent: "#2f5a4b", mute: "#5f7a70", soft: "#e6efe9" };
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const jobs = c.jobs || [[0, 0, "Kitchen deep clean"], [1, 1, "Move-out clean"], [2, 0, "Office weekly"], [3, 2, "Window wash"], [4, 1, "Recurring · Lee"], [1, 2, "Estimate visit"], [3, 0, "Post-construction"]];
  const gx = 720, gy = 110, cw = 100, rh = 76;
  const grid = days.map((d, i) => `<text x="${gx + i * cw + 8}" y="${gy - 14}" class="m" font-size="12" letter-spacing="2" fill="${p.mute}">${d}</text>`).join("") +
    jobs.map(([d, r, t], i) => `<g class="job" style="animation-delay:${i * 0.35}s"><rect x="${gx + d * cw + 4}" y="${gy + r * rh + 4}" width="${cw - 8}" height="${rh - 10}" rx="10" fill="${i % 3 ? p.soft : p.accent}" stroke="${p.line}"/><text x="${gx + d * cw + 14}" y="${gy + r * rh + 30}" class="m" font-size="11" fill="${i % 3 ? p.ink : p.card}">${esc(t.split(" ")[0])}</text><text x="${gx + d * cw + 14}" y="${gy + r * rh + 48}" class="m" font-size="11" fill="${i % 3 ? p.mute : p.soft}">${esc(t.split(" ").slice(1).join(" "))}</text></g>`).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("inter")}
.se{font-family:Georgia,"Times New Roman",serif}.m{font-family:inter,"Segoe UI",Arial,sans-serif}
.job{animation:job 5s ease-in-out infinite}@keyframes job{0%,100%{opacity:1}50%{opacity:.7}}`,
  `<rect width="${W}" height="${H}" fill="${p.bg}"/>
<rect x="690" y="40" width="550" height="350" rx="22" fill="${p.card}" stroke="${p.line}"/>
${days.map((_, i) => `<line x1="${gx + i * cw}" y1="${gy}" x2="${gx + i * cw}" y2="${gy + 3 * rh}" stroke="${p.line}"/>`).join("")}${grid}
<text x="56" y="76" class="m" font-size="13" letter-spacing="3" fill="${p.accent}">${esc(c.eyebrow)}</text>
<text x="52" y="168" class="se" font-size="76" letter-spacing="-1.5" fill="${p.ink}">${esc(c.title)}</text>
<text x="56" y="218" class="m" font-size="20" fill="${p.mute}">${esc(c.tagline)}</text>
${(c.chips || []).map((ch, i) => { const x = 56 + c.chips.slice(0, i).reduce((s, t) => s + t.length * 8.8 + 44, 0); return `<rect x="${x}" y="262" width="${ch.length * 8.8 + 30}" height="36" rx="18" fill="${p.card}" stroke="${p.line}"/><text x="${x + 15}" y="285" class="m" font-size="14" fill="${p.ink}">${esc(ch)}</text>`; }).join("")}
<rect x="56" y="324" width="210" height="48" rx="12" fill="${p.accent}"/><text x="161" y="354" text-anchor="middle" class="m" font-size="16" fill="${p.card}">${esc(c.cta || "Book a clean")}</text>`);
}

// ---------------------------------------------------------------- indigo: black + indigo glow, heavy italic wordmark
export function indigo(c) {
  let sq = "";
  for (let x = 0; x < W; x += 44) for (let y = 0; y < H; y += 44) if ((x * 7 + y * 3) % 5 === 0) sq += `<rect x="${x + 4}" y="${y + 4}" width="36" height="36" rx="4" fill="#6366f1" fill-opacity=".05"/>`;
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("inter900", "inter900i", "inter")}
.x{font-family:inter900,"Segoe UI",sans-serif}.xi{font-family:inter900i,"Segoe UI",sans-serif}.r{font-family:inter,"Segoe UI",sans-serif}
.glow{animation:gl 6s ease-in-out infinite}@keyframes gl{50%{opacity:.6}}`,
  `<rect width="${W}" height="${H}" fill="#000"/>${sq}
<circle class="glow" cx="640" cy="230" r="380" fill="url(#ind)"/>
<rect x="56" y="40" width="54" height="54" rx="15" fill="url(#logo)"/>
<path d="M73,70 L83,61 L93,70 V80 H87 V74 H79 V80 H73 Z" fill="#fff"/>
<text x="124" y="68" class="xi" font-size="30" letter-spacing="-1" fill="#fff">${esc(c.brand || c.title)}</text>
<text x="126" y="90" class="xi" font-size="13" letter-spacing="5" fill="#818cf8">${esc(c.subtitle || "")}</text>
<text x="${W - 56}" y="70" text-anchor="end" class="x" font-size="13" letter-spacing="3" fill="#a5b4fc">${esc(c.code)}</text>
<rect x="${640 - (c.eyebrow.length * 5.6 + 40) / 2}" y="122" width="${c.eyebrow.length * 5.6 + 40}" height="30" rx="15" fill="none" stroke="#4f46e5" stroke-opacity=".6"/>
<text x="640" y="142" text-anchor="middle" class="x" font-size="12" letter-spacing="3" fill="#a5b4fc">✦ ${esc(c.eyebrow)}</text>
<text x="640" y="224" text-anchor="middle" class="x" font-size="66" letter-spacing="-3" fill="#e0e7ff">${esc(c.title)}</text>
<text x="640" y="296" text-anchor="middle" class="x" font-size="66" letter-spacing="-3" fill="url(#silver)">${esc(c.title2)}</text>
<text x="640" y="342" text-anchor="middle" class="r" font-size="19" fill="#a1a1c2">${esc(c.tagline)}</text>
<rect x="452" y="362" width="180" height="44" rx="12" fill="#fff"/><text x="542" y="390" text-anchor="middle" class="x" font-size="16" fill="#000">Get Started →</text>
<rect x="648" y="362" width="180" height="44" rx="12" fill="#0b0b14" stroke="#27272f"/><text x="738" y="390" text-anchor="middle" class="x" font-size="16" fill="#fff">${esc(c.cta2 || "View the CRM")}</text>`,
  `<radialGradient id="ind"><stop offset="0" stop-color="#4f46e5" stop-opacity=".28"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
<linearGradient id="logo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#a855f7"/></linearGradient>
<linearGradient id="silver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#9ca3af"/></linearGradient>`);
}

// ---------------------------------------------------------------- hud: night dashboard, one neon accent, animated gauge
export function hud(c) {
  const cx = 1050, cy = 250, R = 140;
  const arc = (a0, a1, r) => { const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`; };
  const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
  let ticks = "";
  for (let i = 0; i <= 12; i++) { const a = a0 + ((a1 - a0) * i) / 12; ticks += `<line x1="${(cx + (R - 26) * Math.cos(a)).toFixed(1)}" y1="${(cy + (R - 26) * Math.sin(a)).toFixed(1)}" x2="${(cx + (R - 14) * Math.cos(a)).toFixed(1)}" y2="${(cy + (R - 14) * Math.sin(a)).toFixed(1)}" stroke="${i > 9 ? "#FF6B6B" : "#718073"}" stroke-width="2"/>`; }
  const len = (R * (a1 - a0)).toFixed(0);
  const nav = c.nav || ["HOME", "STATS", "MAP", "LIVE", "TEAM", "SETTINGS"];
  let x = 56;
  const chips = nav.map((n, i) => { const w = n.length * 10 + 34; const g = `<rect x="${x}" y="318" width="${w}" height="36" rx="10" fill="${i === 3 ? "rgba(183,255,74,0.10)" : "rgba(16,21,17,0.76)"}" stroke="${i === 3 ? "#B7FF4A" : "rgba(232,255,235,0.12)"}"/><text x="${x + w / 2}" y="341" text-anchor="middle" class="h" font-size="13" letter-spacing="1.6" fill="${i === 3 ? "#B7FF4A" : "#B8C7BA"}">${n}</text>`; x += w + 10; return g; }).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("inter900", "inter900i")}
.h{font-family:inter900,"Segoe UI",sans-serif}.hi{font-family:inter900i,"Segoe UI",sans-serif}
.sweep{stroke-dasharray:${len};stroke-dashoffset:${len};animation:sw 4.5s cubic-bezier(.4,0,.2,1) infinite}@keyframes sw{55%,80%{stroke-dashoffset:${(len * 0.22).toFixed(0)}}100%{stroke-dashoffset:${len}}}
.live{animation:lv 1.2s steps(1) infinite}@keyframes lv{50%{opacity:.2}}`,
  `<rect width="${W}" height="${H}" fill="#060806"/>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<circle cx="${cx}" cy="${cy}" r="230" fill="url(#halo)"/>
<path d="${arc(a0, a1, R)}" fill="none" stroke="#192019" stroke-width="14" stroke-linecap="round"/>
<path class="sweep" d="${arc(a0, a1, R)}" fill="none" stroke="#B7FF4A" stroke-width="14" stroke-linecap="round"/>${ticks}
<text x="${cx}" y="${cy + 18}" text-anchor="middle" class="h" font-size="70" letter-spacing="-2" fill="#B7FF4A">${esc(c.gauge || "88")}</text>
<text x="${cx}" y="${cy + 46}" text-anchor="middle" class="h" font-size="13" letter-spacing="2.2" fill="#718073">${esc(c.gaugeLabel || "PERCENT")}</text>
<circle class="live" cx="66" cy="70" r="5" fill="#B7FF4A"/>
<text x="80" y="75" class="h" font-size="13" letter-spacing="2.2" fill="#B7FF4A">${esc(c.status || "LIVE")} · ${esc(c.code)}</text>
<text x="50" y="190" class="hi" font-size="${c.titleSize || 108}" letter-spacing="-2" fill="#F4FFF5">${esc(c.title)}</text>
<text x="56" y="244" class="h" font-size="18" letter-spacing=".4" fill="#B8C7BA">${esc(c.tagline)}</text>
<text x="56" y="286" class="h" font-size="12" letter-spacing="2" fill="#718073">${esc(c.kicker || "")}</text>
${chips}`,
  `<pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#B7FF4A" stroke-opacity=".04"/></pattern>
<radialGradient id="halo"><stop offset="0" stop-color="#B7FF4A" stop-opacity=".10"/><stop offset="1" stop-color="#B7FF4A" stop-opacity="0"/></radialGradient>`);
}

// ---------------------------------------------------------------- Dynamic Island (the pill itself, morphing over a desktop)
export function island(c) {
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("inter900", "inter")}
.x{font-family:inter900,"Segoe UI",sans-serif}.r{font-family:inter,"Segoe UI",sans-serif}
.pill{animation:pill 8s cubic-bezier(.5,0,.2,1) infinite}
@keyframes pill{0%,12%{width:240px;height:44px;x:520px;y:26px;rx:22px}28%,78%{width:600px;height:136px;x:340px;y:26px;rx:40px}94%,100%{width:240px;height:44px;x:520px;y:26px;rx:22px}}
.big{opacity:0;animation:big 8s ease infinite}@keyframes big{0%,26%{opacity:0}32%,74%{opacity:1}80%,100%{opacity:0}}
.small{animation:small 8s ease infinite}@keyframes small{0%,12%{opacity:1}16%,90%{opacity:0}96%,100%{opacity:1}}
.eq rect{animation:eq .9s ease-in-out infinite alternate}@keyframes eq{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
.prog{animation:prog 8s linear infinite}@keyframes prog{from{width:40px}to{width:300px}}`,
  `<rect width="${W}" height="${H}" fill="url(#wall)"/>
<circle cx="220" cy="380" r="300" fill="url(#b1)"/><circle cx="1100" cy="60" r="320" fill="url(#b2)"/>
<rect class="pill" x="520" y="26" width="240" height="44" rx="22" fill="#000"/>
<g class="small"><circle cx="548" cy="48" r="9" fill="url(#art)"/><g class="eq" fill="#a855f7"><rect x="728" y="40" width="3" height="16" style="transform-origin:729px 56px"/><rect x="734" y="40" width="3" height="16" style="transform-origin:735px 56px;animation-delay:.2s"/><rect x="740" y="40" width="3" height="16" style="transform-origin:741px 56px;animation-delay:.4s"/></g></g>
<g class="big">
<rect x="370" y="48" width="92" height="92" rx="18" fill="url(#art)"/>
<text x="484" y="80" class="x" font-size="20" fill="#fff">Now Playing</text>
<text x="484" y="106" class="r" font-size="16" fill="#a1a1aa">Spotify · Up next: Standup in 12 min</text>
<rect x="484" y="124" width="300" height="5" rx="2.5" fill="#27272a"/><rect class="prog" x="484" y="124" width="40" height="5" rx="2.5" fill="#fff"/>
<circle cx="840" cy="78" r="16" fill="#18181b"/><text x="840" y="84" text-anchor="middle" font-size="14" fill="#fff">⏸</text>
<g fill="#22d3ee" font-size="11" class="r"><circle cx="890" cy="70" r="5" fill="#22c55e"/><text x="902" y="74" fill="#d4d4d8">Claude</text><circle cx="890" cy="96" r="5" fill="#22c55e"/><text x="902" y="100" fill="#d4d4d8">Codex</text><circle cx="890" cy="122" r="5" fill="#eab308"/><text x="902" y="126" fill="#d4d4d8">Gemini</text></g>
</g>
<text x="640" y="262" text-anchor="middle" class="x" font-size="78" letter-spacing="-3" fill="#fff">${esc(c.title)}</text>
<text x="640" y="306" text-anchor="middle" class="r" font-size="21" fill="#c4c4cc">${esc(c.tagline)}</text>
<text x="640" y="372" text-anchor="middle" class="r" font-size="14" letter-spacing="3" fill="#8b8b96">MEDIA · GOOGLE CALENDAR · AI AGENTS · WEATHER</text>
<rect x="0" y="${H - 10}" width="${W}" height="10" fill="#0b0b10" fill-opacity=".6"/>`,
  `<linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1020"/><stop offset="1" stop-color="#1a1238"/></linearGradient>
<radialGradient id="b1"><stop offset="0" stop-color="#22d3ee" stop-opacity=".28"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
<radialGradient id="b2"><stop offset="0" stop-color="#a855f7" stop-opacity=".32"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></radialGradient>
<linearGradient id="art" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>`);
}

// Brand dividers: a thin rule in each app's language
// ---------------------------------------------------------------- God Mode Cut (black ink, Geist, volt→flare→ember gradient, edit timeline)
export function godcut(c, { isPrivate }) {
  const strip = c.strip || [];
  const cellW = (W - 112) / strip.length;
  const cells = strip.map((s, i) => {
    const x = 56 + i * cellW;
    return `${i ? `<line x1="${x}" y1="352" x2="${x}" y2="398" class="hair"/>` : ""}<text x="${x + 14}" y="381" class="mono num">${String(i + 1).padStart(2, "0")}</text><text x="${x + cellW - 14}" y="381" text-anchor="end" class="mono cell">${esc(s)}</text>`;
  }).join("");
  // edit timeline: three tracks of clips, a playhead sweeping across
  const tx = 860, tw = 364;
  const tracks = [[0, 54, 60, 96, 170, 230, 300], [20, 120, 148, 236, 262, 340], [0, 90, 104, 200, 214, 364]].map((cuts, row) => {
    let out = "";
    for (let i = 0; i + 1 < cuts.length; i += 2) {
      const x = tx + cuts[i], w = cuts[i + 1] - cuts[i];
      out += `<rect x="${x}" y="${150 + row * 34}" width="${w}" height="24" rx="3" fill="url(#brand)" fill-opacity="${0.85 - row * 0.22}"/>`;
    }
    return out;
  }).join("");
  const title = esc(c.title);
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("geist", "geistmono")}
.g{font-family:geist,"Segoe UI",Arial,sans-serif}.mono{font-family:geistmono,Consolas,monospace}
.hair{stroke:#262626;stroke-width:1}.num{font-size:13px;fill:#7c7c7c;letter-spacing:2px}.cell{font-size:15px;fill:#e5e5e5}
.head{animation:sweep 6s linear infinite}@keyframes sweep{from{transform:translateX(0)}to{transform:translateX(${tw}px)}}
.dot{animation:pulse 1.2s ease-in-out infinite}@keyframes pulse{50%{opacity:.2}}`,
  `<rect width="${W}" height="${H}" fill="#000000"/>
<rect width="${W}" height="${H}" fill="url(#glowL)"/>
<rect width="${W}" height="${H}" fill="url(#glowR)"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<rect x="${tx - 16}" y="110" width="${tw + 32}" height="${3 * 34 + 52}" rx="10" fill="#080808" stroke="#ffffff" stroke-opacity=".12"/>
<text x="${tx}" y="134" class="mono" font-size="11" letter-spacing="2" fill="#7c7c7c">00:00:00:00</text>
<text x="${tx + tw}" y="134" text-anchor="end" class="mono" font-size="11" letter-spacing="2" fill="#7c7c7c">REEL_FINAL_v3</text>
${tracks}
<g class="head"><line x1="${tx}" y1="142" x2="${tx}" y2="${150 + 3 * 34}" stroke="#f4f4f2" stroke-width="2"/><path d="M${tx - 6} 140h12l-6 8z" fill="#f4f4f2"/></g>
<rect x="${W - 268}" y="34" width="212" height="44" fill="url(#brand)"/>
<text x="${W - 162}" y="61" text-anchor="middle" class="mono" font-size="12" letter-spacing="3" fill="#000000">${isPrivate ? "PRIVATE REPO" : "OPEN SOURCE"} →</text>
<circle class="dot" cx="62" cy="60" r="5" fill="#ef5a5a"/>
<text x="78" y="65" class="mono" font-size="13" letter-spacing="3.5" fill="#b3b3b3">${esc(c.eyebrow)}</text>
<text x="52" y="${c.titleY || 196}" class="g" font-size="${c.titleSize || 104}" letter-spacing="-5" fill="url(#ttl)">${title}</text>
<text x="58" y="${(c.titleY || 196) + 64}" class="g" font-size="27" letter-spacing="-.8" fill="#f4f4f2">${esc(c.tagline)}</text>
<text x="58" y="324" class="mono" font-size="12" letter-spacing="3" fill="#7c7c7c">${esc(c.kicker || "")}</text>
<line x1="56" y1="352" x2="${W - 56}" y2="352" class="hair"/>${cells}`,
  `<linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8b5cf6"/><stop offset=".55" stop-color="#d946ef"/><stop offset="1" stop-color="#f97316"/></linearGradient>
<linearGradient id="ttl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4f4f2"/><stop offset=".6" stop-color="#f4f4f2"/><stop offset=".82" stop-color="#d946ef"/><stop offset="1" stop-color="#f97316"/></linearGradient>
<radialGradient id="glowL" cx=".08" cy="0" r=".7"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".32"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
<radialGradient id="glowR" cx=".95" cy="1" r=".6"><stop offset="0" stop-color="#f97316" stop-opacity=".2"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity=".035"/></pattern>`);
}

// ---------------------------------------------------------------- aether: near-black IDE, one hot yellow, Bodoni italic, a typing assistant
export function aether(c) {
  const Y = c.accent || "#eab308";
  const code = c.codeLines || [
    [["k", "const "], ["t", "app"], ["p", " = "], ["k", "await "], ["f", "aether"], ["p", ".build({"]],
    [["t", "  idea"], ["p", ": "], ["s", "\"CRM for a cleaning crew\""], ["p", ","]],
    [["t", "  ship"], ["p", ": ["], ["s", "\"web\""], ["p", ", "], ["s", "\"desktop\""], ["p", ", "], ["s", "\"android\""], ["p", "],"]],
    [["p", "});"]],
    [["c", "// plan ready · 14 files · tests passing"]],
  ];
  const col = { k: Y, t: "#e4e4e7", p: "#71717a", f: "#fde68a", s: "#a1a1aa", c: "#52525b" };
  const lines = code.map((ln, i) => {
    const y = 156 + i * 30;
    const spans = ln.map(([k, s]) => `<tspan fill="${col[k]}">${esc(s)}</tspan>`).join("");
    return `<g clip-path="url(#ln${i})"><text x="738" y="${y}" class="mono" font-size="15" xml:space="preserve">${spans}</text></g>
<text x="712" y="${y}" class="mono" font-size="13" fill="#3f3f46" text-anchor="end">${i + 1}</text>`;
  }).join("");
  const clips = code.map((_, i) => `<clipPath id="ln${i}"><rect class="type t${i}" x="730" y="${136 + i * 30}" width="460" height="30"/></clipPath>`).join("");
  const typeCss = code.map((_, i) => `.t${i}{animation:type 9s steps(28) infinite backwards;animation-delay:${(i * 0.9).toFixed(1)}s}`).join("");
  const chips = (c.chips || []).map((ch, i, a) => {
    const x = 60 + a.slice(0, i).reduce((s, t) => s + t.length * 8.4 + 40, 0);
    return `<rect x="${x}" y="292" width="${ch.length * 8.4 + 28}" height="32" rx="16" fill="none" stroke="${Y}" stroke-opacity=".45"/><text x="${x + 14}" y="313" class="jk" font-size="14" fill="#e4e4e7">${esc(ch)}</text>`;
  }).join("");
  const [w1, w2] = c.wordmark || [c.title.slice(0, 3), c.title.slice(3)];
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("bodoni", "jakarta", "jbmono")}
.bd{font-family:bodoni,Georgia,serif;font-style:italic}.jk{font-family:jakarta,"Segoe UI",sans-serif}.mono{font-family:jbmono,Consolas,monospace}
.type{transform-box:fill-box;transform-origin:left}
@keyframes type{0%{transform:scaleX(0)}12%,88%{transform:scaleX(1)}96%,100%{transform:scaleX(0)}}${typeCss}
.caret{animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}
.sweep{animation:sweep 6s ease-in-out infinite}@keyframes sweep{0%{transform:translateX(-260px);opacity:0}20%{opacity:.9}60%,100%{transform:translateX(1280px);opacity:0}}
.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{50%{opacity:.35}}`,
  `<rect width="${W}" height="${H}" fill="#050507"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
<rect x="60" y="48" width="44" height="44" rx="11" fill="${Y}"/><text x="82" y="78" text-anchor="middle" class="jk" font-size="20" font-weight="700" fill="#050507">${esc(c.logo || c.title[0])}</text>
<text x="118" y="77" class="mono" font-size="13" letter-spacing="4" fill="#a1a1aa">${esc(c.code || "")}</text>
<text x="56" y="196" class="bd" font-size="104" letter-spacing="-2"><tspan fill="#fafafa">${esc(w1)}</tspan><tspan fill="${Y}">${esc(w2)}</tspan></text>
<text x="60" y="248" class="jk" font-size="20" fill="#a1a1aa">${esc(c.tagline)}</text>
${chips}
<rect x="60" y="352" width="${c.ctaW || 196}" height="2" fill="${Y}"/><text x="60" y="380" class="mono" font-size="13" letter-spacing="2" fill="${Y}">${esc(c.cta || "OPEN THE WORKSPACE →")}</text>
<rect x="676" y="70" width="548" height="300" rx="14" fill="#0b0c10" stroke="#27272a"/>
<path d="M676 84a14 14 0 0 1 14-14h520a14 14 0 0 1 14 14v22H676z" fill="#121214"/>
<circle cx="698" cy="88" r="5" fill="#3f3f46"/><circle cx="716" cy="88" r="5" fill="#3f3f46"/><circle cx="734" cy="88" r="5" fill="${Y}"/>
<rect x="756" y="76" width="112" height="30" fill="#0b0c10"/><rect x="756" y="104" width="112" height="2" fill="${Y}"/>
<text x="770" y="95" class="mono" font-size="12" fill="#e4e4e7">${esc(c.file || "aether.ts")}</text>
${lines}
<rect class="caret" x="738" y="${136 + code.length * 30 + 8}" width="9" height="18" fill="${Y}"/>
<path d="M676 340h548v16a14 14 0 0 1-14 14H690a14 14 0 0 1-14-14z" fill="#121214"/>
<circle class="pulse" cx="696" cy="355" r="4" fill="${Y}"/><text x="708" y="360" class="mono" font-size="12" fill="#a1a1aa">${esc(c.status || "AETHER · ONLINE")}</text>
<text x="1208" y="360" text-anchor="end" class="mono" font-size="12" fill="#52525b">${esc(c.statusRight || "UTF-8 · TS")}</text>
<rect class="sweep" x="0" y="${H - 3}" width="260" height="3" fill="url(#sw)"/>`,
  `<radialGradient id="glow" cx=".1" cy=".05" r=".75"><stop offset="0" stop-color="${Y}" stop-opacity=".16"/><stop offset="1" stop-color="${Y}" stop-opacity="0"/></radialGradient>
<linearGradient id="sw" x1="0" x2="1"><stop offset="0" stop-color="${Y}" stop-opacity="0"/><stop offset=".5" stop-color="${Y}"/><stop offset="1" stop-color="${Y}" stop-opacity="0"/></linearGradient>
<pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#ffffff" fill-opacity=".05"/></pattern>${clips}`);
}

// ---------------------------------------------------------------- ledger: warm paper, serif, an approval inbox that stamps itself
export function ledger(c) {
  const p = c.palette || { paper: "#f5f1ea", card: "#fffdf9", ink: "#1f1b16", mute: "#6f665c", line: "#e4dccf", accent: "#c96442", ok: "#3f7d4f" };
  const rows = c.rows || [["CRM", "Text 12 customers a follow-up"], ["ADS", "Move $20/day to the winning ad"], ["SEO", "Rewrite 3 page titles"], ["VIDEO", "Post Tuesday's reel at 6pm"]];
  const rowEls = rows.map(([tag, text], i) => {
    const y = 104 + i * 64, d = (i * 1.4).toFixed(1);
    return `<g><rect x="704" y="${y}" width="508" height="52" rx="10" fill="${p.card}" stroke="${p.line}"/>
<rect x="720" y="${y + 15}" width="${tag.length * 8 + 18}" height="22" rx="11" fill="${p.paper}" stroke="${p.line}"/><text x="729" y="${y + 30}" class="mono" font-size="11" letter-spacing="1.5" fill="${p.mute}">${esc(tag)}</text>
<text x="${740 + tag.length * 8 + 10}" y="${y + 31}" class="sans" font-size="15" fill="${p.ink}">${esc(text)}</text>
<g class="ask" style="animation-delay:${d}s"><rect x="1112" y="${y + 12}" width="86" height="28" rx="14" fill="${p.ink}"/><text x="1155" y="${y + 31}" text-anchor="middle" class="sans" font-size="13" fill="${p.paper}">Approve</text></g>
<g class="stamp" style="animation-delay:${d}s"><g transform="translate(1155 ${y + 26}) rotate(-8)"><rect x="-50" y="-14" width="100" height="28" rx="4" fill="${p.card}" stroke="${p.ok}" stroke-width="2.5"/><text y="5" text-anchor="middle" class="mono" font-size="13" letter-spacing="2" fill="${p.ok}">APPROVED</text></g></g></g>`;
  }).join("");
  const words = c.title.split(" ");
  const last = words.pop();
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("fraunces", "inter", "plexmono")}
.serif{font-family:fraunces,Georgia,serif}.sans{font-family:inter,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}
.ask{opacity:0;animation:ask 7s ease-in-out infinite backwards}@keyframes ask{0%,12%{opacity:1}16%,92%{opacity:0}100%{opacity:1}}
.stamp{animation:stamp 7s ease-out infinite backwards}
@keyframes stamp{0%,12%{opacity:0}16%,88%{opacity:1}94%,100%{opacity:0}}
.you{animation:you 3.5s ease-in-out infinite}@keyframes you{50%{opacity:.55}}`,
  `<rect width="${W}" height="${H}" fill="${p.paper}"/>
<rect width="${W}" height="${H}" fill="url(#rule)"/>
<text x="60" y="76" class="mono" font-size="13" letter-spacing="3" fill="${p.accent}">${esc(c.eyebrow || "")}</text>
<text x="56" y="168" class="serif" font-size="74" letter-spacing="-1.5" fill="${p.ink}">${esc(words.join(" "))}</text>
<text x="56" y="246" class="serif" font-size="74" letter-spacing="-1.5" fill="${p.accent}">${esc(last)}</text>
<text x="60" y="294" class="sans" font-size="20" fill="${p.mute}">${esc(c.tagline)}</text>
<line x1="60" y1="330" x2="560" y2="330" stroke="${p.line}"/>
<text x="60" y="362" class="mono" font-size="13" letter-spacing="1.5" fill="${p.mute}">${esc(c.footnote || "")}</text>
<rect x="684" y="40" width="548" height="352" rx="18" fill="${p.paper}" stroke="${p.line}"/>
<text x="704" y="80" class="serif" font-size="22" fill="${p.ink}">${esc(c.inboxTitle || "Waiting for your yes")}</text>
<circle class="you" cx="1196" cy="73" r="6" fill="${p.accent}"/><text x="1184" y="78" text-anchor="end" class="mono" font-size="12" fill="${p.mute}">${rows.length} TODAY</text>
${rowEls}`,
  `<pattern id="rule" width="${W}" height="32" patternUnits="userSpaceOnUse"><line x1="0" y1="31.5" x2="${W}" y2="31.5" stroke="${p.ink}" stroke-opacity=".035"/></pattern>`);
}

// ---------------------------------------------------------------- forge: GitHub dark, markdown source on the left builds a README on the right
export function forge(c) {
  const g = c.palette || { bg: "#0d1117", panel: "#161b22", line: "#30363d", ink: "#e6edf3", mute: "#8b949e", green: "#3fb950", blue: "#58a6ff", amber: "#d29922" };
  const src = c.source || ["{{HEADER}}", "## What it does", "| 🎨 | Banner, your colors |", "```mermaid", "flowchart LR", "  A[Repo] --> B[README]", "```", "{{FOOTER}}"];
  const tint = (s) => (s.startsWith("#") ? g.blue : s.startsWith("{{") ? g.amber : s.startsWith("```") ? g.green : g.mute);
  const srcEls = src.map((s, i) => `<text x="716" y="${110 + i * 26}" class="mono" font-size="13" fill="${tint(s)}">${esc(s)}</text>`).join("");
  const built = [
    `<rect x="962" y="98" width="256" height="58" rx="6" fill="url(#ban)"/><text x="978" y="133" class="hd" font-size="20" fill="#ffffff">${esc(c.miniTitle || "your-app")}</text>`,
    `<rect x="962" y="166" width="54" height="14" rx="3" fill="${g.green}"/><rect x="1022" y="166" width="54" height="14" rx="3" fill="${g.blue}"/><rect x="1082" y="166" width="42" height="14" rx="3" fill="${g.amber}"/>`,
    `<rect x="962" y="194" width="150" height="9" rx="4" fill="${g.ink}" fill-opacity=".85"/><rect x="962" y="210" width="256" height="6" rx="3" fill="${g.mute}" fill-opacity=".5"/><rect x="962" y="222" width="210" height="6" rx="3" fill="${g.mute}" fill-opacity=".5"/>`,
    `<rect x="962" y="242" width="66" height="34" rx="6" fill="none" stroke="${g.blue}"/><path d="M1028 259h22" stroke="${g.mute}"/><rect x="1050" y="242" width="66" height="34" rx="6" fill="none" stroke="${g.green}"/><path d="M1116 259h22" stroke="${g.mute}"/><rect x="1138" y="242" width="80" height="34" rx="6" fill="${g.green}" fill-opacity=".18" stroke="${g.green}"/>`,
    `<rect x="962" y="292" width="256" height="34" rx="6" fill="none" stroke="${g.line}"/><text x="976" y="314" class="mono" font-size="11" fill="${g.mute}">AI agents: start here →</text>`,
  ].map((b, i) => `<g class="blk" style="animation-delay:${(0.6 + i * 0.7).toFixed(1)}s">${b}</g>`).join("");
  const steps = c.steps || ["read", "theme", "shoot", "build", "check", "push"];
  const stepEls = steps.map((s, i) => {
    const x = 72 + i * 96;
    return `${i ? `<line x1="${x - 86}" y1="350" x2="${x - 10}" y2="350" stroke="${g.line}" stroke-width="2"/>` : ""}<circle cx="${x}" cy="350" r="7" fill="${g.bg}" stroke="${g.line}" stroke-width="2"/><circle class="st" style="animation-delay:${(i * 0.8).toFixed(1)}s" cx="${x}" cy="350" r="7" fill="${g.green}"/><text x="${x}" y="380" text-anchor="middle" class="mono" font-size="12" fill="${g.mute}">${esc(s)}</text>`;
  }).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("schibsted", "inter", "plexmono")}
.hd{font-family:schibsted,"Segoe UI",sans-serif}.sans{font-family:inter,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}
.scan{animation:scan 6s linear infinite}@keyframes scan{0%{transform:translateY(0)}80%,100%{transform:translateY(182px)}}
.blk{animation:blk 6s ease-out infinite backwards}@keyframes blk{0%{opacity:0}8%,85%{opacity:1}95%,100%{opacity:0}}
.st{animation:st 6s steps(1) infinite backwards}@keyframes st{0%{opacity:0}2%,90%{opacity:1}100%{opacity:0}}
.arrow{animation:arrow 1.5s ease-in-out infinite}@keyframes arrow{50%{transform:translateX(4px)}}`,
  `<rect width="${W}" height="${H}" fill="${g.bg}"/>
<text x="60" y="78" class="mono" font-size="13" letter-spacing="3" fill="${g.green}">${esc(c.eyebrow || "")}</text>
<text x="56" y="172" class="hd" font-size="84" letter-spacing="-3" fill="${g.ink}">${esc(c.title)}</text>
<text x="60" y="222" class="sans" font-size="20" fill="${g.ink}" fill-opacity=".8">${esc(c.tagline)}</text>
<text x="60" y="256" class="sans" font-size="16" fill="${g.mute}">${esc(c.subline || "")}</text>
${stepEls}
<rect x="700" y="60" width="536" height="296" rx="12" fill="${g.panel}" stroke="${g.line}"/>
<line x1="946" y1="60" x2="946" y2="356" stroke="${g.line}"/>
<text x="716" y="84" class="mono" font-size="11" letter-spacing="1" fill="${g.mute}">readmes/your-app.md</text>
<text x="962" y="84" class="mono" font-size="11" letter-spacing="1" fill="${g.mute}">README.md</text>
${srcEls}
<rect class="scan" x="708" y="94" width="230" height="24" rx="3" fill="${g.blue}" fill-opacity=".12"/>
<path class="arrow" d="M942 200l8 8-8 8" fill="none" stroke="${g.green}" stroke-width="2"/>
${built}`,
  `<linearGradient id="ban" x1="0" x2="1"><stop offset="0" stop-color="${g.blue}"/><stop offset="1" stop-color="${g.green}"/></linearGradient>`);
}

function baseDivider(c) {
  const col = c.divider || c.a;
  if (c.flatDivider || c.theme === "agency" || c.theme === "mono") return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="10" viewBox="0 0 1280 10"><rect x="0" y="4" width="1280" height="2" fill="${"#737373"}"/></svg>\n`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="14" viewBox="0 0 1280 14"><defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".5" stop-color="${col}"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></linearGradient></defs><rect x="0" y="6" width="1280" height="2" fill="url(#d)"/><circle cx="640" cy="7" r="4" fill="${col}"/></svg>\n`;
}

// Generic, public themes. Project-specific themes live in your data folder (data/themes.mjs) and are
// merged on top, so a theme there with the same name wins.
const BASE = { mono: agency, fieldcrm, indigo, hud, island, godcut, aether, ledger, forge };
let custom = {};
try {
  const { DATA } = await import("./data.mjs");
  const file = path.join(DATA, "themes.mjs");
  if (fs.existsSync(file)) custom = await import(pathToFileURL(file).href);
} catch { /* no data folder: generic themes only */ }
export const THEMES = { ...BASE, ...(custom.THEMES || {}) };
export const themedDivider = custom.themedDivider || baseDivider;
