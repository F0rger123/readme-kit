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
  jakarta: "jakarta-600.woff2", jbmono: "jbmono-600.woff2", bodoni: "bodoni-800i.woff2", orbitron: "orbitron-800.woff2", sharetech: "sharetech-400.woff2", dmsans: "dmsans-700.woff2", archivo: "archivo-800.woff2", archivo5: "archivo-500.woff2",
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

// ---------------------------------------------------------------- blueprint: light product blueprint, an app wireframe that draws itself
export function blueprint(c) {
  const p = c.palette || { bg: "#f8fafc", card: "#ffffff", ink: "#0f172a", mute: "#64748b", line: "#e2e8f0", soft: "#f1f5f9", a: "#6366f1", b: "#7c3aed", ok: "#059669" };
  const items = c.items || ["Fixed sidebar", "Top navigation", "Leads & pipeline", "Jobs & calendar", "AI assistant"];
  const list = items.map((t, i) => `<g class="li" style="animation-delay:${(1 + i * 0.5).toFixed(1)}s"><circle cx="1000" cy="${142 + i * 40}" r="5" fill="${i === items.length - 1 ? p.b : p.ok}"/><text x="1016" y="${147 + i * 40}" class="sans" font-size="15" fill="${p.ink}">${esc(t)}</text></g>`).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("spacegrotesk", "inter")}
.sg{font-family:spacegrotesk,"Segoe UI",sans-serif}.sans{font-family:inter,"Segoe UI",sans-serif}
.draw{stroke-dasharray:1400;animation:draw 8s ease-in-out infinite backwards}@keyframes draw{0%{stroke-dashoffset:1400}35%,90%{stroke-dashoffset:0}100%{stroke-dashoffset:1400}}
.sk{animation:sk 8s ease-in-out infinite backwards}@keyframes sk{0%,30%{opacity:0}40%,90%{opacity:1}100%{opacity:0}}
.li{animation:li 8s ease-out infinite backwards}@keyframes li{0%{opacity:0;transform:translateX(-8px)}10%,90%{opacity:1;transform:none}100%{opacity:0}}`,
  `<rect width="${W}" height="${H}" fill="${p.bg}"/><rect width="${W}" height="${H}" fill="url(#bpgrid)"/>
<rect x="60" y="48" width="40" height="40" rx="20" fill="${p.ink}"/><text x="80" y="74" text-anchor="middle" class="sg" font-size="16" fill="#fff">${esc(c.logo || "PC")}</text>
<text x="112" y="76" class="sg" font-size="22" fill="${p.ink}">${esc(c.brand || c.title)}</text>
<rect x="${120 + (c.brand || c.title).length * 12}" y="56" width="66" height="24" rx="12" fill="${p.soft}" stroke="${p.line}"/><circle cx="${134 + (c.brand || c.title).length * 12}" cy="68" r="3" fill="${p.ok}"/><text x="${142 + (c.brand || c.title).length * 12}" y="73" class="sans" font-size="12" fill="${p.mute}">${esc(c.version || "v1")}</text>
<text x="56" y="178" class="sg" font-size="${c.titleSize || 64}" letter-spacing="-2" fill="${p.ink}">${esc(c.title)}</text>
<text x="60" y="222" class="sans" font-size="20" fill="${p.mute}">${esc(c.tagline)}</text>
<rect x="60" y="262" width="168" height="40" rx="20" fill="url(#ai)"/><text x="144" y="287" text-anchor="middle" class="sans" font-size="14" fill="#fff">${esc(c.cta || "AI Assistant")}</text>
<rect x="240" y="262" width="150" height="40" rx="20" fill="${p.ink}"/><text x="315" y="287" text-anchor="middle" class="sans" font-size="14" fill="#fff">${esc(c.cta2 || "Export PDF")}</text>
<text x="60" y="352" class="sans" font-size="13" letter-spacing="2" fill="${p.mute}">${esc(c.eyebrow || "")}</text>
<rect x="560" y="70" width="400" height="290" rx="18" fill="${p.card}" stroke="${p.line}"/>
<rect class="draw" x="584" y="94" width="352" height="242" rx="16" fill="none" stroke="${p.ink}" stroke-width="7"/>
<g class="sk" style="animation-delay:.2s"><rect x="606" y="114" width="80" height="12" rx="6" fill="${p.line}"/><line x1="588" y1="140" x2="932" y2="140" stroke="${p.line}"/><line x1="700" y1="140" x2="700" y2="332" stroke="${p.line}"/>
<rect x="604" y="156" width="82" height="18" rx="9" fill="${p.line}"/><rect x="604" y="182" width="88" height="18" rx="9" fill="${p.line}"/><rect x="604" y="208" width="70" height="18" rx="9" fill="${p.line}"/>
<rect x="716" y="156" width="96" height="12" rx="6" fill="${p.line}"/><rect x="716" y="182" width="66" height="72" rx="10" fill="${p.soft}"/><rect x="790" y="182" width="66" height="72" rx="10" fill="${p.soft}"/><rect x="864" y="182" width="56" height="72" rx="10" fill="${p.soft}"/></g>
<rect x="980" y="70" width="252" height="290" rx="18" fill="${p.card}" stroke="${p.line}"/>
<text x="1000" y="108" class="sans" font-size="14" font-weight="600" fill="${p.ink}">${esc(c.listTitle || "Layout components")}</text>
${list}`,
  `<pattern id="bpgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${p.ink}" stroke-opacity=".04"/></pattern>
