// Applies star-lists.json to the signed-in GitHub account's star Lists.
// Needs a gh token with the `user` scope:  gh auth refresh -h github.com -s user
// Usage: node apply-lists.mjs [--dry-run]
//   1. Renames an existing list when it is the obvious predecessor (RENAMES), otherwise creates the list.
//   2. Sets each starred repo's lists to exactly the planned ones.
//   3. Deletes old lists that ended up empty. Stars are never removed.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const plan = JSON.parse(fs.readFileSync(path.join(process.env.README_KIT_DATA || path.join(here, "data"), "star-lists.json"), "utf8"));
const dry = process.argv.includes("--dry-run");

// old list name -> new list name
const RENAMES = {
  "skills": "🧠 Agent Skills", "AI Video Editor": "🎬 Video & Content", "mod phones": "📱 Android, Hardware & Hacks",
  "SEO": "🔎 SEO & AI Search", "CRM": "💼 CRM & Business", "Trading": "📈 Trading & Finance",
  "Ai Agents": "🤖 Coding Agents & Harnesses", "voicd": "🎙️ Voice & Speech", "Legal with an i": "🔓 Jailbreaks & Uncensored LLMs",
  "jobs": "🧑‍💼 Job Hunt Automation", "RayBaneta": "🕶️ Ray-Ban Meta Glasses",
};

function gql(query, variables = {}) {
  const args = ["api", "graphql", "-f", `query=${query}`];
  for (const [k, v] of Object.entries(variables)) args.push(Array.isArray(v) ? "--raw-field" : "-f", `${k}=${Array.isArray(v) ? JSON.stringify(v) : v}`);
  const out = JSON.parse(execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 << 20 }));
  if (out.errors) throw new Error(JSON.stringify(out.errors));
  return out.data;
}
// Array variables need a JSON body, so mutations that take listIds go through --input.
function gqlJson(query, variables) {
  const out = JSON.parse(execFileSync("gh", ["api", "graphql", "--input", "-"], { input: JSON.stringify({ query, variables }), encoding: "utf8" }));
  if (out.errors) throw new Error(JSON.stringify(out.errors));
  return out.data;
}

const lists = () => gql(`{viewer{lists(first:100){nodes{id name}}}}`).viewer.lists.nodes;
const stars = [];
let cursor = null;
do {
  const d = gql(`query($c:String){viewer{starredRepositories(first:100,after:$c){pageInfo{hasNextPage endCursor} nodes{id nameWithOwner}}}}`, cursor ? { c: cursor } : {});
  const s = d.viewer.starredRepositories;
  stars.push(...s.nodes);
  cursor = s.pageInfo.hasNextPage ? s.pageInfo.endCursor : null;
} while (cursor);
const repoId = Object.fromEntries(stars.map((s) => [s.nameWithOwner, s.id]));

// 1. lists
let current = lists();
for (const [name, { description }] of Object.entries(plan)) {
  if (current.some((l) => l.name === name)) continue;
  const old = current.find((l) => RENAMES[l.name] === name);
  if (dry) { console.log(old ? `rename "${old.name}" -> "${name}"` : `create "${name}"`); continue; }
  if (old) gqlJson(`mutation($id:ID!,$n:String!,$d:String){updateUserList(input:{listId:$id,name:$n,description:$d}){list{id}}}`, { id: old.id, n: name, d: description });
  else gqlJson(`mutation($n:String!,$d:String){createUserList(input:{name:$n,description:$d,isPrivate:false}){list{id}}}`, { n: name, d: description });
  console.log(old ? `renamed "${old.name}" -> "${name}"` : `created "${name}"`);
}
current = dry ? current : lists();
const listId = Object.fromEntries(current.map((l) => [l.name, l.id]));

// 2. memberships
const want = {};
for (const [name, { repos }] of Object.entries(plan)) for (const r of repos) (want[r] ||= []).push(name);
let n = 0;
for (const [repo, names] of Object.entries(want)) {
  if (!repoId[repo]) { console.log(`skip ${repo}: not starred`); continue; }
  if (dry) { n++; continue; }
  gqlJson(`mutation($i:ID!,$l:[ID!]!){updateUserListsForItem(input:{itemId:$i,listIds:$l}){user{login}}}`, { i: repoId[repo], l: names.map((x) => listId[x]) });
  n++;
}
console.log(`${dry ? "would set" : "set"} lists for ${n} repos`);

// 3. remove leftover lists that are now empty
if (!dry) {
  const after = gql(`{viewer{lists(first:100){nodes{id name items{totalCount}}}}}`).viewer.lists.nodes;
  for (const l of after) if (!plan[l.name] && l.items.totalCount === 0) {
    gqlJson(`mutation($id:ID!){deleteUserList(input:{listId:$id}){user{login}}}`, { id: l.id });
    console.log(`deleted empty old list "${l.name}"`);
  }
}
