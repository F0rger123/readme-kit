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
  aether: { title: "NIGHTSHIFT", wordmark: ["NIGHT", "SHIFT"], logo: "N", code: "AGENT 1.0", tagline: "An IDE with an assistant that ships while you sleep.", chips: ["Editor", "Agent", "Deploy"], file: "agent.ts", status: "AGENT · ONLINE" },
  ledger: { title: "Studio Back Office", eyebrow: "BACK OFFICE · AUTOPILOT", tagline: "Bookings, invoices and posts. You approve.", footnote: "BOOKINGS · INVOICES · SOCIAL" },
  blueprint: { title: "Tidy Pro", brand: "Tidy Pro", logo: "TP", version: "v1.2", tagline: "The plan for a home-services app, page by page.", eyebrow: "PRODUCT BLUEPRINT" },
  heartbeat: { title: "PULSEBOT", eyebrow: "COMMIT WATCHER", tagline: "Watches your repos and reports back every morning." },
  reactor: { title: "ORBIT", eyebrow: "VOICE ASSISTANT", tagline: "A desktop assistant that listens and acts.", footer: "VOICE · MEMORY · TOOLS" },
  pocket: { title: "Pocket Pal", eyebrow: "ANDROID ASSISTANT", tagline: "Your assistant, in your pocket.", chips: ["Voice", "Reminders"], appName: "Pal" },
  digest: { title: "Standup Mailer", eyebrow: "FREE · GITHUB ACTIONS", tagline: "Your work, summarized twice a day." },
  popup: { title: "Listing Grabber", eyebrow: "CHROME EXTENSION", tagline: "Save listings to a sheet in one click.", popupTitle: "📌 Listing Grabber" },
  pipeline: { title: "DealDesk", eyebrow: "DEAL TRACKER", tagline: "Every deal from first call to closed." },
  relay: { title: "Form Relay", eyebrow: "FORM BACKEND", tagline: "Every form saved first, then delivered." },
  drafting: { title: "NOVA 2", eyebrow: "DESIGN SHEET", tagline: "A multi-agent system, still on paper.", pointer: "→ The working version lives elsewhere", agents: ["A1", "A2", "A3", "A4", "A5", "A6"] },
  tape: { title: "BOLT", word: "BOLT", eyebrow: "BOLT · FIRST DRAFT", tagline: "An early draft kept for history.", pointer: "The real app lives in bolt-app" },
  forge: { title: "doc-press", eyebrow: "DOCS TOOLING", tagline: "Docs that look like your product.", subline: "Write markdown once; get a styled site.", miniTitle: "your-docs" },
};
for (const [theme, c] of Object.entries(EXAMPLES)) {
  const cfg = { theme, a: "#22d3ee", b: "#a855f7", chips: [], ...c };
  fs.writeFileSync(path.join(out, `${theme}.svg`), THEMES[theme](cfg, { isPrivate: false, dark: false }));
  console.log(`examples/banners/${theme}.svg`);
}