<linearGradient id="ai" x1="0" x2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/></linearGradient>`);
}

// ---------------------------------------------------------------- heartbeat: a purple report header and a commit "pulse" line across the week
export function heartbeat(c) {
  const p = c.palette || { top: "#667eea", bot: "#764ba2", paper: "#f5f5f7", card: "#ffffff", ink: "#2d3748", mute: "#718096", ok: "#68d391", line: "#e2e8f0" };
  const days = c.days || ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const beat = "M60 330 H150 l12 -34 l14 64 l12 -52 l10 22 H300 l12 -40 l14 76 l12 -60 l10 24 H450 l10 -18 l12 30 l10 -12 H600 l12 -46 l14 84 l12 -66 l10 28 H760 l8 -10 l10 16 H880 l12 -30 l14 52 l12 -38 l10 16 H1220";
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("inter", "inter900", "plexmono")}
.sans{font-family:inter,"Segoe UI",sans-serif}.x{font-family:inter900,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}
.beat{stroke-dasharray:1800;animation:beat 5s linear infinite backwards}@keyframes beat{0%{stroke-dashoffset:1800}70%,100%{stroke-dashoffset:0}}
.blip{animation:blip 1.2s ease-in-out infinite}@keyframes blip{50%{opacity:.3}}
.card{animation:card 5s ease-out infinite backwards}@keyframes card{0%{opacity:0;transform:translateY(10px)}12%,88%{opacity:1;transform:none}100%{opacity:0}}`,
  `<rect width="${W}" height="${H}" fill="${p.paper}"/>
<rect width="${W}" height="236" fill="url(#hb)"/>
<text x="60" y="72" class="mono" font-size="13" letter-spacing="3" fill="#ffffff" fill-opacity=".8">${esc(c.eyebrow || "")}</text>
<text x="56" y="150" class="x" font-size="78" letter-spacing="-2" fill="#ffffff">${esc(c.title)}</text>
<text x="60" y="194" class="sans" font-size="20" fill="#ffffff" fill-opacity=".9">${esc(c.tagline)}</text>
<circle class="blip" cx="${W - 82}" cy="66" r="7" fill="${p.ok}"/><text x="${W - 96}" y="71" text-anchor="end" class="mono" font-size="13" fill="#ffffff">${esc(c.status || "WATCHING 24/7")}</text>
<g class="card"><rect x="840" y="96" width="380" height="118" rx="14" fill="${p.card}"/><rect x="840" y="96" width="5" height="118" rx="2" fill="${p.ok}"/>
<text x="864" y="128" class="sans" font-size="15" font-weight="600" fill="${p.ink}">${esc(c.cardTitle || "☀️ Morning report")}</text>
<text x="864" y="156" class="sans" font-size="14" fill="${p.mute}">${esc(c.cardLine1 || "12 commits yesterday · 3 repos")}</text>
<text x="864" y="180" class="sans" font-size="14" fill="${p.mute}">${esc(c.cardLine2 || "Focus today: ship the invoice fix")}</text></g>
${days.map((d, i) => `<text x="${150 + i * 152}" y="392" text-anchor="middle" class="mono" font-size="12" letter-spacing="2" fill="${p.mute}">${d}</text>`).join("")}
<line x1="60" y1="330" x2="1220" y2="330" stroke="${p.line}"/>
<path class="beat" d="${beat}" fill="none" stroke="${p.bot}" stroke-width="3" stroke-linejoin="round"/>`,
  `<linearGradient id="hb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.top}"/><stop offset="1" stop-color="${p.bot}"/></linearGradient>`);
}

// ---------------------------------------------------------------- reactor: dark HUD, Orbitron, rotating arc-reactor rings and a voice meter
export function reactor(c) {
  const C = c.accent || "#00d4ff";
  const bars = Array.from({ length: 28 }, (_, i) => `<rect class="bar" style="animation-delay:${((i * 37) % 11) / 10}s" x="${60 + i * 16}" y="300" width="8" height="60" rx="3" fill="${C}" fill-opacity="${0.35 + ((i * 7) % 6) / 10}"/>`).join("");
  const ticks = Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 2, r1 = 150, r2 = i % 5 ? 156 : 164; return `<line x1="${(960 + r1 * Math.cos(a)).toFixed(1)}" y1="${(210 + r1 * Math.sin(a)).toFixed(1)}" x2="${(960 + r2 * Math.cos(a)).toFixed(1)}" y2="${(210 + r2 * Math.sin(a)).toFixed(1)}" stroke="${C}" stroke-opacity=".5"/>`; }).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("orbitron", "sharetech")}
.or{font-family:orbitron,"Segoe UI",sans-serif}.st{font-family:sharetech,Consolas,monospace}
.spin{transform-origin:960px 210px;animation:spin 14s linear infinite}.spinr{transform-origin:960px 210px;animation:spin 9s linear infinite reverse}@keyframes spin{to{transform:rotate(360deg)}}
.core{animation:core 2.4s ease-in-out infinite}@keyframes core{50%{opacity:.55}}
.bar{transform-box:fill-box;transform-origin:bottom;animation:bar 1.1s ease-in-out infinite alternate}@keyframes bar{from{transform:scaleY(.25)}to{transform:scaleY(1)}}`,
  `<rect width="${W}" height="${H}" fill="#0a0a0f"/><rect width="${W}" height="${H}" fill="url(#rg)"/>
<text x="60" y="76" class="st" font-size="15" letter-spacing="4" fill="${C}">${esc(c.eyebrow || "")}</text>
<text x="56" y="168" class="or" font-size="78" letter-spacing="6" fill="#e0e0e0">${esc(c.title)}</text>
<text x="60" y="216" class="st" font-size="21" fill="#9aa4b2">${esc(c.tagline)}</text>
<text x="60" y="270" class="st" font-size="14" letter-spacing="3" fill="${C}">● ${esc(c.status || "LISTENING")}</text>
${bars}
${ticks}
<g class="spin"><circle cx="960" cy="210" r="128" fill="none" stroke="${C}" stroke-width="2" stroke-dasharray="120 40 30 40" stroke-opacity=".8"/></g>
<g class="spinr"><circle cx="960" cy="210" r="104" fill="none" stroke="${C}" stroke-width="6" stroke-dasharray="40 24" stroke-opacity=".35"/></g>
<circle cx="960" cy="210" r="78" fill="none" stroke="${C}" stroke-opacity=".6"/>
<circle class="core" cx="960" cy="210" r="46" fill="url(#core)"/>
<text x="960" y="404" text-anchor="middle" class="st" font-size="13" letter-spacing="3" fill="#6b7280">${esc(c.footer || "")}</text>`,
  `<radialGradient id="rg" cx=".75" cy=".5" r=".55"><stop offset="0" stop-color="${C}" stop-opacity=".14"/><stop offset="1" stop-color="${C}" stop-opacity="0"/></radialGradient>
