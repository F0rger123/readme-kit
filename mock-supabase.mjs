// Minimal fake Supabase (auth + PostgREST + RPC) on :3199 (MOCK_PORT) so signed-in app screens can render
// for README screenshots without touching any real project. Logs every request path so demo
// data can be added per table in fixtures.json.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesFile = process.argv[2] || path.join(here, "data", "fixtures.json");
const load = () => (fs.existsSync(fixturesFile) ? JSON.parse(fs.readFileSync(fixturesFile, "utf8")) : {});

export const USER = {
  id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated",
  email: "owner@example.com", app_metadata: { provider: "email" }, user_metadata: { full_name: "Demo Owner" },
  created_at: "2026-01-01T00:00:00Z",
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const send = (code, body, extra = {}) => {
    res.writeHead(code, { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*", "access-control-expose-headers": "content-range", ...extra });
    res.end(JSON.stringify(body));
  };
  if (req.method === "OPTIONS") return send(200, {});
  const fx = load();
  console.log(req.method, url.pathname + url.search);
  if (url.pathname.startsWith("/auth/v1/user")) return send(200, USER);
  if (url.pathname.startsWith("/auth/v1/token")) return send(200, { access_token: "demo", refresh_token: "demo", token_type: "bearer", expires_in: 3600 * 24 * 365, expires_at: 4102444800, user: USER });
  if (url.pathname.startsWith("/auth/v1/")) return send(200, {});
  const m = url.pathname.match(/^\/rest\/v1\/(rpc\/)?([^/?]+)/);
  if (m) {
    const key = (m[1] ? "rpc:" : "") + m[2];
    let rows = fx[key] ?? (m[1] ? null : []);
    if (!m[1] && Array.isArray(rows)) {
      // Honour simple `col=eq.value` filters, so lookups like "my employee row" find one row.
      // Rows without that column are kept, so fixtures can stay loose.
      for (const [col, v] of url.searchParams) {
        if (!v.startsWith("eq.")) continue;
        rows = rows.filter((r) => !(col in r) || String(r[col]) === v.slice(3));
      }
      const limit = Number(url.searchParams.get("limit"));
      if (limit) rows = rows.slice(0, limit);
    }
    const single = (req.headers.accept || "").includes("vnd.pgrst.object");
    if (single) return Array.isArray(rows) ? (rows.length ? send(200, rows[0]) : send(406, { code: "PGRST116", message: "no rows" })) : send(200, rows ?? {});
    const n = fx["count:" + m[2]] ?? (Array.isArray(rows) ? rows.length : 0);
    return send(200, rows, { "content-range": `0-${Math.max(n - 1, 0)}/${n}` });
  }
  if (url.pathname.startsWith("/storage/v1/")) return send(200, []);
  send(404, { message: "not mocked" });
}).listen(Number(process.env.MOCK_PORT || 3199), () => console.log(`mock supabase on :${process.env.MOCK_PORT || 3199}`));
