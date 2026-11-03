---
status: draft
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics]
inputDocuments:
  - /Users/ml/Projects/Uni/26WiSe/MMIS/bmad-boilerplate/PRD.md
  - /Users/ml/Projects/Uni/26WiSe/MMIS/bmad-boilerplate/ARCHITECTURE-SPINE.md
---

# RunReady - Epic Breakdown

## Overview

Workflow stage: one epic approved; story breakdown drafted for review. No story is selected or authorized for implementation.

This document provides the complete epic and story breakdown for RunReady, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR-1 — Choose a starting point.** Users can begin from a suggestion or a blank draft. Realizes UJ-1 and UJ-2.

- **AC-1.1:** A blank draft contains no phases or interval blocks and displays a zero total duration.
- **AC-1.2:** Opening a suggestion produces an editable draft with its phases, interval blocks, and calculated total duration.
- **AC-1.3:** Editing or saving that draft leaves the suggestion unchanged.
- **Requirement:** provide at least two fixed, clearly named suggestions with different structures, including one interval workout. No user questionnaire or generated suggestions is required. Suggestions are examples, without claims of personal suitability.

### Editing and reviewing

**FR-2 — Compose the plan.** Users can add, edit, remove, and reorder phases and interval blocks. Realizes UJ-1 and UJ-2.

- **AC-2.1:** Users can set each phase's type and duration, and edit both phases and the repetition count of an interval block.
- **AC-2.2:** Reordering changes the execution order shown in the preview; removing an item removes its duration from the total.
- **AC-2.3:** Reordering has an accessible alternative to dragging, usable with a keyboard and touch.
- **Requirement:** an interval block is moved or removed as a unit. Its run phase always precedes its recovery phase; blocks cannot be nested.

**FR-3 — Validate values.** Users receive actionable feedback for invalid inputs.

- **AC-3.1:** Durations are positive whole seconds entered as minutes and seconds, with seconds from 0–59; repetitions are positive whole numbers. Empty, negative, fractional, nonnumeric, or non-finite values cannot be saved.
- **AC-3.2:** Saving requires at least one valid phase or interval block and a name containing a non-whitespace character. Invalid fields are identified in text without clearing entered values.
- **AC-3.3:** An invalid draft is visibly marked incomplete and never presents an invalid calculation as a valid total.

**FR-4 — Preview the complete workout.** The ordered preview and total update whenever a valid edit changes the plan. Realizes UJ-1 and UJ-2.

- **AC-4.1:** The preview shows each phase's type and duration and each interval block's run duration, recovery duration, and repetition count.
- **AC-4.2:** Total duration equals standalone phase durations plus, for each interval block, repetitions × (run duration + recovery duration). Recovery is included after the final run repetition. No transitions add hidden time.
- **AC-4.3:** A 5-minute warm-up, 3 repetitions of 60-second run plus 30-second recovery, and 5-minute cool-down total 14 minutes 30 seconds. Changing repetitions to 4 produces 16 minutes.

### Saving and reuse

**FR-5 — Explicitly save without an account.** Users name and save valid drafts without registration. Realizes both journeys.

- **AC-5.1:** Saving a new workout creates one new library entry and reports success only after storage succeeds. Existing entries remain unchanged.
- **AC-5.2:** Editing alone does not write changes to saved workouts. Repeated activation while a save is pending does not create unintended duplicates.
- **AC-5.3:** The library persists in the same browser on the same device across reloads and normal restarts. The app explains that data is retained there, is unavailable on other devices/browsers, and may be lost if browser data is cleared. It makes no backup or permanent-retention promise.
- **AC-5.4:** A failed save shows a readable error and retry action, retains the current draft, and preserves previously saved workouts.

**FR-6 — Browse and reopen.** Users can find and open saved workouts. Realizes UJ-2.

- **AC-6.1:** Library entries display at least the workout name and total duration; an empty library provides a path to start a workout.
- **AC-6.2:** Reopening restores the saved name, ordered phases, durations, interval blocks, and repetition counts.
- **AC-6.3:** A load failure is explained with a retry option; it does not silently replace stored data with an empty library or clear an existing draft.
- **Requirement:** duplicate names are allowed. Entries show a saved/updated timestamp so users can distinguish them. Search, sorting controls, and folders are deferred.

