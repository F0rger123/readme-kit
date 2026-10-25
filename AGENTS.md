# AI guide: readme-kit

**For AI assistants (Claude, ChatGPT, Codex, Cursor, Gemini).** Someone gave you a link to this repository. Use this page to explain it, set it up, or help them use it. Talk in plain English; the person may not be technical.

## What this is

A set of tools that gives every repo a README matching the app (banner, screenshots, plain-English diagrams) and an AI guide, and keeps them up to date.

**Usually used by:** A developer who wants good-looking, AI-friendly READMEs across their repos.

## Ask first

Ask these together in one short message, then repeat back what you heard in a line or two. Skip anything they already told you.

- Do you want to try it on one repo, or set up the daily and weekly jobs?
- Is the GitHub CLI (gh) installed and signed in?
- Do you have a private repo for your per-repo notes, or should we start from the examples?

## Set it up

Do one step at a time. Check each one worked before moving on.

| # | Do this | It worked if |
|---|---|---|
| 1 | Clone the repo and run `npm install` | No errors |
| 2 | Copy `examples/data` to `data` (or clone your data repo into `data`) | `data/repos.json` exists |
| 3 | Clone one of your repos into `work/<repo>` | The folder exists |
| 4 | `npm run langs`, then `node agents.mjs work`, then `node build.mjs work work/langs.txt <repo>` | `work/<repo>/README.md` is rebuilt |
| 5 | `node serve.mjs` and open http://localhost:5179/view/<repo> | Every diagram renders |

## Use it

- Read RUNBOOK.md for the daily and weekly jobs.
- Add a theme by adding a function to data/themes.mjs.

## How it works, in plain words

1. Your notes say how each repo should look and what it does.
2. The kit builds the README, banner, screenshots and AI guide from them.
3. It checks everything renders before you push.

## Never

- Never ask for, paste or print passwords, API keys or tokens. Tell the person where to put them (their own `.env` file or the hosting dashboard) and let them do it.
- Never deploy, push to `main`, change a live database or spend money without the person saying yes to that exact step.
- Never put private projects' notes in the public kit; keep them in your data repo.

## Read next

- [Runbook](RUNBOOK.md)
- [Example data](examples/data/repos.json)

## When you're done

Tell the person, in a few lines: what is set up and checked, what isn't yet, and two or three things they can ask you next.
