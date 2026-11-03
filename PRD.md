---
title: RunReady
status: final
created: 2026-11-03
updated: 2026-11-03
source: idea.md
---

# PRD: RunReady

## 1. Purpose and value proposition

RunReady is a running web app that helps recreational runners and trainers prepare understandable, structured workouts and keep them for reuse. Runners get a suggested starting point; trainers get control over custom interval sessions. Both use the same editor and personal library, without needing separate roles or accounts.

This prototype tests whether combining quick starting suggestions, an editable plan with a clear total duration, and a reusable library offers value to both groups. This PRD defines observable behavior for design, implementation, and prototype evaluation. The product owner approved all scope decisions, behavior, quality requirements, and evaluation defaults on November 3, 2026.

## 2. Users and journeys

**Recreational runners:** prepare a session quickly on a phone, with enough control to adjust a suggestion.

**Trainers:** compose custom interval sessions, find earlier work, and adapt it for another session. Trainer-to-client delivery and shared libraries are outside this prototype.

These journeys come from idea.md:

- **UJ-1 — Alex prepares a suggested workout.** Alex opens RunReady on a phone, chooses a suggestion, reviews the phases and total duration, adjusts the plan if needed, gives it a name, and explicitly saves it. The workout appears in the library for reuse.
- **UJ-2 — Sam creates and reuses an interval workout.** Sam starts a blank workout, adds phases and repeated run/recovery pairs, checks the complete plan, and saves it under a recognizable name. Later Sam reopens it, changes it, and chooses either to update the original or save a separate copy.

## 3. Glossary

- **Workout:** a named, ordered plan containing phases and interval blocks.
- **Phase:** one activity with a type and duration: warm-up, run, recovery, or cool-down.
- **Interval block:** one run phase followed by one recovery phase, repeated together a specified number of times.
- **Draft:** the workout currently being edited; changes remain unsaved until the user saves.
- **Suggestion:** a predefined workout used as an editable starting point.
- **Library:** the collection of saved workouts available to the user.

## 4. Prototype scope

**Included:** suggested and blank starts; phase editing and ordering; interval blocks; live preview and total duration; named saving without an account; library browsing, reopening, updating, copying, and deletion; mobile and accessible interaction; recoverable save/load errors.

**Deferred:** text-to-speech, including speech under unstable connectivity. This was a candidate in idea.md and is explicitly deferred by the user.

**Non-goals:** live workout execution or countdowns, GPS tracking, training advice or personalization, accounts, cross-device synchronization, trainer/client sharing, imports, and exports. These do not need to be built to test preparation and reuse.

## 5. Required behavior and acceptance criteria

Acceptance criteria below define prototype completion.

### Starting a workout

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

## 6. Cross-cutting quality

- **NFR-1 — Mobile usability:** core journeys work at a 320 CSS-pixel viewport width without horizontal scrolling. At 200% text size, required controls and content remain reachable without overlap or truncation that hides meaning.
- **NFR-2 — Accessible interaction:** all core actions work with a keyboard, have visible focus and accessible names, and expose input errors to screen readers. Phase order, repetition counts, total duration, and save outcomes are available without relying on color or visual layout. Verify both journeys with keyboard-only interaction and at least one mobile screen reader before evaluation.
- **NFR-3 — Connectivity boundary:** after the app loads, editing, calculation, and saving/reopening the local library work if connectivity drops. First-time offline loading and reopening an uncached app offline are deferred. No speech reliability requirement remains in scope.
- **NFR-4 — Data integrity:** failed storage operations must not erase previously saved workouts or the current in-memory draft. Storage unavailability produces a visible explanation instead of a false success.
- **NFR-5 — Evaluation environment:** verify core journeys in current Safari on iOS and Chrome on Android, plus keyboard use in desktop Chrome. Record tested versions in the evaluation notes. Broader browser coverage is deferred.

## 7. Prototype validation

This prototype validates the value proposition for both audiences. The product owner approved the following study design and thresholds; results remain to be collected.

Recruit 3 recreational runners and 3 trainers. Each completes their relevant journey, then returns in a separate session to reopen and adapt a saved workout. Record task outcomes and time through observation; product analytics are not required.

- **SM-1 — Useful preparation:** at least 2 of 3 participants in each audience create and save a workout they judge usable without facilitator intervention. Validates FR-1 through FR-5.
- **SM-2 — Useful reuse:** at least 2 of 3 in each audience reopen, adapt, and save an earlier workout, and can name a concrete future occasion when they would use RunReady again. Validates FR-6 and FR-7. Report each audience separately so success in one cannot hide failure in the other.
- **SM-3 — Preparation speed:** observe time to first saved workout separately for suggested and blank starts; collect participants' comparisons to their current method. Establish a baseline before setting a speed target.
- **SM-C1 — Comprehension:** every participant can explain the run/recovery order and whether final recovery is included. Faster completion must not hide misunderstanding of the workout.
- **SM-C2 — Data control:** no observed unintended overwrites or deletions, and no false save-success messages. Any occurrence requires correction before another evaluation round.

These small-sample findings guide iteration; they do not establish market demand. Functional completion means the acceptance criteria and quality checks pass; value validation requires the participant evidence above.

## 8. Decision status

The product owner approved all requirements and evaluation defaults on November 3, 2026. No open decisions or unconfirmed assumptions remain.

Key decisions: both audiences are in scope; saving requires no account and retains workouts in the same browser on the same device; speech is deferred; saved workouts support updating the original and saving a copy; interval blocks repeat a run/recovery pair and include recovery after the final repetition.

The prototype evaluation in §7 remains future work. Success criteria may be revised after pilot observations, with the reason recorded.