<radialGradient id="core"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="${C}"/><stop offset="1" stop-color="${C}" stop-opacity=".1"/></radialGradient>`);
}

// ---------------------------------------------------------------- pocket: an Android phone with a pulsing mic and chat bubbles
export function pocket(c) {
  const p = c.palette || { bg: "#0b1626", navy: "#1e3a5f", blue: "#3b82f6", ink: "#ffffff", mute: "#94a3b8", bubble: "#1a2b44" };
  const msgs = c.messages || [["you", "Remind me to call Dana at 4"], ["ai", "Done. I'll ping you at 4:00 PM."], ["you", "What's on tomorrow?"], ["ai", "Two meetings and a dentist at 2."]];
  const bub = msgs.map(([who, t], i) => {
    const me = who === "you", w = Math.min(230, t.length * 7.6 + 28), x = me ? 1150 - w : 892, y = 118 + i * 52;
    return `<g class="msg" style="animation-delay:${(i * 0.9).toFixed(1)}s"><rect x="${x}" y="${y}" width="${w}" height="38" rx="16" fill="${me ? p.blue : p.bubble}"/><text x="${x + 14}" y="${y + 24}" class="sans" font-size="13" fill="${p.ink}">${esc(t)}</text></g>`;
  }).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("jakarta", "inter")}
.jk{font-family:jakarta,"Segoe UI",sans-serif}.sans{font-family:inter,"Segoe UI",sans-serif}
.msg{animation:msg 7s ease-out infinite backwards}@keyframes msg{0%{opacity:0;transform:translateY(8px)}6%,90%{opacity:1;transform:none}100%{opacity:0}}
.ring{transform-origin:1016px 360px;animation:ring 2.2s ease-out infinite}@keyframes ring{0%{transform:scale(.6);opacity:.8}100%{transform:scale(1.9);opacity:0}}`,
  `<rect width="${W}" height="${H}" fill="${p.bg}"/><rect width="${W}" height="${H}" fill="url(#pk)"/>
<text x="60" y="78" class="jk" font-size="13" letter-spacing="3" fill="${p.blue}">${esc(c.eyebrow || "")}</text>
<text x="56" y="168" class="jk" font-size="76" letter-spacing="-2" fill="${p.ink}">${esc(c.title)}</text>
<text x="60" y="214" class="sans" font-size="20" fill="${p.mute}">${esc(c.tagline)}</text>
${(c.chips || []).map((ch, i, a) => { const x = 60 + a.slice(0, i).reduce((s, t) => s + t.length * 8.2 + 40, 0); return `<rect x="${x}" y="254" width="${ch.length * 8.2 + 28}" height="34" rx="17" fill="${p.navy}"/><text x="${x + 14}" y="276" class="sans" font-size="14" fill="${p.ink}">${esc(ch)}</text>`; }).join("")}
<rect x="868" y="24" width="296" height="420" rx="40" fill="#05090f" stroke="#2b3c55" stroke-width="2"/>
<rect x="880" y="36" width="272" height="410" rx="30" fill="${p.navy}"/>
<rect x="990" y="46" width="52" height="8" rx="4" fill="#05090f"/>
<text x="900" y="92" class="jk" font-size="16" fill="${p.ink}">${esc(c.appName || "Jarvis")}</text><circle cx="1134" cy="86" r="5" fill="#22c55e"/>
${bub}
<circle class="ring" cx="1016" cy="360" r="26" fill="none" stroke="${p.blue}" stroke-width="2"/>
<circle cx="1016" cy="360" r="26" fill="${p.blue}"/><rect x="1010" y="346" width="12" height="20" rx="6" fill="#fff"/><path d="M1004 360a12 12 0 0 0 24 0M1016 372v6" stroke="#fff" stroke-width="2.5" fill="none"/>`,
  `<radialGradient id="pk" cx=".8" cy=".6" r=".6"><stop offset="0" stop-color="${p.blue}" stop-opacity=".22"/><stop offset="1" stop-color="${p.blue}" stop-opacity="0"/></radialGradient>`);
}

// ---------------------------------------------------------------- digest: a clock sweeping 7 AM to 7 PM and two summary emails landing in an inbox
export function digest(c) {
  const p = c.palette || { bg: "#f8fafc", card: "#ffffff", ink: "#1a1a1a", navy: "#1e3a5f", blue: "#3b82f6", mute: "#94a3b8", line: "#e2e8f0", ok: "#22c55e" };
  const mails = c.mails || [["7:00 AM", "☀️ Morning digest", "9 commits · 2 PRs merged · 1 to review"], ["7:00 PM", "🌙 Evening digest", "Shipped: invoice fix · Tomorrow: tests"]];
  const mailEls = mails.map(([t, s, b], i) => `<g class="mail" style="animation-delay:${(i * 2.5).toFixed(1)}s"><rect x="716" y="${150 + i * 96}" width="500" height="80" rx="12" fill="${p.card}" stroke="${p.line}"/><circle cx="748" cy="${190 + i * 96}" r="16" fill="${i ? p.navy : p.blue}"/><text x="748" y="${195 + i * 96}" text-anchor="middle" class="sans" font-size="13" fill="#fff">BOT</text>
<text x="776" y="${182 + i * 96}" class="sans" font-size="15" font-weight="600" fill="${p.ink}">${esc(s)}</text><text x="1196" y="${182 + i * 96}" text-anchor="end" class="mono" font-size="12" fill="${p.mute}">${esc(t)}</text>
<text x="776" y="${206 + i * 96}" class="sans" font-size="14" fill="#475569">${esc(b)}</text></g>`).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("inter", "inter900", "plexmono")}
.sans{font-family:inter,"Segoe UI",sans-serif}.x{font-family:inter900,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}
.hand{transform-origin:150px 306px;animation:hand 10s ease-in-out infinite}@keyframes hand{0%,10%{transform:rotate(-150deg)}45%,55%{transform:rotate(30deg)}90%,100%{transform:rotate(210deg)}}
.mail{animation:mail 10s ease-out infinite backwards}@keyframes mail{0%{opacity:0;transform:translateY(-14px)}6%,90%{opacity:1;transform:none}100%{opacity:0}}`,
  `<rect width="${W}" height="${H}" fill="${p.bg}"/>
