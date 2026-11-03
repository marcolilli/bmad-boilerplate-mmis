# RunReady

A browser-only running-workout preview. This first slice starts with an empty plan and a `0:00` total. Add one running phase, enter minutes and seconds, and review its duration and total together.

## Open a local preview

Download and install [Node.js from the official download page](https://nodejs.org/en/download). Use version 24.13.0 or newer; npm is included and must be version 11.6.2 or newer. Open this folder in your editor and open its terminal. Confirm the installed versions first:

```sh
node --version
npm --version
```

The printed versions should meet those minimums. Then enter:

```sh
npm ci
npm run dev
```

Open the local link printed in the terminal (normally http://localhost:5173). Keep that terminal running while using the preview. To stop it, press Control+C in that terminal.

To preview the production build instead:

```sh
npm run build
npm run preview
```

Open the printed link (normally http://localhost:4173).

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Unit tests (`npm test`) need no installed browser. Tests use Node's built-in runner and TypeScript stripping; they are outside the browser bundle. The official Vite `react-ts` starter (`create-vite` 9.3.3) supplies the compiler, Vite and Oxlint configuration. Dependencies match the architecture baselines: React/React DOM 19.3.1, TypeScript 7.0.2, Vite 8.3.5 and React plugin 6.1.2. The lockfile fixes installed versions.

## Repeatable browser check

After `npm ci`, install the test browser once from this folder's terminal:

```sh
npx playwright install chromium
```

Then run:

```sh
npm run test:browser
```

This builds the production app, starts its own temporary local preview on an available port, and checks initial/add/focus/one-phase behavior, durations, invalid raw text and recovery, the empty and maximum-duration layouts at 320 pixels with 200% text, and offline editing. The browser and temporary preview close automatically. Your normal preview can remain open. Playwright is a development-only dependency; it adds nothing to the shipped app. The check does not require a separate backend.

## Implemented scope

- One running phase, with raw minutes/seconds retained in an in-memory controller.
- Pure domain validation and calculation; only positive whole-second durations within JavaScript's safe integer range are accepted. Seconds must be 0–59. Invalid or missing values keep the preview incomplete instead of showing a total. Field errors appear only when leaving the field (blur); initial focus and typing show no new errors, and refocusing clears that field’s message until the next blur.
- Native keyboard controls, focus moved into the added editor, responsive layout, local assets and system fonts.

There is no saving: reloading or closing the page clears the draft. Multiple phases, other phase types, intervals, suggestions, a library, accounts and a backend are outside this slice. Once loaded, editing works without a connection; opening the app offline is not guaranteed. There is no service worker.

## Verification and limitations

Verified on 2026-11-03 using Node 24.13.0, npm 11.6.2 and desktop Chromium 156.0.8078.80:

- Typecheck, Oxlint, 32 domain tests and production build passed.
- Development and production previews loaded. Production browser checks covered empty/add/edit, 2:30 and sub-minute durations, missing/zero/negative/decimal/nonnumeric/non-finite/out-of-range/unsafe/overflow values, retained text and recovery.
- Tab/Enter activation, focus transfer, visible focus, labels and associated errors were checked.
- At 320 CSS pixels and with 200% root text size, valid/error states and the largest valid duration had no horizontal page overflow. A later empty-state check found the Add button extending beyond its panel; its width and wrapping are now constrained and covered by the repeatable browser check. Desktop and enlarged narrow layouts were visually inspected.
- Production loading requested only the page, bundled JavaScript, bundled CSS and local favicon. No browser errors occurred; disconnecting after load still allowed editing/calculation without requests.

The repeatable Node-runner browser regression also passed with Playwright Chromium 156.0.8078.4 after the review fixes, including the empty Add button containment check. The changed domain tests (32 cases) and node/test typecheck passed.

Desktop emulation is not a real-device or screen-reader audit. iOS Safari, Android Chrome and mobile screen-reader testing remain for later whole-product verification.
