import { useState } from 'react'
import { calculateWorkout, type DurationErrors, type DurationInput } from '../domain/workout'

type Draft = { duration: DurationInput | null; errors: DurationErrors }

export function useWorkoutDraft() {
  const [draft, setDraft] = useState<Draft>({ duration: null, errors: {} })
  const result = calculateWorkout(draft.duration)

  function addRunPhase() {
    setDraft(current => current.duration === null
      ? { duration: { minutes: '', seconds: '' }, errors: {} }
      : current)
  }

  function editDuration(field: keyof DurationInput, value: string) {
    setDraft(current => {
      if (current.duration === null) return current
      const duration = { ...current.duration, [field]: value }
      const validation = calculateWorkout(duration)
      const errors: DurationErrors = {}
      // Typing can clear obsolete feedback, but only blur may introduce an error.
      for (const key of ['minutes', 'seconds'] as const) {
        if (key !== field && current.errors[key] && validation.status === 'incomplete' && validation.errors[key]) {
          errors[key] = current.errors[key]
        }
      }
      return { duration, errors }
    })
  }

  function focusDuration(field: keyof DurationInput) {
    setDraft(current => ({ ...current, errors: { ...current.errors, [field]: undefined } }))
  }

  function blurDuration(field: keyof DurationInput) {
    setDraft(current => {
      const validation = calculateWorkout(current.duration)
      return { ...current, errors: {
        ...current.errors,
        [field]: validation.status === 'incomplete' ? validation.errors[field] : undefined,
      } }
    })
  }

  return { duration: draft.duration, result, errors: draft.errors, addRunPhase, editDuration, focusDuration, blurDuration }
}