**FR-7 — Update or save a copy.** A reopened workout offers distinct actions to update the original or create a new library entry. Realizes UJ-2.

- **AC-7.1:** Updating changes only the selected saved workout, including its name if changed; the library count remains the same.
- **AC-7.2:** Saving a copy creates a distinct entry and leaves the source unchanged, even if the names match.
- **AC-7.3:** Failure of either action preserves the draft and previously saved versions, reports the error, and permits retry.

**FR-8 — Delete deliberately.** Users can delete selected saved workouts.

- **AC-8.1:** Deletion requires confirmation naming the selected workout. Cancel leaves the library unchanged; confirmation removes only that entry.
- **AC-8.2:** Failed deletion reports an error and keeps the entry available. Deleting one workout leaves other workouts intact.

**FR-9 — Protect unsaved changes.** In-app actions that would replace a changed draft warn the user first.

- **AC-9.1:** Starting another workout, opening another saved workout, or leaving the editor offers a choice to stay or discard unsaved changes.
- **AC-9.2:** Staying retains the complete draft. Discarding does not change saved workouts.
- **AC-9.3:** Automatic draft restoration after browser closure, crashes, or reload is deferred; this limitation is explained when relevant.

### NonFunctional Requirements

- **NFR-1 — Mobile usability:** core journeys work at a 320 CSS-pixel viewport width without horizontal scrolling. At 200% text size, required controls and content remain reachable without overlap or truncation that hides meaning.
- **NFR-2 — Accessible interaction:** all core actions work with a keyboard, have visible focus and accessible names, and expose input errors to screen readers. Phase order, repetition counts, total duration, and save outcomes are available without relying on color or visual layout. Verify both journeys with keyboard-only interaction and at least one mobile screen reader before evaluation.
- **NFR-3 — Connectivity boundary:** after the app loads, editing, calculation, and saving/reopening the local library work if connectivity drops. First-time offline loading and reopening an uncached app offline are deferred. No speech reliability requirement remains in scope.
- **NFR-4 — Data integrity:** failed storage operations must not erase previously saved workouts or the current in-memory draft. Storage unavailability produces a visible explanation instead of a false success.
- **NFR-5 — Evaluation environment:** verify core journeys in current Safari on iOS and Chrome on Android, plus keyboard use in desktop Chrome. Record tested versions in the evaluation notes. Broader browser coverage is deferred.

### Additional Requirements

- Architecture AD-1: layered browser-only application; UI, controller, pure domain, and sole IndexedDB repository follow the defined dependency direction.
- Starter: official Vite react-ts template with the architecture stack baselines and lockfile. Reserve Epic 1 Story 1 for initial project setup; introduce storage only with the first persistence story.
- Architecture AD-2: shared canonical workout model; standalone phases or non-nested run/recovery interval blocks; positive safe integer seconds/repetitions; one validator and derived duration calculator; recovery after every repetition.
- Architecture AD-3: isolated in-memory draft, raw numeric text, baseline and source identity; explicit commands; successful saves rebind ID/revision and baseline; failures preserve them; dirty-draft stay/discard protection.
- Architecture AD-4: stable UUID identity, schema version 1, UTC timestamps, revisions, atomic writes, revision checks, commit-based success, duplicate-safe retry, immutable pending-write snapshots, blocked controls during writes, and recoverable typed errors. Never reset storage on read/validation failure.
- Architecture AD-5: bundle all required assets and suggestions; no core runtime network requests; stable HTTPS evaluation origin; separate test origins; no service worker or offline-start promise; preserve data across future migrations and compatible rollbacks.
- Architecture AD-6: verify domain, real repository, failure paths, stale revisions/retries, both journeys, connectivity loss, accessibility and the PRD browser matrix. Record tested versions.
- PRD §7: evaluate with three runners and three trainers across preparation and later reuse; collect task outcomes, times, comprehension and data-control failures. Apply the approved per-audience success thresholds; keep participant evaluation separate from implementation checks.
- Scope exclusions from PRD §4 and architecture Deferred remain binding. Static hosting provider and release URL are selected before external evaluation.

