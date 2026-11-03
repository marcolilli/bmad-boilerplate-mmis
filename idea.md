# RunReady

RunReady is a proposed running web app that helps recreational runners and trainers prepare structured workouts, save them, and use them again. It combines simple starting suggestions with a flexible workout editor and a personal library of reusable sessions.

## Problem

Runners often want to prepare a usable session quickly, especially on a phone, without deciding every detail from scratch. Trainers need more control: they compose interval sessions for recreational runners and need to find, adapt, and maintain earlier work. Both groups benefit from a clear view of the planned phases and total duration before saving a workout.

## Who it serves

- **Recreational runners** who want a quick starting point, with the option to adjust a suggested workout.
- **Trainers** who want to create custom interval sessions and maintain their own workout library.

One person can use RunReady in either context. Both groups work with the same underlying workout structure, while their starting points and need for customization differ.

## Core experience

1. **Start a workout.** Choose a suggested session or create one from scratch.
2. **Compose or adjust it.** Add, edit, remove, and reorder phases such as warm-up, running intervals, recovery, and cool-down. Set phase durations and interval repetition counts.
3. **Review the plan.** See the ordered phases and calculated total duration, with the preview updating as the workout changes.
4. **Keep it.** Give the workout a name and explicitly save it as a new library entry without replacing existing workouts.
5. **Return to earlier work.** Browse saved workouts, reopen a selected session, edit it, or delete it when it is no longer needed.

The course concept also includes hearing the current plan aloud through text-to-speech and saving plans without requiring an account. These capabilities should be considered during scope definition; speech should remain useful with an unstable mobile connection, and the app should clearly explain where saved plans are retained.

## Example scenarios

**Alex, a runner,** has a short window to prepare a session on a phone. Alex opens a suggested workout, checks its phases and duration, optionally adjusts it, and saves it for reuse.

**Sam, a trainer,** prepares interval sessions for recreational runners. Sam creates a custom sequence, adjusts durations and repetitions, reviews the complete workout, and saves it with a recognizable name. Later, Sam finds the session in the library and edits it for another training session.

## What should make it useful

RunReady should make preparation quick while keeping the workout understandable and editable. Its interface should work well on phones, support keyboard and screen-reader use, and remain usable with enlarged text. Failed saves or loads should explain the problem and preserve the current draft and existing workouts. Users should control saving and deletion.