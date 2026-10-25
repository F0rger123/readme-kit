// Captures README screenshots with Playwright + the system Edge browser.
// Usage: node shoot.mjs <playwright-core dir> <jobs.json> [onlyName...]
// Job: { name, url, out, width, height, scale, wait, selector, labelText, colorScheme, eval, fullPage,
//        supabaseSession (cookie name), supabaseLocal (localStorage key), localStorage, clip, debug }
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const [pwDir, jobsFile, ...only] = process.argv.slice(2);
const require = createRequire(path.join(pwDir, "package.json"));
const { chromium } = require("playwright-core");
const jobs = JSON.parse(fs.readFileSync(jobsFile, "utf8")).filter((j) => !only.length || only.includes(j.name));

const browser = await chromium.launch({ channel: "msedge" });
for (const j of jobs) {
  const ctx = await browser.newContext({
    viewport: { width: j.width || 1440, height: j.height || 900 },
    deviceScaleFactor: j.scale || 2,
    colorScheme: j.colorScheme || "light",
    reducedMotion: "reduce",
  });
  if (j.supabaseSession || j.supabaseLocal) {
    // Fake signed-in session for the local mock Supabase (mock-supabase.mjs); never a real account
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const jwt = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: "00000000-0000-4000-8000-000000000001", role: "authenticated", aud: "authenticated", email: "owner@example.com", exp: 4102444800, iat: 1767225600, session_id: "demo" })}.demo-signature`;
    const session = { access_token: jwt, refresh_token: "demo", token_type: "bearer", expires_in: 31536000, expires_at: 4102444800,
      user: { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email: "owner@example.com" } };
    if (j.supabaseSession) {
      // SSR apps (@supabase/ssr) read the session from a cookie
      const value = "base64-" + Buffer.from(JSON.stringify(session)).toString("base64url");
      const { origin } = new URL(j.url);
      await ctx.addCookies([{ name: j.supabaseSession, value, url: origin }]);
    }
    if (j.supabaseLocal) {
      // Browser-only apps (supabase-js) read it from localStorage, set before the app boots
      await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), [j.supabaseLocal, JSON.stringify(session)]);
    }
  }
  const page = await ctx.newPage();
  page.on("pageerror", (e) => j.debug && console.log("  pageerror:", e.message.slice(0, 160)));
  try {
    await page.goto(j.url, { waitUntil: "networkidle", timeout: 90_000 });
    if (j.localStorage) {
      await page.evaluate((kv) => { for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); }, j.localStorage);
      await page.reload({ waitUntil: "networkidle" });
    }
    // Hide dev-only overlays (Next.js indicator, Vite error overlay) from screenshots
    await page.addStyleTag({ content: "nextjs-portal,vite-error-overlay{display:none!important}" }).catch(() => {});
    if (j.eval) await page.evaluate(j.eval);
    await page.waitForTimeout(j.wait ?? 1500);
    fs.mkdirSync(path.dirname(j.out), { recursive: true });
    if (j.labelText) {
      // Design-board frames: a phone-sized element whose previous sibling is the frame label
      const handle = await page.evaluateHandle((t) => [...document.querySelectorAll("div")].find((e) => {
        const r = e.getBoundingClientRect();
        return r.height >= 500 && r.width < 500 && e.previousElementSibling?.textContent.trim() === t;
      }) || null, j.labelText);
      const el = handle.asElement();
      if (!el) throw new Error(`frame not found: ${j.labelText}`);
      await el.screenshot({ path: j.out });
    } else if (j.selector) {
      await page.locator(j.selector).first().screenshot({ path: j.out });
    } else {
      await page.screenshot({ path: j.out, fullPage: !!j.fullPage, ...(j.clip ? { clip: j.clip } : {}), ...(j.out.endsWith(".jpg") ? { type: "jpeg", quality: 85 } : {}) });
    }
    console.log(`ok   ${j.name} -> ${j.out}`);
  } catch (e) {
    console.log(`FAIL ${j.name}: ${String(e.message).split("\n")[0]}`);
  }
  await ctx.close();
}
await browser.close();