### UX Design Requirements

No separate UX design contract was found. Apply the journeys, interactions, responsive and accessibility requirements in PRD.md and ARCHITECTURE-SPINE.md; no visual system is inferred.

### FR Coverage Map

| Requirement | Epic | Stories |
| --- | --- | --- |
| FR-1: blank and suggested starts | 1 | 1.1, 1.4 |
| FR-2: phase and interval editing | 1 | 1.1, 1.2, 1.3 |
| FR-3: validation | 1 | 1.1, 1.2, 1.3, 1.5 |
| FR-4: ordered preview and total | 1 | 1.1, 1.2, 1.3 |
| FR-5: explicit account-free saving | 1 | 1.5 |
| FR-6: browse and reopen | 1 | 1.5, 1.6 |
| FR-7: update or copy | 1 | 1.6, 1.7 |
| FR-8: deliberate deletion | 1 | 1.8 |
| FR-9: unsaved-change protection | 1 | 1.2, 1.4, 1.6 |
| NFR-1, NFR-2: mobile and accessibility | 1 | Every UI story; full journey verification in 1.9 |
| NFR-3: connection loss after load | 1 | 1.4, 1.5, 1.9 |
| NFR-4: data integrity | 1 | 1.5–1.8 |
| NFR-5: browser matrix | 1 | 1.9 |
| AD-1–AD-3: boundaries, domain, draft | 1 | 1.1–1.4, 1.6–1.7 |
| AD-4: transactional repository | 1 | 1.5–1.8 |
| AD-5: static runtime and origin | 1 | 1.1, 1.4, 1.5, 1.9 |
| AD-6: verification | 1 | Each story's checks; full journeys in 1.9 |

## Epic List

### Epic 1: Prepare and reuse running workouts

Runners and trainers can prepare an understandable workout, review its duration, explicitly save it, and later adapt or delete it. Covers FR-1–FR-9 and NFR-1–NFR-5 under architecture AD-1–AD-6.

One epic is approved because these capabilities share the workout model, editor/controller and library. Ordered stories provide incremental value without repeated changes across artificial technical epics. There are no dependencies on another epic.

## Epic 1: Prepare and reuse running workouts

Deliver the complete preparation-and-reuse workflow through the following proposed stories. All stories are review drafts, not implementation authorizations.

### Story 1.1: Set up initial project from starter template

As a runner,
I want to enter a running phase and see its duration in a working app,
So that I can check a simple plan immediately.

**Dependencies:** None.

**Requirements:** FR-1 (blank start), FR-2 (initial run phase), FR-3 (duration validation), FR-4 (initial preview); NFR-1–NFR-2 for this slice; AD-1–AD-3, AD-5–AD-6.

**Acceptance Criteria:**

- **Given** the repository has no application, **when** the official Vite react-ts starter is installed and configured, **then** development, type checking, linting, and production build commands succeed, **and** dependencies are locked, the app uses the architecture seed, and only modules needed for this slice are created. No IndexedDB store, backend, or future feature is scaffolded.
- **Given** the app opens, **when** a blank draft is shown, **then** it has no items and displays a zero duration, **and** the runner can add one run phase, enter minutes/seconds, and see its duration and total update together. This first slice supports one run phase; multiple phases and other types follow in 1.2.
- **Given** a duration is edited, **when** input is empty, negative, fractional, nonnumeric, non-finite, outside safe integer bounds, or has seconds outside 0–59, **then** raw text remains editable with an associated text error and no misleading valid total. Positive whole-second durations use one pure domain validation/calculation path; meaningful domain checks cover valid and invalid values.
- **Given** this screen is used by keyboard or at 320 CSS pixels and 200% text, **when** the runner adds or edits the phase, **then** labels, visible focus, error messages, and preview remain usable. The production build loads the slice without runtime network calls.

