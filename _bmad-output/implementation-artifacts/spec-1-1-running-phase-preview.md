---
title: Story 1.1 — Starter and single running-phase preview
type: feature
created: 2026-11-03
status: done
route: dispatch
review_loop_iteration: 0
epic: 1
story: 1.1
baseline_commit: a2f1c0e09c1469cc1eb7e11a3ae08cd92b3b1c3b
base_revision: a2f1c0e09c1469cc1eb7e11a3ae08cd92b3b1c3b
context:
  - _bmad-output/implementation-artifacts/epic-1-context.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** RunReady has planning documents but no application. Story 1.1 needs a demonstrable first slice: enter one running phase and see its duration accurately.

**Approach:** Initialize the official Vite React/TypeScript starter in the repository root while preserving existing documents and BMAD files. Build a blank in-memory draft, an Add run phase action, minutes/seconds inputs, field validation, and an ordered preview with a derived total. Use a simple responsive layout and native accessible controls.

## Boundaries & Constraints

**Always:** Start with no phases and a zero total. Allow one run phase only. Keep raw input strings in the application controller; pure domain functions validate and calculate. Positive whole-second durations must fit safe integer arithmetic, with seconds from 0–59 and nonnegative whole minutes. Zero minutes is valid when seconds make the total positive. Use architecture AD-1–AD-3 and AD-5–AD-6 for this slice. Keep the UI usable at 320 CSS pixels and 200% text, with keyboard access, visible focus, labels and associated errors. Bundle required assets; the production slice makes no runtime network calls.

**Never:** Implement multiple phases, other phase types, intervals, naming/saving, suggestions, a library, IndexedDB, accounts, a backend, a global state library or service worker. Do not present future features as usable controls. Do not overwrite planning files during starter setup or commit/deploy without a user instruction.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
| --- | --- | --- | --- |
| Initial | No phase | Empty plan; total 0:00; Add run phase available | None |
| Add | Activate Add run phase | One run editor with empty raw duration fields; no second phase permitted | Incomplete state until valid input; move focus into editor |
| Valid | 2 minutes, 30 seconds | Preview run 2:30 and total 2:30, updated together | Clear resolved errors |
| Sub-minute | 0 minutes, 30 seconds | Run/total 0:30 | None |
| Invalid | Empty, zero total, negative, decimal, nonnumeric, non-finite, seconds ≥60, unsafe integer or overflow | Preserve text; no valid-looking total for an invalid plan | Associate actionable text errors with affected fields; visibly mark incomplete |
| Keyboard/mobile | Tab/Enter; 320-pixel width; 200% text | All controls/content reachable; meaningful focus and labels | No clipped meaning or horizontal page scroll |

</frozen-after-approval>

## Code Map

- `PRD.md` and `ARCHITECTURE-SPINE.md`: finalized constraints, already distilled into epic context; preserve.
- `_bmad-output/planning-artifacts/epics.md`: Story 1.1 acceptance criteria; remaining stories are outside this build.
- Repository at base revision: no package.json, application source, lockfile or existing test infrastructure; main was clean before this workflow's planning artifacts.
- Node 24.13.0 and npm 11.6.2 are available. Starter dependencies must be checked for availability and compatibility before installation; report any mismatch with architecture baselines instead of silently selecting conflicting versions.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, TypeScript/lint configuration — introduce the official react-ts starter without replacing repository contents; retain checks and expose typecheck/test commands.
- [x] `src/domain/workout.ts` — define only this slice's phase/duration types and pure validation/calculation; retain safe arithmetic and raw-field error mapping.
- [x] `src/application/useWorkoutDraft.ts` — own blank/add/edit state and raw input; derive the domain result without storage or network side effects.
- [x] `src/main.tsx`, `src/ui/WorkoutBuilder.tsx`, `src/styles.css` — render the minimal editor and preview with native controls, meaningful labels/errors, focus handling, responsive sizing and bundled assets.
- [x] `tests/workout.test.ts` — use Node's built-in test runner for the matrix's meaningful numeric cases; keep tests outside the browser bundle.
- [x] `README.md` — document setup/run/check commands, implemented scope, and verification limitations.

**Acceptance Criteria:**
- Given a fresh checkout and supported runtime, when dependencies are installed and development/typecheck/lint/test/build commands run, then they succeed with a committed-ready lockfile and only required starter/slice modules.
- Given the complete slice, when tested in the production preview, then the I/O matrix passes, browser errors are absent, and no external runtime request is needed after page load.
- Given later-story requirements, when inspecting this delivery, then persistence and future-feature scaffolding are absent.

## Implementation Notes

