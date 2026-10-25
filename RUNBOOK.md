# readme-kit runbook

How to run the kit by hand or from a scheduled AI job. Your own rules (commit author, which repos to skip, schedule) belong in your data repo's `RUNBOOK.md`; read that too when it exists.

## Standing rules

1. **Every repo gets a good-looking README**: banner in the app's own colors and fonts, badges, a short "what it does", real screenshots when the app can run (demo data only), and Mermaid diagrams.
2. **Diagrams are plain English**: boxes say what happens ("Customer books a clean", "Saved safely first"), never file, table or function names.
3. **Every repo gets an AI guide** (`AGENTS.md`, or `docs/AI_GUIDE.md` when `AGENTS.md` already holds developer rules) plus `llms.txt`, so someone can paste the repo link into Claude or ChatGPT and be walked through it.
4. **Only touch docs**: README.md, AGENTS.md, llms.txt, docs/AI_GUIDE.md, LICENSE and .github/assets/. Never print or commit secrets or `.env` files. Never deploy.

## Setup for a run

```bash
gh repo clone <you>/readme-kit "$TEMP/readme-kit" 2>/dev/null || git -C "$TEMP/readme-kit" pull -q
gh repo clone <you>/<your-data-repo> "$TEMP/readme-kit/data" 2>/dev/null || git -C "$TEMP/readme-kit/data" pull -q
cd "$TEMP/readme-kit" && npm install --silent && mkdir -p work
```

Clone each repo you'll touch into `work/<repo>` and run `npm run langs` before building.

## Job A: new repos

1. List your repos (`gh repo list <you> --json name,isFork,isEmpty,isArchived,visibility`) and compare with `data/repos.json`. A new repo is non-fork, non-empty, not archived, and missing from it.
2. For each new repo: read enough to understand it (README, manifests, main folders, docs; never `.env`). Save any existing README to `data/originals/<repo>.md`. Pick a theme from its real UI or use the generic banner; add the entry to `data/repos.json` and `data/visibility.json`. Write `data/readmes/<repo>.md` and its guide in `data/guides.mjs`. Check every file path you mention exists.
3. `node agents.mjs work && node build.mjs work work/langs.txt <repo>`.
4. **Check before pushing**: `node serve.mjs`, open `http://localhost:5179/view/<repo>`: every diagram renders, every image loads, the "Pasted this link" block is there.
5. Commit only the doc files, push, then confirm on GitHub: `gh api repos/<you>/<repo>/readme -H "Accept: application/vnd.github.html"` shows each diagram and the banner.
6. Commit and push your data repo.

## Job B: refresh changed repos

1. Compare each repo's latest commit with `data/state.json`. Ignore commits that only touched doc files.
2. For real changes, read the log and changed files that matter and update the README source, guide, screenshots and banner config.
3. Rebuild, check, push and confirm as in Job A, then run Job A too.
4. Update `data/state.json` and push the data repo.

## Report

End every run with: repos checked, what was new or changed, what was updated (commit links), what couldn't be verified, and anything that needs the owner.