### Story 1.2: Compose a named sequence of phases safely

As a runner or trainer,
I want to name a workout and arrange its phases,
So that I can prepare a complete session in the intended order.

**Dependencies:** 1.1.

**Requirements:** FR-2 (standalone phases), FR-3, FR-4, FR-9; NFR-1–NFR-2; AD-1–AD-3, AD-6.

**Acceptance Criteria:**

- **Given** a blank or existing draft, **when** phases are added or edited, **then** users can choose warm-up, run, recovery, and cool-down, set each duration, and edit a workout name. Empty or whitespace-only names and empty plans are marked incomplete for saving; actual saving arrives in 1.5.
- **Given** multiple phases, **when** the user removes or moves an item with keyboard/touch buttons, **then** the preview reflects the resulting order and total immediately, **and** totals are derived from content rather than separately editable state. Focus remains usable after moving or removing an item.
- **Given** invalid fields, **when** the plan changes, **then** validation preserves the raw entries, associates errors with inputs, and marks the plan incomplete; invalid totals are not presented as valid.
- **Given** changes since the blank baseline, **when** the user starts another blank workout or leaves the editor in-app, **then** a stay/discard choice appears; staying preserves the entire draft and discarding resets it deliberately. Unchanged drafts do not prompt. Reload/crash recovery is explicitly outside scope.
- **Given** the new controls, **when** exercised by keyboard at the mobile/text-size bounds, **then** all actions and validation remain accessible, **and** domain/controller checks cover ordered edits and draft protection.

### Story 1.3: Add repeated run and recovery intervals

As a trainer,
I want to add and adjust repeated run/recovery pairs,
So that I can prepare structured interval sessions.

**Dependencies:** 1.2.

**Requirements:** FR-2–FR-4; NFR-1–NFR-2; AD-2–AD-3, AD-6.

**Acceptance Criteria:**

- **Given** a draft, **when** an interval block is added, **then** it has editable run duration, recovery duration, and positive whole-number repetitions. Run precedes recovery, blocks cannot nest, and each block moves or is removed as one unit alongside standalone phases.
- **Given** a five-minute warm-up, three repetitions of 60-second run plus 30-second recovery, and a five-minute cool-down, **when** previewed, **then** the total is 14:30; four repetitions yield 16:00. The preview exposes both durations and repetition count, including recovery after the last run.
- **Given** invalid durations/repetitions or unsafe arithmetic, **when** edited, **then** entered text is retained with field errors and the total is not reported as valid. Domain checks cover repetition calculation, final recovery, and overflow.
- **Given** keyboard or screen-reader interaction, **when** an interval is edited/reordered, **then** names identify each control and the new order, repetition count, and total are available without relying on color or dragging.

### Story 1.4: Start quickly from a suggested session

As a recreational runner,
I want an editable suggested workout,
So that I can prepare a session without composing every phase.

**Dependencies:** 1.3.

**Requirements:** FR-1 (suggestions), FR-9; NFR-1–NFR-3; AD-2–AD-3, AD-5–AD-6.

**Acceptance Criteria:**

- **Given** the start screen, **when** suggestions are displayed, **then** at least two fixed, clearly named examples have different structures, including one interval workout; they make no personal-suitability claims.
- **Given** a selected suggestion, **when** it opens, **then** its ordered phases, intervals, and calculated duration populate an independent draft using the existing editor, **and** subsequent edits never alter the bundled suggestion.
- **Given** a dirty draft, **when** another suggestion or blank workout is selected, **then** the existing stay/discard protection applies before replacement.
- **Given** the app has loaded and connectivity drops, **when** suggestions are selected and edited, **then** the complete flow works using bundled code/data/assets. No service worker or offline startup is required. Check suggestion isolation and connection-loss behavior.

### Story 1.5: Save workouts and browse the local library

As a runner or trainer,
I want to explicitly save a named workout and see it in my library,
So that I can keep sessions without creating an account.

**Dependencies:** 1.4.

