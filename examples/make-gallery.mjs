// Renders one example banner per built-in theme (made-up apps) into examples/banners/.
// Usage: node examples/make-gallery.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.README_KIT_DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "data"); // examples only, never your private data
const { THEMES } = await import("../themes.mjs");
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "banners");
fs.mkdirSync(out, { recursive: true });

const EXAMPLES = {
  mono: { title: "Acme CRM", eyebrow: "ACME · CRM · OPERATING SYSTEM", tagline: "Every client, quote and invoice in one place.", kicker: "FOR SMALL SERVICE BUSINESSES", strip: ["Clients", "Quotes", "Jobs", "Invoices", "Calendar", "Reports"], code: "ACME-01" },
  fieldcrm: { title: "FieldDesk", eyebrow: "FIELD-SERVICE CRM", tagline: "Book the job, send the crew, get paid.", chips: ["Booking", "Crews", "Invoices", "Portal"], cta: "Book a visit", a: "#2f5a4b", b: "#4a7764" },
  indigo: { title: "Market Pulse", title2: "On Autopilot.", eyebrow: "REAL-TIME DEAL TRACKING", brand: "PULSE", subtitle: "DEAL DESK", tagline: "Every lead scored and followed up for you.", code: "PULSE", cta2: "See the demo" },
  hud: { title: "TRACKDAY", code: "TD 2.0", tagline: "Lap times, live, from your phone.", kicker: "GPS · SENSORS · LEADERBOARDS", gauge: "142", gaugeLabel: "KM/H · CIRCUIT", status: "LIVE", nav: ["HOME", "GARAGE", "MAP", "RACE", "CREW", "STATS"] },
  island: { title: "Notch Hub", tagline: "A tiny status pill for your desktop." },
  godcut: { title: "Clip Studio", tagline: "Raw footage in, finished reels out.", eyebrow: "AI VIDEO EDITING", code: "CS-1" },
};
for (const [theme, c] of Object.entries(EXAMPLES)) {
  const cfg = { theme, a: "#22d3ee", b: "#a855f7", chips: [], ...c };
  fs.writeFileSync(path.join(out, `${theme}.svg`), THEMES[theme](cfg, { isPrivate: false, dark: false }));
  console.log(`examples/banners/${theme}.svg`);
}