<text x="60" y="78" class="mono" font-size="13" letter-spacing="3" fill="${p.blue}">${esc(c.eyebrow || "")}</text>
<text x="56" y="152" class="x" font-size="58" letter-spacing="-2" fill="${p.navy}">${esc(c.title)}</text>
<text x="60" y="196" class="sans" font-size="19" fill="#475569">${esc(c.tagline)}</text>
<text x="250" y="300" class="mono" font-size="14" fill="${p.mute}">${esc(c.footnote || "")}</text>
<text x="250" y="326" class="mono" font-size="14" fill="${p.navy}">${esc(c.footnote2 || "7:00 AM · 7:00 PM, every day")}</text>
<circle cx="150" cy="306" r="70" fill="${p.card}" stroke="${p.line}" stroke-width="2"/>
${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${(150 + 56 * Math.sin(a)).toFixed(1)}" cy="${(306 - 56 * Math.cos(a)).toFixed(1)}" r="${i % 3 ? 2.5 : 4}" fill="${i === 7 ? p.blue : p.mute}"/>`; }).join("")}
<g class="hand"><line x1="150" y1="306" x2="150" y2="258" stroke="${p.navy}" stroke-width="4" stroke-linecap="round"/></g><circle cx="150" cy="306" r="6" fill="${p.blue}"/>
<text x="716" y="122" class="sans" font-size="14" font-weight="600" fill="${p.navy}">Inbox</text><text x="1216" y="122" text-anchor="end" class="mono" font-size="12" fill="${p.ok}">● FREE · NO SERVER</text>
${mailEls}`);
}

// ---------------------------------------------------------------- popup: a browser page with a Chrome extension popup capturing leads into a sheet
export function popup(c) {
  const p = c.palette || { page: "#f1f5f9", dark: "#0f172a", panel: "#1e293b", ink: "#e2e8f0", mute: "#94a3b8", blue: "#3b82f6", blue2: "#2563eb", green: "#22c55e", line: "#334155" };
  const rows = c.rows || ["14 Oak St · $182k · Owner: R. Hale", "88 Birch Ln · $240k · Owner: T. Moss", "3 Cedar Ct · $199k · Owner: K. Ruiz"];
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("inter", "inter900", "plexmono")}
.sans{font-family:inter,"Segoe UI",sans-serif}.x{font-family:inter900,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}
.row{animation:row 6s ease-in-out infinite backwards}@keyframes row{0%{opacity:0;transform:translateX(-30px)}10%,88%{opacity:1;transform:none}100%{opacity:0}}
.n,.n2{opacity:0}.n{animation:n 6s steps(1) infinite}@keyframes n{0%{opacity:1}33%,100%{opacity:0}}.n2{animation:n2 6s steps(1) infinite}@keyframes n2{0%,32%{opacity:0}33%,65%{opacity:1}66%,100%{opacity:0}}.n3{animation:n3 6s steps(1) infinite}@keyframes n3{0%,65%{opacity:0}66%,100%{opacity:1}}
.press{animation:press 6s ease-in-out infinite}@keyframes press{80%{transform:translateY(0)}84%{transform:translateY(2px)}88%{transform:none}}`,
  `<rect width="${W}" height="${H}" fill="${p.dark}"/>
<text x="60" y="78" class="mono" font-size="13" letter-spacing="3" fill="${p.green}">${esc(c.eyebrow || "")}</text>
<text x="56" y="156" class="x" font-size="64" letter-spacing="-2" fill="${p.ink}">${esc(c.title)}</text>
<text x="60" y="200" class="sans" font-size="19" fill="${p.mute}">${esc(c.tagline)}</text>
<text x="60" y="246" class="sans" font-size="14" fill="${p.mute}">Into your Google Sheet:</text>
${rows.map((r, i) => `<g class="row" style="animation-delay:${(i * 0.9).toFixed(1)}s"><rect x="60" y="${262 + i * 38}" width="420" height="30" rx="6" fill="${p.panel}" stroke="${p.line}"/><rect x="60" y="${262 + i * 38}" width="4" height="30" fill="${p.green}"/><text x="76" y="${282 + i * 38}" class="mono" font-size="12" fill="${p.ink}">${esc(r)}</text></g>`).join("")}
<rect x="540" y="40" width="440" height="352" rx="12" fill="${p.page}"/>
<rect x="540" y="40" width="440" height="34" rx="12" fill="#e2e8f0"/><circle cx="560" cy="57" r="5" fill="#f87171"/><circle cx="576" cy="57" r="5" fill="#fbbf24"/><circle cx="592" cy="57" r="5" fill="#34d399"/>
<rect x="612" y="48" width="280" height="18" rx="9" fill="#ffffff"/><text x="624" y="61" class="sans" font-size="11" fill="#64748b">${esc(c.site || "listings.example/for-sale")}</text>
${[0, 1, 2].map((i) => `<rect x="560" y="${92 + i * 96}" width="120" height="80" rx="8" fill="#cbd5e1"/><rect x="694" y="${100 + i * 96}" width="150" height="12" rx="6" fill="#94a3b8"/><rect x="694" y="${122 + i * 96}" width="100" height="10" rx="5" fill="#cbd5e1"/><rect x="694" y="${142 + i * 96}" width="60" height="16" rx="8" fill="${p.green}" fill-opacity=".25"/>`).join("")}
<rect x="900" y="60" width="320" height="320" rx="12" fill="${p.dark}" stroke="${p.line}"/>
<rect x="900" y="60" width="320" height="70" rx="12" fill="url(#ph)"/><text x="1060" y="94" text-anchor="middle" class="sans" font-size="16" font-weight="700" fill="#fff">${esc(c.popupTitle || "🛠️ Lead Scraper")}</text><text x="1060" y="116" text-anchor="middle" class="sans" font-size="11" fill="#dbeafe">${esc(c.popupSub || "Skip trace + Google Sheets push")}</text>
<text x="960" y="170" text-anchor="middle" class="x" font-size="28" fill="${p.blue}"><tspan class="n">1</tspan></text><text x="960" y="170" text-anchor="middle" class="x" font-size="28" fill="${p.blue}"><tspan class="n2">2</tspan></text><text x="960" y="170" text-anchor="middle" class="x" font-size="28" fill="${p.blue}"><tspan class="n3">3</tspan></text>
<text x="960" y="190" text-anchor="middle" class="sans" font-size="11" fill="${p.mute}">Pending</text>
<text x="1060" y="170" text-anchor="middle" class="x" font-size="28" fill="${p.blue}">3</text><text x="1060" y="190" text-anchor="middle" class="sans" font-size="11" fill="${p.mute}">Today</text>
<text x="1160" y="170" text-anchor="middle" class="x" font-size="28" fill="${p.green}">✓</text><text x="1160" y="190" text-anchor="middle" class="sans" font-size="11" fill="${p.mute}">Sheet</text>
<g class="press"><rect x="916" y="212" width="288" height="38" rx="8" fill="${p.green}"/><text x="1060" y="236" text-anchor="middle" class="sans" font-size="13" font-weight="600" fill="#fff">📊 Push all to Google Sheet</text></g>
<rect x="916" y="260" width="288" height="38" rx="8" fill="${p.blue}"/><text x="1060" y="284" text-anchor="middle" class="sans" font-size="13" font-weight="600" fill="#fff">📁 Export CSV backup</text>
<rect x="916" y="308" width="288" height="38" rx="8" fill="none" stroke="${p.line}"/><text x="1060" y="332" text-anchor="middle" class="sans" font-size="13" fill="${p.ink}">📋 View pending leads</text>`,
  `<linearGradient id="ph" x1="0" x2="1"><stop offset="0" stop-color="${p.blue2}"/><stop offset="1" stop-color="${p.blue}"/></linearGradient>`);
}

