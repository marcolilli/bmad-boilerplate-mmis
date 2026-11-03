/** Raw strings belong to the draft; only a validated duration becomes a phase. */
export type DurationInput = { minutes: string; seconds: string }
export type DurationErrors = Partial<Record<keyof DurationInput, string>>
export type RunPhase = { type: 'run'; durationSeconds: number }
export type WorkoutResult =
  | { status: 'empty'; phases: []; totalSeconds: 0 }
  | { status: 'incomplete'; errors: DurationErrors }
  | { status: 'valid'; phases: [RunPhase]; totalSeconds: number }

export function calculateWorkout(input: DurationInput | null): WorkoutResult {
  if (input === null) return { status: 'empty', phases: [], totalSeconds: 0 }

  const errors: DurationErrors = {}
  const values = { minutes: 0, seconds: 0 }
  for (const field of ['minutes', 'seconds'] as const) {
    const raw = input[field]
    if (raw === '') {
      errors[field] = `Enter ${field}; use 0 if none.`
    } else if (!/^\d+$/.test(raw)) {
      errors[field] = `Use a nonnegative whole number for ${field}.`
    } else {
      values[field] = Number(raw)
      if (!Number.isSafeInteger(values[field])) {
        errors[field] = `Enter a smaller whole number for ${field}.`
      } else if (field === 'seconds' && values.seconds > 59) {
        errors.seconds = 'Use seconds from 0 to 59; put extra time in minutes.'
      }
    }
  }
  if (Object.keys(errors).length) return { status: 'incomplete', errors }

  // Check before multiplying/adding so an unsafe intermediate never becomes canonical.
  if (values.minutes > Math.floor((Number.MAX_SAFE_INTEGER - values.seconds) / 60)) {
    return { status: 'incomplete', errors: { minutes: 'Enter fewer minutes; this duration is too large.' } }
  }
  const totalSeconds = values.minutes * 60 + values.seconds
  if (totalSeconds === 0) {
    return { status: 'incomplete', errors: {
      minutes: 'Set a duration greater than zero.',
      seconds: 'Add seconds or minutes so the run lasts at least 1 second.',
    } }
  }
  return { status: 'valid', phases: [{ type: 'run', durationSeconds: totalSeconds }], totalSeconds }
}

export function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