- Initialized from official `create-vite` 9.3.3 `react-ts` starter in a temporary directory and copied only required configuration. Existing planning/BMAD files preserved. The current official starter uses Oxlint; retained its checks.
- All exact architecture baselines were available and installed; Node/npm also matched. Local registry downloads and production-preview port binding required execution permission, which succeeded.
- Domain validation keeps unsafe arithmetic out of canonical phases; the controller owns raw strings, and the UI derives both preview/total from the same result.
- No future-feature controls, storage, backend, global state library, or service worker introduced. Assets are local.

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence and route |
| --- | --- | --- |
| Blind 1: empty-state enlarged button overflow | medium | At 320px/200% the button minimum width exceeds the panel content width. Patch wrapping/max-width and cover empty state. |
| Blind 2: tests excluded from type checking | low | Both tsconfig includes exclude tests; Node only strips types. Patch node config include. |
| Blind 3: raw-input retention only checked in pure domain | medium | No rendered/controller regression test exists. Patch shared root cause with Verification 1. |
| Blind 4: no one-phase controller test | false | Functional add guard preserves existing content and the Add control disappears after adding. No demonstrated second-phase/reset defect; browser regression will assert single-phase UI. |
| Blind 5: changed descriptions may not announce immediately | maybe-false | Errors are associated with invalid focused inputs, but actual announcement timing needs screen-reader testing. Defer unverified medium concern to the existing pre-evaluation accessibility audit; no claim of completed screen-reader verification. |
| Blind 6: atomic preview repeats duration narration | maybe-false | Actual assistive-technology speech not observed; possible low verbosity concern, rejected rather than adding new status state. |
| Blind 7: colon-formatted duration lacks spoken units | low | Footer explicitly states minutes:seconds and editor labels name units. No incorrect calculation or lost access; retain the agreed display and defer speech wording to screen-reader audit, without added complexity in this slice. |
| Blind 8: boundary tests omit errors/no-canonical assertions | low | Boundary cases only assert incomplete status; patch stronger assertions for their existing contract. |
| Blind 9: disabled-JavaScript blank page | low | Root is empty without JS; patch a direct noscript explanation. |
| Blind 10: setup lacks runtime link/checks | low | README names versions without a download link/version-check guidance; patch documentation directly. |
| Verification 1: no repeatable rendered-editor test | medium | Existing tests call only domain functions; incorrect event-handler wiring would pass them. Patch browser add/edit/invalid/recovery test using Node runner, plus setup instructions; no runtime feature change. |
| Edge-case hunter | false | Returned no findings. No edge-case defects to route. |

## Verification

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`: all pass.
- Start the dev server and production preview; verify empty/add/edit/invalid/recovery flows in a real browser, keyboard activation/focus, accessible labels/errors, 320-pixel layout and 200% text.
- Inspect browser console and requests; required assets are local and no runtime API/CDN dependency exists. Disconnect after load and confirm editing/calculation still work.
- Record actual checks and browser versions; do not claim the later story's full device/screen-reader matrix from desktop emulation alone.

### Executed evidence — 2026-11-03

- Node 24.13.0 / npm 11.6.2. `npm run typecheck`, `npm run lint`, `npm test` (32 passing), and `npm run build` passed.
- Dev `http://127.0.0.1:5173/` and production `http://127.0.0.1:4173/` reached in Chromium 156.0.8078.80.
- Production matrix verified: initial zero/empty, keyboard Add/focus into minutes, blank incomplete state, 2:30, 0:30, missing/zero/negative/decimal/nonnumeric/non-finite/seconds >=60/unsafe integer/overflow rejection, retained raw text, recovery. Error descriptions resolve to existing elements and focus has a visible 3px outline.
- Narrow 320px layout with 200% root text verified for normal, error, and maximum-safe duration (150119987579016:31) states; page scroll width equals 320px. Desktop and narrow screenshots inspected. Fixed one long-duration phase preview overflow found during verification.
- Production requests: document + local JS/CSS/favicon only. No page/console errors. Offline editing after load changed total from 0:30 to 0:45 with zero requests.
- Limits: desktop Chromium/emulated widths and enlarged root text only; no real mobile, Safari, or screen-reader claim. No deployment or commit performed.

- Final review patches applied: wrapped empty-state button, repeatable Node-runner Playwright regression (development dependency only), tests included in typechecking, stronger boundary assertions, noscript explanation, runtime/browser setup documentation.
- Parent reran typecheck, lint, all 32 domain tests, and test:browser (production build plus 1 browser regression): all passed. Matrix rows covered by passing domain and production-browser checks. Preview restarted under parent session at http://127.0.0.1:4173/.

- Completion: Story 1.1 implemented and verified. No local commit created: the human-approved frozen constraints require a user instruction before committing. Existing externally supplied AGENTS.md remains untouched.