// ---------------------------------------------------------------- pipeline: dark deal board where one deal card travels to "Closed"
export function pipeline(c) {
  const p = c.palette || { bg: "#0a0d14", col: "#111827", line: "#1f2937", ink: "#e2e8f0", mute: "#64748b", cyan: "#06b6d4", blue: "#3b82f6", green: "#10b981", amber: "#f59e0b", red: "#ef4444" };
  const cols = c.columns || [["Lead", p.blue], ["Offer", p.amber], ["Contract", p.cyan], ["Closed", p.green]];
  const cw = 150, x0 = 640;
  const colEls = cols.map(([n, col], i) => `<rect x="${x0 + i * (cw + 10)}" y="70" width="${cw}" height="300" rx="10" fill="${p.col}" stroke="${p.line}"/><circle cx="${x0 + i * (cw + 10) + 16}" cy="92" r="4" fill="${col}"/><text x="${x0 + i * (cw + 10) + 28}" y="97" class="dm" font-size="13" fill="${p.ink}">${esc(n)}</text>
<rect x="${x0 + i * (cw + 10) + 10}" y="${180 + (i % 2) * 70}" width="${cw - 20}" height="52" rx="8" fill="#0f172a" stroke="${p.line}"/><rect x="${x0 + i * (cw + 10) + 20}" y="${192 + (i % 2) * 70}" width="${70 + (i * 13) % 30}" height="8" rx="4" fill="${p.mute}"/><rect x="${x0 + i * (cw + 10) + 20}" y="${208 + (i % 2) * 70}" width="44" height="8" rx="4" fill="${col}" fill-opacity=".6"/>`).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("dmsans", "plexmono")}
.dm{font-family:dmsans,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}
.deal{animation:deal 8s cubic-bezier(.6,0,.3,1) infinite}@keyframes deal{0%,12%{transform:translateX(0)}25%,37%{transform:translateX(160px)}50%,62%{transform:translateX(320px)}75%,92%{transform:translateX(480px)}100%{transform:translateX(0)}}
.fee{animation:fee 8s steps(1) infinite}@keyframes fee{0%,74%{opacity:0}75%,92%{opacity:1}93%,100%{opacity:0}}`,
  `<rect width="${W}" height="${H}" fill="${p.bg}"/><rect width="${W}" height="${H}" fill="url(#pl)"/>
<text x="60" y="76" class="mono" font-size="13" letter-spacing="3" fill="${p.cyan}">⚡ ${esc(c.eyebrow || "")}</text>
<text x="56" y="156" class="dm" font-size="60" letter-spacing="-2" fill="${p.ink}">${esc(c.title)}</text>
<text x="60" y="200" class="dm" font-size="19" fill="#94a3b8">${esc(c.tagline)}</text>
${(c.files || ["index.html", "style.css", "app.js"]).map((f, i) => `<rect x="${60 + i * 150}" y="250" width="136" height="44" rx="8" fill="${p.col}" stroke="${p.line}"/><text x="${128 + i * 150}" y="277" text-anchor="middle" class="mono" font-size="13" fill="${p.ink}">${esc(f)}</text>`).join("")}
<text x="60" y="336" class="mono" font-size="13" fill="${p.mute}">${esc(c.footnote || "")}</text>
${colEls}
<g class="deal"><rect x="${x0 + 8}" y="116" width="${cw - 16}" height="52" rx="8" fill="#0b1220" stroke="${p.cyan}" stroke-width="1.5"/><text x="${x0 + 20}" y="138" class="dm" font-size="13" fill="${p.ink}">${esc(c.deal || "412 Elm St")}</text><text x="${x0 + 20}" y="157" class="mono" font-size="11" fill="${p.cyan}">${esc(c.dealValue || "ARV $240k")}</text></g>
<g class="fee"><rect x="${x0 + 3 * (cw + 10) + 14}" y="330" width="${cw - 28}" height="28" rx="14" fill="${p.green}" fill-opacity=".18" stroke="${p.green}"/><text x="${x0 + 3 * (cw + 10) + cw / 2}" y="349" text-anchor="middle" class="mono" font-size="12" fill="${p.green}">${esc(c.fee || "+$12,500 fee")}</text></g>`,
  `<radialGradient id="pl" cx=".05" cy="0" r=".7"><stop offset="0" stop-color="${p.cyan}" stop-opacity=".14"/><stop offset="1" stop-color="${p.cyan}" stop-opacity="0"/></radialGradient>`);
}

// ---------------------------------------------------------------- relay: a form request stored first, then fanned out to every channel
export function relay(c) {
  const p = c.palette || { bg: "#0f172a", card: "#1e293b", ink: "#f8fafc", mute: "#94a3b8", line: "#334155", a: "#6366f1", ok: "#10b981", warn: "#f59e0b" };
  const outs = c.outputs || [["📧", "Email to the owner"], ["💬", "Text to the owner"], ["📋", "Into the CRM"]];
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("spacegrotesk", "inter", "plexmono")}
.sg{font-family:spacegrotesk,"Segoe UI",sans-serif}.sans{font-family:inter,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}
.pkt{animation:pkt 6s ease-in-out infinite}@keyframes pkt{0%{transform:translateX(0);opacity:0}8%{opacity:1}35%{transform:translateX(250px);opacity:1}40%,100%{transform:translateX(250px);opacity:0}}
.fan{stroke-dasharray:220;animation:fan 6s ease-in-out infinite backwards}@keyframes fan{0%,40%{stroke-dashoffset:220}60%,92%{stroke-dashoffset:0}100%{stroke-dashoffset:220}}
.ok{animation:ok 6s steps(1) infinite backwards}@keyframes ok{0%,60%{opacity:0}61%,94%{opacity:1}95%,100%{opacity:0}}
.lock{animation:lock 6s ease-out infinite}@keyframes lock{0%,34%{opacity:.4}38%,92%{opacity:1}}`,
  `<rect width="${W}" height="${H}" fill="${p.bg}"/>
<text x="60" y="76" class="mono" font-size="13" letter-spacing="3" fill="${p.ok}">${esc(c.eyebrow || "")}</text>
<text x="56" y="148" class="sg" font-size="56" letter-spacing="-1.5" fill="${p.ink}">${esc(c.title)}</text>
<text x="60" y="190" class="sans" font-size="19" fill="${p.mute}">${esc(c.tagline)}</text>
<rect x="60" y="232" width="260" height="140" rx="14" fill="${p.card}" stroke="${p.line}"/>
<text x="80" y="262" class="sans" font-size="14" font-weight="600" fill="${p.ink}">${esc(c.formTitle || "Request an estimate")}</text>
<rect x="80" y="276" width="220" height="22" rx="6" fill="${p.bg}"/><rect x="80" y="306" width="220" height="22" rx="6" fill="${p.bg}"/>
<rect x="80" y="338" width="100" height="24" rx="12" fill="${p.a}"/><text x="130" y="355" text-anchor="middle" class="sans" font-size="12" fill="#fff">Send</text>
<g class="pkt"><circle cx="340" cy="302" r="8" fill="${p.a}"/></g>
<rect x="600" y="232" width="200" height="140" rx="14" fill="${p.card}" stroke="${p.ok}" stroke-opacity=".6"/>
<g class="lock"><rect x="682" y="266" width="36" height="30" rx="6" fill="${p.ok}"/><path d="M688 266v-8a12 12 0 0 1 24 0v8" fill="none" stroke="${p.ok}" stroke-width="4"/></g>
<text x="700" y="326" text-anchor="middle" class="sans" font-size="14" font-weight="600" fill="${p.ink}">${esc(c.storeTitle || "Saved first")}</text>
<text x="700" y="348" text-anchor="middle" class="sans" font-size="12" fill="${p.mute}">${esc(c.storeSub || "nothing is ever lost")}</text>
${outs.map(([ic, t], i) => { const y = 92 + i * 104; return `<path class="fan" d="M800 302 C 870 302, 870 ${y + 32}, 920 ${y + 32}" fill="none" stroke="${p.ok}" stroke-width="2"/>
<rect x="920" y="${y}" width="320" height="64" rx="12" fill="${p.card}" stroke="${p.line}"/><text x="940" y="${y + 40}" class="sans" font-size="20">${ic}</text><text x="972" y="${y + 38}" class="sans" font-size="14" fill="${p.ink}">${esc(t)}</text>
<g class="ok"><circle cx="1216" cy="${y + 32}" r="11" fill="${p.ok}"/><path d="M1210 ${y + 32}l4 4 8-8" stroke="#fff" stroke-width="2.5" fill="none"/></g>`; }).join("")}
<text x="920" y="${92 + outs.length * 104 + 2}" class="mono" font-size="12" fill="${p.warn}">${esc(c.retry || "↻ retries until delivered")}</text>`);
}

