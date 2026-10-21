# BConsult repository instructions

## Scope

BConsult is currently a small Bulgarian-language public website and a starting point for future development. Build only the functionality requested. Do not add Delovod's accounting features, authentication, databases, storage providers, dashboards, or fictional business content just because the reference project has them.

## Stack and commands

- Node.js 24, npm, Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4.
- Use npm and keep `package-lock.json` committed. Use `npm ci` on clean checkouts; use `npm install` when intentionally changing dependencies.
- `npm run dev`: development server.
- `npm run check`: ESLint, generated route types + TypeScript, Prettier verification.
- `npm run build`: production build.
- `npm run start`: serve the production build.
- `npm run format`: explicitly format tracked source/configuration after changes.

## Framework guidance

Before changing Next.js behavior, consult the relevant installed guide under `node_modules/next/dist/docs/`. Do not assume older Next.js conventions still apply. `next-env.d.ts` and `.next/` are generated: do not hand-edit them. Type checking uses `next typegen` so it also works on a fresh checkout.

## Code organization

- `src/app/`: route entry points, root layout, metadata, global styles, and route-specific UI.
- `src/components/`: genuinely reusable UI; shared shell lives in `layout/`.
- `src/lib/`: shared non-UI code and site configuration.
- Use `@/` imports for shared source modules. Keep route-local code beside its route until it is reused.
- Server Components are the default. Add `"use client"` only for browser APIs, state, or interaction. Keep client boundaries small and never import secrets into them.
- Do not create empty feature folders, speculative abstractions, compatibility aliases, or unused dependencies.

## Implementation standards

- English identifiers; Bulgarian user-facing copy and `lang="bg"`.
- Use semantic HTML, visible keyboard focus, accessible labels, and responsive layouts. Check desktop and mobile widths.
- Reuse existing design tokens and components. Do not introduce another UI system for one screen.
- Prefer local assets and system fonts. Do not make builds depend on external font downloads.
- Use strict types; do not silence errors with `any`, `@ts-ignore`, lint disable blocks, or `ignoreBuildErrors`.
- Loading, empty, and error states must reflect real functionality. No inactive buttons, fake metrics, invented contact information, or placeholder APIs.
- Document every new environment variable in `.env.example`. `NEXT_PUBLIC_*` is public; credentials belong only on the server. Never commit real environment files, tokens, client data, or production logs.

## Verification and delivery

Run `npm run check` and `npm run build` after meaningful changes. Launch the application and exercise changed routes in a browser; check console errors, keyboard operation, and narrow layouts for UI work. Report only verification actually performed.

## Playwright tests

- Use Playwright for end-to-end tests of new or changed user-visible behavior. Add or update tests alongside the implementation, including relevant failure paths and regressions for bug fixes.
- Exercise real routes and user interactions. Prefer accessible role/label selectors and Playwright's auto-waiting assertions; do not use arbitrary sleeps or brittle CSS selectors.
- Keep tests deterministic and isolated. Never depend on production services, production accounts, or real customer data. Do not test static copy, configuration, or implementation details instead of behavior.
- Run the relevant Playwright tests before delivery and report the command and result. Do not claim passing tests that were not executed; report missing prerequisites explicitly.
- Playwright tests live in `e2e/` and run with `npm run test:e2e` after `npm run build`. Install Chromium with `npx playwright install chromium` first. The runner starts its own production server on port 3107 and covers desktop and mobile viewports. Keep that port free. CI installs Chromium with system dependencies and runs the same tests. Keep the README and these instructions aligned with actual commands and architecture.

Never create commits, push, deploy, change DNS, or modify production services without an explicit user request for that action. Do not overwrite unrelated user changes. Do not copy secrets or product-specific infrastructure from Delovod.
