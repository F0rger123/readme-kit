// Prints given file:line locations with every string literal and key-like token replaced by a shape descriptor,
// so findings can be triaged without revealing any secret characters.
// Usage: node redact-lines.mjs <root> <file:line>...
import fs from "node:fs";
import path from "node:path";

const [root, ...locs] = process.argv.slice(2);
const shape = (s) => {
  const kinds = [/[a-z]/.test(s) && "a", /[A-Z]/.test(s) && "A", /\d/.test(s) && "9", /[^A-Za-z0-9]/.test(s) && "#"].filter(Boolean).join("");
  return `<str len=${s.length} chars=${kinds}>`;
};
for (const loc of locs) {
  const i = loc.lastIndexOf(":");
  const file = loc.slice(0, i), n = Number(loc.slice(i + 1));
  const lines = fs.readFileSync(path.join(root, file), "utf8").split(/\r?\n/);
  const show = (k) => (lines[k - 1] ?? "")
    .replace(/(["'`])((?:(?!\1).){6,})\1/g, (_, q, s) => q + shape(s) + q)
    .replace(/(=\s*)([^\s"'`]{12,})/g, (_, eq, s) => eq + shape(s))
    .replace(/\b(AIza|sk-|re_|gh[pousr]_|eyJ)[A-Za-z0-9_.-]+/g, (m, p) => `${p}<redacted len=${m.length}>`)
    .trim().slice(0, 180);
  console.log(`${loc}\n   ${show(n - 1)}\n > ${show(n)}`);
}