// ---------------------------------------------------------------- drafting: a navy design sheet with nine agent nodes being drawn, stamped "in design"
export function drafting(c) {
  const p = c.palette || { bg: "#0b1d33", line: "#2b4a6f", ink: "#e0f2fe", mute: "#7dd3fc", accent: "#00d4ff", stamp: "#f43f5e" };
  const agents = c.agents || ["Voice", "Memory", "Planner", "Coder", "Browser", "Vision", "Mail", "Calendar", "Guard"];
  const cx = 960, cy = 210;
  const nodes = agents.map((a, i) => { const ang = (i / agents.length) * Math.PI * 2 - Math.PI / 2, x = cx + 150 * Math.cos(ang), y = cy + 150 * Math.sin(ang); return `<line class="ln" style="animation-delay:${(i * 0.3).toFixed(1)}s" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${p.mute}" stroke-opacity=".5" stroke-dasharray="4 4"/><g class="nd" style="animation-delay:${(i * 0.3).toFixed(1)}s"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26" fill="${p.bg}" stroke="${p.accent}"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" class="mono" font-size="10" fill="${p.ink}">${esc(a)}</text></g>`; }).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("orbitron", "plexmono", "inter")}
.or{font-family:orbitron,"Segoe UI",sans-serif}.mono{font-family:plexmono,Consolas,monospace}.sans{font-family:inter,"Segoe UI",sans-serif}
.nd{animation:nd 8s ease-out infinite backwards}@keyframes nd{0%{opacity:0}6%,92%{opacity:1}100%{opacity:0}}
.ln{animation:nd 8s ease-out infinite backwards}
.stmp{animation:stmp 8s ease-out infinite backwards}@keyframes stmp{0%,40%{opacity:0;transform:scale(1.4)}46%,92%{opacity:1;transform:none}100%{opacity:0}}`,
  `<rect width="${W}" height="${H}" fill="${p.bg}"/><rect width="${W}" height="${H}" fill="url(#bp1)"/><rect width="${W}" height="${H}" fill="url(#bp2)"/>
<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="${p.line}"/>
<text x="60" y="76" class="mono" font-size="13" letter-spacing="3" fill="${p.mute}">${esc(c.eyebrow || "")}</text>
<text x="56" y="160" class="or" font-size="64" letter-spacing="4" fill="${p.ink}">${esc(c.title)}</text>
<text x="60" y="204" class="sans" font-size="19" fill="${p.mute}">${esc(c.tagline)}</text>
<text x="60" y="268" class="mono" font-size="14" fill="${p.ink}">${esc(c.pointer || "")}</text>
<rect x="60" y="${H - 78}" width="260" height="38" fill="none" stroke="${p.line}"/><text x="72" y="${H - 54}" class="mono" font-size="11" fill="${p.mute}">${esc(c.sheet || "SHEET 1 OF 1 · REV 0 · DRAFT")}</text>
${nodes}
<circle cx="${cx}" cy="${cy}" r="40" fill="${p.bg}" stroke="${p.accent}" stroke-width="2"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" class="or" font-size="13" fill="${p.accent}">${esc(c.core || "CORE")}</text>
<g class="stmp" style="transform-box:fill-box;transform-origin:center"><g transform="translate(520 300) rotate(-6)"><rect x="-110" y="-24" width="220" height="48" rx="6" fill="none" stroke="${p.stamp}" stroke-width="3"/><text y="9" text-anchor="middle" class="or" font-size="20" letter-spacing="4" fill="${p.stamp}">${esc(c.stampText || "IN DESIGN")}</text></g></g>`,
  `<pattern id="bp1" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="${p.ink}" stroke-opacity=".05"/></pattern>
<pattern id="bp2" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="${p.ink}" stroke-opacity=".1"/></pattern>`);
}

// ---------------------------------------------------------------- tape: black, one acid accent, hazard tape across an outlined wordmark (early builds)
export function tape(c) {
  const A = c.accent || "#B7FF4A";
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("bebas", "plexmono", "inter")}
.bb{font-family:bebas,Impact,sans-serif}.mono{font-family:plexmono,Consolas,monospace}.sans{font-family:inter,"Segoe UI",sans-serif}
.slide{animation:slide 4s linear infinite}@keyframes slide{to{transform:translateX(-80px)}}
.blink{animation:blink 1.2s steps(1) infinite}@keyframes blink{50%{opacity:0}}`,
  `<rect width="${W}" height="${H}" fill="#0a0a0a"/>
<text x="40" y="300" class="bb" font-size="300" letter-spacing="8" fill="none" stroke="${A}" stroke-opacity=".35" stroke-width="2">${esc(c.word || c.title)}</text>
<g transform="rotate(-6 640 210)"><rect x="-40" y="176" width="1400" height="64" fill="${A}"/>
<g class="slide">${Array.from({ length: 22 }, (_, i) => `<path d="M${-40 + i * 80} 176h40l-40 64h-40z" fill="#0a0a0a"/>`).join("")}</g>
<rect x="420" y="186" width="440" height="44" fill="#0a0a0a"/><text x="640" y="218" text-anchor="middle" class="bb" font-size="34" letter-spacing="6" fill="${A}">${esc(c.tapeText || "EARLY BUILD · NOT THE APP")}</text></g>
<text x="60" y="80" class="mono" font-size="13" letter-spacing="3" fill="${A}">${esc(c.eyebrow || "")}</text>
<text x="60" y="352" class="sans" font-size="20" fill="#d4d4d4">${esc(c.tagline)}</text>
<text x="60" y="384" class="mono" font-size="14" fill="${A}"><tspan class="blink">▸</tspan> ${esc(c.pointer || "")}</text>`);
}

