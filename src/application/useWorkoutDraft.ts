import { useState } from 'react'
import { calculateWorkout, type DurationInput } from '../domain/workout'

export function useWorkoutDraft() {
  const [duration, setDuration] = useState<DurationInput | null>(null)
  const result = calculateWorkout(duration)

  function addRunPhase() {
    setDuration(current => current ?? { minutes: '', seconds: '' })
  }

  function editDuration(field: keyof DurationInput, value: string) {
    setDuration(current => current === null ? null : { ...current, [field]: value })
  }

  return { duration, result, addRunPhase, editDuration }
}