**Requirements:** FR-3 (save gate), FR-5, FR-6 (listing and load errors); NFR-1–NFR-4; AD-3–AD-6.

**Acceptance Criteria:**

- **Given** a valid named draft, **when** Save is activated, **then** an insert-only IndexedDB transaction creates a UUID-keyed schema-version-1 record with canonical content, UTC creation/update timestamps and revision 1. A blank/invalid draft cannot be saved. This story creates only the store and create/list operations it uses.
- **Given** a write is pending, **when** more actions are attempted, **then** editing, replacement/navigation and further mutations are blocked; success is announced only after transaction completion. The committed record becomes the draft baseline and active source. Retrying the same create uses the same operation ID and cannot produce a duplicate; an existing identical committed record is recognized as success.
- **Given** saved workouts, **when** the library is loaded or the browser is reloaded/restarted normally, **then** the list shows name, derived total, and saved/updated timestamp. Duplicate names remain distinct records. An empty library offers a path to start a workout; selecting/reopening entries follows in 1.6.
- **Given** storage is unavailable/blocked, a transaction aborts, or a load/record validation fails, **when** saving or loading, **then** an actionable error and retry guidance appear without false success, clearing the draft, resetting the database, or overwriting prior records. Retain the last confirmed list with a stale/error indication rather than presenting it as current. Handle version-change connection closure and blocked upgrades without data loss.
- **Given** the app is loaded and connectivity drops, **when** the user saves or lists workouts, **then** the flow works locally. Explain same-browser/device retention, lack of sync/backup, and possible loss when browser data is cleared.
- **Given** verification, **when** create/list run through real browser IndexedDB, **then** duplicate-name, reload, pending-action, retry, aborted-write and load-failure cases pass with accessible success/error status. Editing an already-saved draft does not autosave; updating is deferred to 1.7 and must not be offered as a working action yet.

### Story 1.6: Reopen a saved workout and save an adapted copy

As a runner or trainer,
I want to reopen and adapt an earlier workout as a copy,
So that I can reuse it while preserving the original.

**Dependencies:** 1.5.

**Requirements:** FR-6 (reopening), FR-7 (copy), FR-9; NFR-1–NFR-4; AD-2–AD-4, AD-6.

**Acceptance Criteria:**

- **Given** a library entry, **when** opened, **then** repository get restores its saved name, ordered phases, durations, blocks and repetitions into an independent draft with source ID/revision and baseline. Changes do not alter the stored workout.
- **Given** a dirty draft, **when** another entry opens or the editor is left, **then** stay preserves it and discard permits the requested transition. Failed/missing/invalid loads preserve it, explain the problem, and allow retry.
- **Given** an adapted valid draft, **when** Save a copy is selected, **then** a new record is created even when its name matches the original. The source remains unchanged; the committed copy becomes the active source/baseline so later updates target the copy. Saving/retry/failure behavior follows 1.5.
- **Given** these flows, **when** tested through the real repository, **then** restored content matches exactly, edits remain isolated, and copy failures preserve existing records and the draft. All controls, confirmations, and errors work by keyboard and accessible labels.

### Story 1.7: Update the selected workout without overwriting newer work

As a trainer,
I want to update an existing session deliberately,
So that I can maintain my library without creating a copy every time.

**Dependencies:** 1.6.

**Requirements:** FR-7 (update and choice); NFR-1–NFR-4; AD-3–AD-4, AD-6.

**Acceptance Criteria:**

- **Given** a draft with a saved source, **when** actions are displayed, **then** Update original and Save a copy are distinct. A new unsaved draft offers Save, without an update action that has no source.
- **Given** Update original, **when** the expected revision matches in one transaction, **then** only that UUID's record changes; ID/creation time and library count stay unchanged, revision increments, and the updated name/content/timestamp appear after commit. The returned record rebinds source/revision/baseline.
- **Given** another tab has changed/deleted the record, **when** update compares revisions, **then** it returns a conflict/missing result rather than overwriting or recreating it; the draft remains available, with guidance to reload deliberately or save a copy. Reloading/replacing the draft requires the existing dirty-draft protection.
- **Given** a pending or failed update, **when** completion occurs, **then** the same snapshot/control-lock and commit/error rules as 1.5 apply; failure leaves the prior saved version, source and baseline intact. Verify normal update, update-after-copy, abort, stale revision, and missing-record cases through the repository.

