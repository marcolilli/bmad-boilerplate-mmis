---
title: Show duration field errors only after blur
type: bugfix
created: 2026-11-03
status: done
route: oneshot
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

Reproduce the initial-focus validation message and distinguish the implementation cause from the captured product intent. Untouched or focused fields must not display errors. Introduce errors only when that field loses focus (blur); clear its displayed error when refocused/edited, and validate it again on the next blur. Clear existing cross-field errors when correcting another value makes them obsolete, without introducing new errors while typing. Keep preview calculation live and incomplete drafts distinct from valid totals. Preserve raw text, calculation rules and accessible error associations. Recheck initial automatic focus, both fields independently, repeated focus/edit/blur, cross-field zero duration, valid recovery and the existing slice. No dependency or architectural replacement is needed. Leave changes uncommitted for review.

</frozen-after-approval>

## Implementation Notes

- Reproduced in the production browser: Add focuses minutes while both untouched fields immediately have error messages; minutes has aria-invalid=true.
- Root cause: UI directly renders every domain validation error, conflating draft validity with when to show feedback. Story/spec never defined blur timing; this was an incorrect UX default in the approach, not a duration-calculation defect.
- Small reversible change: controller owns visible field-error lifecycle; UI forwards focus/blur; browser regression verifies timing. No unresolved intent gap or irreversible action.

- Implemented the blur-only field-feedback lifecycle in the controller; UI forwards focus/blur. Updated Story 1.1 acceptance text and README with the clarified timing.
- Rechecked production preview: initial minutes focus has no errors; moving focus to seconds shows only the minutes error.

## Review Triage Log

- Reviewer 1 — medium, patched: blur errors were not live-announced and refocus removes their descriptive association. Added persistent polite live containers for each field's blur feedback. Actual screen-reader audit remains part of the previously deferred device verification.
- Reviewer 2 — low, patched: browser test checked removal of the message but not removed accessible error associations. Added assertions for aria-invalid=false and retaining only duration-help on refocus.
- Reviewer 3 — low, patched: tests did not cover reverse cross-field clearing or preservation of an unrelated error. Added both scenarios.
- Reviewer 4 — low, patched: narrow-layout checks did not include visible blur errors. Added checks during invalid-field and cross-field error states at 320px/200% text.

- Final verification passed: typecheck, lint, all 32 domain tests, production build, and the expanded browser regression covering initial focus, blur, refocus, error associations/live containers, raw input, cross-field clearing/preservation, narrow enlarged error states, and offline editing. Changes left uncommitted as recorded in intent.