// ---------------------------------------------------------------- drawingsheet: an engineering drawing sheet; two documents get redlined where they disagree
const SHEET = {
  light: { paper: "#eef2f3", panel: "#ffffff", ink: "#14213d", muted: "#5a6577", line: "#c9d3da", blue: "#1f5fad", red: "#c8102e", green: "#2f7d4f", grid: "#1f5fad" },
  dark: { paper: "#0e1a2b", panel: "#13243a", ink: "#dce8f2", muted: "#94a8bf", line: "#2b4462", blue: "#6aa6ee", red: "#ff6b7d", green: "#62c78e", grid: "#6aa6ee" },
};
function sheetFrame(p, w, h) {
  const zonesX = ["1", "2", "3", "4", "5", "6"].map((z, i) => `<text x="${16 + (i + 0.5) * ((w - 32) / 6)}" y="13" text-anchor="middle" class="m" font-size="9" fill="${p.muted}">${z}</text><text x="${16 + (i + 0.5) * ((w - 32) / 6)}" y="${h - 4}" text-anchor="middle" class="m" font-size="9" fill="${p.muted}">${z}</text>`).join("");
  const zonesY = ["A", "B", "C"].map((z, i) => `<text x="8" y="${20 + (i + 0.5) * ((h - 40) / 3)}" text-anchor="middle" class="m" font-size="9" fill="${p.muted}">${z}</text><text x="${w - 8}" y="${20 + (i + 0.5) * ((h - 40) / 3)}" text-anchor="middle" class="m" font-size="9" fill="${p.muted}">${z}</text>`).join("");
  return `<rect width="${w}" height="${h}" fill="${p.paper}"/><rect x="16" y="18" width="${w - 32}" height="${h - 36}" fill="url(#sg)"/>
<rect x="16" y="18" width="${w - 32}" height="${h - 36}" fill="none" stroke="${p.ink}" stroke-width="2"/>${zonesX}${zonesY}`;
}
const sheetDefs = (p) => `<pattern id="sg" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${p.grid}" stroke-opacity=".09"/></pattern>`;

export function drawingsheet(c, { dark } = {}) {
  const p = SHEET[dark ? "dark" : "light"];
  const docs = c.docs || [
    { file: "ALP-DWG-0005.pdf", kind: "Engineering drawing · page 1", line: ["BV-7891 Ball valve  Bronze", "C95800  Rated "], value: "1500 psi", tail: "  Qty 8" },
    { file: "ALP-INS-0001.pdf", kind: "Inspection report · page 1", line: ["BV-7891 Ball valve hydrostatic", "test at "], value: "600 psi", tail: "  - PASS" },
  ];
  const doc = (d, x, y, i) => `<g><rect x="${x}" y="${y}" width="300" height="150" fill="${p.panel}" stroke="${p.ink}" stroke-width="1.5"/>
<text x="${x + 16}" y="${y + 26}" class="m" font-size="13" fill="${p.blue}">${esc(d.file)}</text>
<text x="${x + 16}" y="${y + 46}" class="s" font-size="12" fill="${p.muted}">${esc(d.kind)}</text>
<line x1="${x + 16}" y1="${y + 58}" x2="${x + 284}" y2="${y + 58}" stroke="${p.line}"/>
<text x="${x + 16}" y="${y + 84}" class="m" font-size="13" fill="${p.ink}" xml:space="preserve">${esc(d.line[0])}</text>
<text x="${x + 16}" y="${y + 104}" class="m" font-size="13" fill="${p.ink}" xml:space="preserve">${esc(d.line[1])}<tspan fill="${p.red}">${esc(d.value)}</tspan>${esc(d.tail)}</text>
<g class="ok" style="animation-delay:${(3.4 + i * 0.4).toFixed(1)}s"><rect x="${x + 16}" y="${y + 118}" width="132" height="20" fill="none" stroke="${p.green}"/><text x="${x + 24}" y="${y + 132}" class="s" font-size="11" fill="${p.green}">✓ Verified in source</text></g></g>`;
  // value positions (monospace ~7.8px per char at 13px)
  const v1x = 650 + 16 + docs[0].line[1].length * 7.8, v2x = 920 + 16 + docs[1].line[1].length * 7.8;
  const cloud = (x, y, wch) => { const w = wch * 7.8 + 12; let d = `M${x - 6} ${y - 14}`; const n = Math.max(3, Math.round(w / 14)); for (let k = 0; k < n; k++) d += ` a7 7 0 0 1 ${(w / n).toFixed(1)} 0`; d += ` a7 7 0 0 1 0 20`; for (let k = 0; k < n; k++) d += ` a7 7 0 0 1 ${(-w / n).toFixed(1)} 0`; return d + " a7 7 0 0 1 0 -20"; };
  const tb = c.titleBlock || [["PROJECT", "VAULT"], ["EVENT", "META GLOBAL AI HACKATHON 2026"], ["DRAWN BY", "LUKE KNIGHT"], ["SHEET", "1 OF 1"], ["REV", "A"]];
  const tbw = [96, 250, 132, 80, 52];
  let tx = W - 16 - tbw.reduce((a, b) => a + b, 0);
  const tbEls = tb.map(([k, v], i) => { const x = tx; tx += tbw[i]; return `<rect x="${x}" y="${H - 70}" width="${tbw[i]}" height="52" fill="${p.panel}" stroke="${p.ink}" stroke-width="1.5"/><text x="${x + 10}" y="${H - 52}" class="m" font-size="9" letter-spacing="1" fill="${p.muted}">${esc(k)}</text><text x="${x + 10}" y="${H - 30}" class="a" font-size="13" fill="${p.ink}">${esc(v)}</text>`; }).join("");
  return svg(`${c.title}: ${c.tagline}`, `${fontFace("archivo", "archivo5", "plexmono")}
.a{font-family:archivo,"Segoe UI",sans-serif}.s{font-family:archivo5,"Segoe UI",sans-serif}.m{font-family:plexmono,Consolas,monospace}
.scan{opacity:0;animation:scan 9s ease-in-out infinite}@keyframes scan{0%{transform:translateY(0);opacity:0}5%{opacity:.9}28%{transform:translateY(150px);opacity:.9}32%,100%{transform:translateY(150px);opacity:0}}
.cloud{stroke-dasharray:420;animation:cloud 9s ease-out infinite backwards}@keyframes cloud{0%,30%{stroke-dashoffset:420}40%,92%{stroke-dashoffset:0}100%{stroke-dashoffset:420}}
.tie{stroke-dasharray:6 5;animation:tie 9s steps(1) infinite backwards}@keyframes tie{0%,38%{opacity:0}40%,92%{opacity:1}100%{opacity:0}}
.ok{animation:ok 9s ease-out infinite backwards}@keyframes ok{0%,36%{opacity:0}40%,92%{opacity:1}100%{opacity:0}}`,
  `${sheetFrame(p, W, H)}
<rect x="60" y="56" width="44" height="44" fill="none" stroke="${p.ink}" stroke-width="2"/><circle cx="82" cy="78" r="12" fill="none" stroke="${p.ink}" stroke-width="2"/><path d="M82 62v32M66 78h32" stroke="${p.ink}" stroke-width="2"/>
<text x="120" y="92" class="a" font-size="40" letter-spacing="10" fill="${p.ink}">${esc(c.title)}</text>
<text x="60" y="152" class="a" font-size="28" fill="${p.ink}">${esc(c.headline || "Private document intelligence.")}</text>
<text x="60" y="186" class="a" font-size="28" fill="${p.blue}">${esc(c.headline2 || "Runs on this machine.")}</text>
${(c.lines || ["Reads every drawing, report and contract with Meta Llama.", "Checks every fact against a quote from the original.", "Redlines the places where documents disagree."]).map((t, i) => `<text x="60" y="${234 + i * 24}" class="s" font-size="16" fill="${p.muted}">${esc(t)}</text>`).join("")}
${doc(docs[0], 650, 70, 0)}${doc(docs[1], 920, 168, 1)}
<g class="scan"><rect x="650" y="70" width="570" height="3" fill="${p.blue}" fill-opacity=".7"/></g>
<path class="cloud" d="${cloud(v1x, 174 - 0, docs[0].value.length)}" transform="translate(0 0)" fill="none" stroke="${p.red}" stroke-width="2"/>
<path class="cloud" style="animation-delay:.3s" d="${cloud(v2x, 272, docs[1].value.length)}" fill="none" stroke="${p.red}" stroke-width="2"/>
<g class="tie"><path d="M${v1x + 20} 186 C ${v1x + 10} 240, ${v2x - 70} 268, ${v2x - 10} 268" fill="none" stroke="${p.red}" stroke-width="1.5"/>
<rect x="${740}" y="236" width="${(c.conflict || "CONFLICT · BV-7891").length * 7.4 + 16}" height="22" fill="${p.red}"/><text x="${748}" y="251" class="m" font-size="12" fill="${p.panel}">${esc(c.conflict || "CONFLICT · BV-7891")}</text></g>
${tbEls}`,
  sheetDefs(p));
}

