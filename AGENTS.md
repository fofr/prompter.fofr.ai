# AGENTS.md

**prompter.fofr.ai** — a Next.js + Tailwind web app for generating AI image/media prompts
(it consumes the `prompt-lists` npm package). This is **application code**, so correctness
and not breaking the UI matter more than raw churn.

## Stack
- Next.js (Pages Router: `pages/`), React, Tailwind CSS, ESLint.
- `components/` — React components. `pages/` — routes + `pages/api/`. `styles/` — CSS.
- Package manager: npm. Node 24.x.

## Checks — run these before opening a PR (this is the CI bar)
```
npm install
npm run lint     # next lint / eslint
npm run build    # next build — MUST succeed; this is the real gate
```
`npm test` runs `lint && build`. A PR is not done until `npm run build` passes cleanly.
There is no unit-test suite; the build + lint passing + the app still rendering is the bar.

## Working rules
- Keep changes tightly scoped to the issue. Modernisation/upgrades should be **incremental
  and verifiable** — bump/migrate, then get lint+build green, then open the PR.
- Do NOT break existing UI/behaviour. If a dependency upgrade changes an API, migrate the
  call sites; don't delete features.
- Match the existing code style (ES modules, functional components, Tailwind classes).
- Prefer official codemods for framework upgrades (e.g. `npx @next/codemod`) where they exist.
- Commit in small steps. One PR per issue. Put `Closes #<n>` in the PR body.
- Do NOT commit `node_modules` or `.next`. Don't hand-edit `package-lock.json` beyond what
  `npm install` produces.
- If an upgrade is bigger/riskier than the issue implies, do the smallest safe slice and
  report what's left rather than a sprawling half-migration.
