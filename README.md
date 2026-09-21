# TOMA Coffee Storefront

This is a React + Vite implementation of the TOMA storefront and MVP **TOMA Blend Lab**. The Blend Lab follows the product spec with six coffee moments, a Turkish coffee starter format, guided body/roast/aroma controls, a rule-based TOMA Guide, live product preview, pack/name summary, local draft persistence, and a shared bag state.

## Run locally

From this folder, run:

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, usually `http://localhost:5173`.

Production build and preview:

```bash
npm run build
npm run preview
```

React routes:

- `/` — storefront home
- `/shop` — full product, category, bundle, offer, review, and WhatsApp shop experience
- `/blend-lab` — guided custom blend builder
- `/profile` — signed-in coffee record with saved blends, preferences, sample orders, and top-three ranking
- `/login` — local demo sign-in flow
- `/signup` — local demo account creation
- `/cart` — shared bag for Turbo Mode and custom blends

Reusable UI is split under `src/components`, page composition lives under `src/pages`, shared cart/session/profile behavior lives in `src/context` and `src/lib`, and the blend rules remain isolated in `src/lib/blend-rules.js`.

Run the rule-engine tests from the project root with:

```bash
npm test
```

The site is a static frontend. The pages share cart and demo session state in browser storage so the MVP flow works end-to-end. Product checkout, inventory, accounts, and custom-blend ordering still need to be connected to a backend or ecommerce service. The custom blend quote intentionally displays `[CUSTOM BLEND PRICE]`, `[CURRENCY]`, `[PREPARATION TIME]`, and `[DELIVERY RULE]` until TOMA approves live catalog values. Demo passwords are hashed locally for the prototype but must move to a real auth service before launch.
