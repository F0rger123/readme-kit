// Writes work/langs.txt: "<repo> Lang=bytes,Lang=bytes" for every repo in repos.json (used for the language pie).
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const repos = Object.keys(JSON.parse(fs.readFileSync(new URL("./data/repos.json", import.meta.url), "utf8")));
fs.mkdirSync(new URL("./work/", import.meta.url), { recursive: true });
const lines = repos.map((r) => {
  const j = JSON.parse(execFileSync("gh", ["api", `repos/F0rger123/${r}/languages`], { encoding: "utf8" }));
  return `${r} ${Object.entries(j).map(([k, v]) => `${k}=${v}`).join(",")}`;
});
fs.writeFileSync(new URL("./work/langs.txt", import.meta.url), lines.join("\n") + "\n");
console.log(`wrote work/langs.txt for ${lines.length} repos`);
