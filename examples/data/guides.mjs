// One entry per repo. agents.mjs turns each into AGENTS.md (or docs/AI_GUIDE.md) and llms.txt.
export const GUIDES = {
  "acme-crm": {
    what: "A CRM for small service businesses: clients, quotes, jobs, invoices and a calendar.",
    who: "The business owner, or a developer helping them.",
    ask: ["Run it on your computer, deploy it, or just understand it?", "Do you have a Supabase project yet?"],
    setup: [["`npm install`", "No errors"], ["Copy `.env.example` to `.env` and fill in your Supabase details", "The file exists"], ["`npm run dev`", "The app opens at http://localhost:3000"]],
    use: ["Add a client, send them a quote, then turn it into a job."],
    how: ["Quotes are accepted online.", "Accepted quotes become booked jobs.", "Jobs are invoiced and payments recorded."],
    never: [],
    docs: [],
  },
};
