# Epic 1 Context: Prepare and reuse running workouts

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Enable recreational runners and trainers to prepare understandable structured running workouts, review total duration, explicitly save them without an account, and later reuse or maintain their personal library. Runners benefit from suggestions while trainers need custom composition. Both share one workout structure and editor. The prototype tests useful preparation and reuse, rather than tracking or executing runs. The epic grouping is approved; the breakdown remains a review draft, but the current user explicitly selected Story 1.1 and requires a plan and approval before code changes.

## Stories

- Story 1.1: Set up initial project from starter template
- Story 1.2: Compose a named sequence of phases safely
- Story 1.3: Add repeated run and recovery intervals
- Story 1.4: Start quickly from a suggested session
- Story 1.5: Save workouts and browse the local library
- Story 1.6: Reopen a saved workout and save an adapted copy
- Story 1.7: Update the selected workout without overwriting newer work
- Story 1.8: Delete a saved workout deliberately
- Story 1.9: Verify the complete prototype for participant evaluation

## Requirements & Constraints

Support blank and suggested starts, ordered phases, interval blocks, editable durations and repetitions, live preview, and an accurately derived total. Provide at least two fixed suggestions of different structures, including intervals; editing must never mutate the source suggestion. Phase types are warm-up, run, recovery, and cool-down. Interval blocks repeat run then recovery, including final recovery; blocks move as units and cannot nest.

Numeric values must be positive whole seconds/repetitions with safe integer arithmetic. Minutes/seconds input keeps seconds between 0 and 59. Retain raw invalid text with associated actionable errors; never show an invalid total as valid. Saving requires at least one valid item and a non-whitespace name.

Saving is explicit. New and copied workouts create separate entries; updating affects only the selected original. Allow duplicate names, distinguish entries by saved/updated timestamps, and restore the complete saved structure when reopening. Confirm deletions by name. Failed saves, loads, updates, and deletes preserve drafts and existing data and explain recovery/retry. Warn before in-app replacement of changed drafts.

Core journeys must work at 320 CSS-pixel width and 200% text size, with keyboard controls, visible focus, accessible names, text errors/status, and non-drag reordering. After initial load, connection loss must not interrupt core editing, suggestions, or local storage. Explain same-browser/device retention, possible loss on clearing browser data, and no synchronization or backup. Verify current iOS Safari, Android Chrome, desktop Chrome, and one mobile screen reader, recording versions.

Evaluation uses three runners and three trainers, with later-session reuse. At least two of three per audience should prepare/save independently and later adapt/reuse while identifying a future use occasion. Observe time and comparison to current methods, comprehension of interval/final-recovery semantics, and unintended data changes. Treat participant findings separately from functional completion.

## Technical Decisions

Use a browser-only layered application: React UI depends on the application controller and pure domain; the controller owns draft/operation state and calls the sole IndexedDB repository. Domain contains shared workout types, validation and calculation without rendering, storage or network dependencies. Do not introduce a backend or global state framework.

Use the official Vite react-ts starter. Architecture baselines are React/React DOM 19.3.1, TypeScript 7.0.2, Vite 8.3.5, React plugin 6.1.2, Node 24.13.0, npm 11.6.2; application manifests/lockfile own resolved versions once implemented. Retain development checks. Introduce modules/entities only when a story needs them.

Canonical workout content consists of a name and ordered standalone phases or interval blocks. Durations and total derive through one validation/calculation path. Keep editable raw text separate from valid canonical content. A draft is isolated from saved records and suggestions; retain its baseline and optional source ID/revision. Successful create/copy/update rebinds the editor to the complete committed record. Failure leaves source and baseline unchanged.

Saved records use UUID identity, schema version 1, UTC ISO timestamps and positive revisions. The repository offers asynchronous list/get/create/update/delete. Use insert-only creates and revision-checked transactional updates/deletes; update must never recreate a missing record. Report success only after transaction completion. Writes use immutable snapshots with editing/navigation/mutations blocked pending. Retrying a create retains its operation ID and recognizes an identical committed record without duplication. Return distinct recoverable errors; preserve last confirmed library with stale/error indication and never reset storage after invalid/read errors. Close connections on version changes and explain blocked upgrades.

Bundle all core code, assets and suggestions; no core runtime network dependencies. Serve a static build at a stable HTTPS evaluation origin, distinct from test/preview origins. Provider selection waits until deployment. No service worker, offline-start guarantee, automatic draft crash recovery, accounts/sync, speech, tracking, execution, sharing, imports or exports. Future migrations/rollbacks must preserve compatible stored data. Automatic multi-tab refresh is deferred; revision conflict protection is required.

## UX & Interaction Patterns

Alex opens a suggestion, reviews or adjusts it, names it, and saves it. Sam creates a custom interval session, saves it, later reopens it and chooses update-original or save-copy. Use one editor and a personal library; unavailable future actions should not appear functional. Dirty-draft transitions offer stay/discard. Errors preserve user input and communicate what can be retried. No separate visual design contract exists; use the specified responsive and accessible interaction constraints without inventing a design system.

## Cross-Story Dependencies

The proposed serial order is 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 1.8 → 1.9, with no external epic dependency. Each story must be demonstrable without later work. Storage begins with persistence, not starter setup. Accessibility, validation and integrity accompany each capability; the final verification story checks whole journeys rather than adding those foundations late.