// ---------------------------------------------------------------- sheetflow: a numbered process drawn as stations on a drawing sheet, with a rule band underneath
export function sheetflow(c, { dark } = {}) {
  const p = SHEET[dark ? "dark" : "light"];
  const steps = c.steps;
  const h = c.height || 378, n = steps.length, gap = 18, x0 = 40, w = (W - 2 * x0 - gap * (n - 1)) / n;
  const st = steps.map(([title, body, tag], i) => {
    const x = x0 + i * (w + gap);
    const lines = body.map((b, k) => `<text x="${x + 14}" y="${118 + k * 19}" class="s" font-size="13" fill="${p.muted}">${esc(b)}</text>`).join("");
    return `<g class="st" style="animation-delay:${(i * 0.5).toFixed(1)}s"><rect x="${x}" y="48" width="${w}" height="182" fill="${p.panel}" stroke="${p.ink}" stroke-width="1.5"/>
<circle cx="${x + 26}" cy="74" r="13" fill="none" stroke="${p.ink}" stroke-width="1.5"/><text x="${x + 26}" y="79" text-anchor="middle" class="m" font-size="12" fill="${p.ink}">${i + 1}</text>
<text x="${x + 48}" y="80" class="a" font-size="16" fill="${p.ink}">${esc(title)}</text>${lines}
${tag ? `<rect x="${x + 14}" y="200" width="${tag.length * 6.6 + 14}" height="18" fill="none" stroke="${tag.startsWith("!") ? p.red : p.green}"/><text x="${x + 21}" y="213" class="m" font-size="10.5" fill="${tag.startsWith("!") ? p.red : p.green}">${esc(tag.replace(/^!/, ""))}</text>` : ""}</g>
${i < n - 1 ? `<path d="M${x + w + 2} 130h${gap - 6}" stroke="${p.ink}" stroke-width="1.5"/><path d="M${x + w + gap - 4} 126l5 4-5 4z" fill="${p.ink}"/>` : ""}`;
  }).join("");
  const band = c.band ? `<rect x="${x0}" y="254" width="${W - 2 * x0}" height="${h - 254 - 40}" fill="none" stroke="${p.blue}" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="${x0 + 16}" y="280" class="m" font-size="11" letter-spacing="1.5" fill="${p.blue}">${esc(c.band.label)}</text>
${c.band.items.map((t, i) => `<text x="${x0 + 16 + (i % 2) * ((W - 2 * x0) / 2)}" y="${308 + Math.floor(i / 2) * 22}" class="s" font-size="13.5" fill="${p.ink}">${esc(t)}</text>`).join("")}` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="${esc(c.label || "How it works")}">
<defs>${sheetDefs(p)}</defs>
<style>${fontFace("archivo", "archivo5", "plexmono")}
.a{font-family:archivo,"Segoe UI",sans-serif}.s{font-family:archivo5,"Segoe UI",sans-serif}.m{font-family:plexmono,Consolas,monospace}
.st{animation:st 8s ease-out infinite backwards}@keyframes st{0%{opacity:.25}6%,92%{opacity:1}100%{opacity:.25}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>
${sheetFrame(p, W, h)}${st}${band}
</svg>
`;
}

function baseDivider(c) {
  const col = c.divider || c.a;
  if (c.flatDivider || c.theme === "agency" || c.theme === "mono") return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="10" viewBox="0 0 1280 10"><rect x="0" y="4" width="1280" height="2" fill="${"#737373"}"/></svg>\n`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="14" viewBox="0 0 1280 14"><defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".5" stop-color="${col}"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></linearGradient></defs><rect x="0" y="6" width="1280" height="2" fill="url(#d)"/><circle cx="640" cy="7" r="4" fill="${col}"/></svg>\n`;
}

// Generic, public themes. Project-specific themes live in your data folder (data/themes.mjs) and are
// merged on top, so a theme there with the same name wins.
const BASE = { mono: agency, fieldcrm, indigo, hud, island, godcut, aether, ledger, forge, blueprint, heartbeat, reactor, pocket, digest, popup, pipeline, relay, drafting, tape, drawingsheet };
let custom = {};
try {
  const { DATA } = await import("./data.mjs");
  const file = path.join(DATA, "themes.mjs");
  if (fs.existsSync(file)) custom = await import(pathToFileURL(file).href);
} catch { /* no data folder: generic themes only */ }
export const THEMES = { ...BASE, ...(custom.THEMES || {}) };
export const themedDivider = custom.themedDivider || baseDivider;
