// Where your per-repo data lives: repos.json, visibility.json, readmes/, originals/, guides.mjs,
// guide-paths.json, fixtures.json and state.json. Keep it in its own (private) repo and clone it to ./data,
// or point README_KIT_DATA at it.
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA = process.env.README_KIT_DATA || path.join(here, "data");
