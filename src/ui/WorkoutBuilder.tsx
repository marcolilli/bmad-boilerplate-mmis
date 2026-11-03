import { useEffect, useRef } from 'react'
import { useWorkoutDraft } from '../application/useWorkoutDraft'
import { formatDuration } from '../domain/workout'

export function WorkoutBuilder() {
  const { duration, result, addRunPhase, editDuration } = useWorkoutDraft()
  const minutesRef = useRef<HTMLInputElement>(null)
  const hasPhase = duration !== null
  useEffect(() => {
    if (hasPhase) minutesRef.current?.focus()
  }, [hasPhase])
  const errors = result.status === 'incomplete' ? result.errors : {}

  return (
    <main className="workout-builder">
      <header className="page-header">
        <p className="eyebrow">RunReady</p>
        <h1>Make time for your next run.</h1>
        <p>Start with one running phase. Set its duration and see your plan take shape.</p>
      </header>
      <div className="workspace">
        <section className="panel" aria-labelledby="editor-title">
          <p className="eyebrow">01 · Build</p>
          <h2 id="editor-title">Your running phase</h2>
          {duration === null ? (
            <div className="empty-editor">
              <p>Your plan is empty. Add a run to get started.</p>
              <button type="button" onClick={addRunPhase}>Add run phase <span aria-hidden="true">＋</span></button>
            </div>
          ) : (
            <fieldset>
              <legend>Run duration</legend>
              <p id="duration-help">Use whole numbers. Seconds must be between 0 and 59.</p>
              <div className="duration-fields">
                {(['minutes', 'seconds'] as const).map(field => (
                  <div className="field" key={field}>
                    <label htmlFor={field}>{field === 'minutes' ? 'Minutes' : 'Seconds'}</label>
                    <input
                      id={field}
                      ref={field === 'minutes' ? minutesRef : undefined}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      spellCheck={false}
                      value={duration[field]}
                      aria-invalid={Boolean(errors[field])}
                      aria-describedby={`duration-help${errors[field] ? ` ${field}-error` : ''}`}
                      onChange={event => editDuration(field, event.target.value)}
                    />
                    {errors[field] && <p className="field-error" id={`${field}-error`}>{errors[field]}</p>}
                  </div>
                ))}
              </div>
              <p className="editor-note">This preview supports one running phase.</p>
            </fieldset>
          )}
        </section>
        <section className="panel preview" aria-labelledby="preview-title">
          <p className="eyebrow">02 · Preview</p>
          <h2 id="preview-title">Your plan at a glance</h2>
          <div aria-live="polite" aria-atomic="true">
            {result.status === 'empty' ? <p className="empty-preview">No phases yet.</p> : (
              <ol className="phase-list">
                <li><span><span className="phase-number" aria-hidden="true">1</span> Run</span>
                  <strong>{result.status === 'valid' ? formatDuration(result.phases[0].durationSeconds) : 'Incomplete'}</strong>
                </li>
              </ol>
            )}
            <div className="total"><span>Total duration</span><strong>{result.status === 'incomplete' ? 'Incomplete' : formatDuration(result.totalSeconds)}</strong></div>
            {result.status === 'incomplete' && <p className="preview-note">Complete the duration fields to calculate your plan.</p>}
          </div>
        </section>
      </div>
      <footer>Time shown as minutes:seconds. This draft stays here until you reload or close the page.</footer>
    </main>
  )
}