### Story 1.8: Delete a saved workout deliberately

As a runner or trainer,
I want to remove an unwanted saved workout,
So that I can maintain a useful library.

**Dependencies:** 1.7.

**Requirements:** FR-8; NFR-1–NFR-2, NFR-4; AD-3–AD-4, AD-6.

**Acceptance Criteria:**

- **Given** a selected saved workout, **when** Delete is activated, **then** a confirmation names that workout; cancel changes nothing and returns focus to the initiating control. Confirm targets its UUID and expected revision.
- **Given** a matching revision, **when** the transaction commits, **then** only that entry is removed and the list/empty state updates. A draft whose source was deleted retains its content and can be saved as a new entry; it cannot silently recreate that record through Update.
- **Given** a stale/missing record or failed transaction, **when** deletion fails, **then** an actionable error appears, the last confirmed entry remains with stale/error status, other records remain unchanged, and the draft is preserved. A retry cannot bypass a revised-record confirmation.
- **Given** keyboard/screen-reader use and real IndexedDB, **when** confirm/cancel, pending, success, abort and revision-conflict paths run, **then** confirmation, focus, status announcements and data-integrity behavior meet the preceding criteria.

### Story 1.9: Verify the complete prototype for participant evaluation

As a prototype evaluator,
I want evidence that both user journeys work across the agreed devices and failure cases,
So that evaluation measures the value proposition rather than broken interactions.

**Dependencies:** 1.8.

**Requirements:** NFR-1–NFR-5, cross-journey verification of FR-1–FR-9; AD-5–AD-6; PRD §7 evaluation handoff.

**Acceptance Criteria:**

- **Given** the completed app, **when** Alex's suggestion-to-save and Sam's blank-interval-to-save/reopen/adapt journeys run through the real repository, **then** their criteria pass, including the PRD duration examples, explicit update/copy distinction and unsaved-change protection. Fix defects found in the affected slice rather than postponing basic accessibility or integrity to this story.
- **Given** current iOS Safari, Android Chrome and desktop Chrome, **when** the journeys run, **then** tested versions and outcomes are recorded; 320-pixel width, 200% text, keyboard-only use, and at least one mobile screen reader are checked. Required content/actions remain reachable, with visible focus, useful labels and announced errors/outcomes.
- **Given** a loaded app, **when** connectivity is lost and save/load failures are exercised, **then** core editing, suggestions and local storage still operate without network dependencies; failed operations preserve drafts/saved records and never show false success. Cover stale revisions and duplicate-safe retries as architecture integrity checks.
- **Given** the production build, **when** it is served from a preview origin, **then** core assets load from that origin and the same journeys work; record that the external evaluation host/release URL still needs selection before participant use. Do not deploy externally or migrate participant data as part of this story. No offline-start or crash-recovery guarantee is implied.
- **Given** the approved study design, **when** preparing the evaluation handoff, **then** provide a concise observation checklist for three runners and three trainers, separate-session reuse, per-audience success thresholds, task times, comprehension and data-control failures. Participant recruitment, running the study and claiming successful value validation are outside this implementation story.

## Implementation recommendation

Start with **Story 1.1**. It is the only dependency-free story and supplies the required starter plus a small usable result: enter one run duration and see a correct preview. It exercises UI → controller → domain immediately, without prematurely building storage or the entire editor. Story 1.2 then extends that same path to complete standalone-phase composition.

All dependencies above are the recommended serial implementation order, not independent parallel work. Each story must remain demonstrable without later stories; hide unavailable actions instead of shipping misleading controls. Apply accessibility, validation, and data-integrity criteria when introducing each capability, rather than relying on 1.9 to add them.

## Review status

Nine stories are proposed for the approved epic. No implementation has started. Review the scope, acceptance criteria and dependencies before final validation and selection of a story.
