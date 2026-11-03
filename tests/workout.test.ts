import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateWorkout, formatDuration } from '../src/domain/workout.ts'

test('a new workout is empty with zero duration', () => {
  assert.deepEqual(calculateWorkout(null), { status: 'empty', phases: [], totalSeconds: 0 })
  assert.equal(formatDuration(0), '0:00')
})

for (const [minutes, seconds, total, display] of [
  ['2', '30', 150, '2:30'], ['0', '30', 30, '0:30'], ['0', '1', 1, '0:01'],
  ['1', '0', 60, '1:00'], ['0002', '05', 125, '2:05'],
  ['150119987579016', '31', Number.MAX_SAFE_INTEGER, '150119987579016:31'],
] as const) {
  test(`valid duration ${minutes}:${seconds} stays consistent with the preview and total`, () => {
    assert.deepEqual(calculateWorkout({ minutes, seconds }), {
      status: 'valid', phases: [{ type: 'run', durationSeconds: total }], totalSeconds: total,
    })
    assert.equal(formatDuration(total), display)
  })
}

for (const field of ['minutes', 'seconds'] as const) {
  for (const value of ['', '-1', '1.5', 'abc', 'Infinity', 'NaN', '1e2', ' 2', '2 ', '9007199254740992']) {
    test(`rejects ${JSON.stringify(value)} in ${field} and preserves the input`, () => {
      const input = { minutes: '2', seconds: '30', [field]: value }
      const snapshot = { ...input }
      const result = calculateWorkout(input)
      assert.equal(result.status, 'incomplete')
      if (result.status === 'incomplete') assert.ok(result.errors[field])
      assert.ok(!('totalSeconds' in result))
      assert.deepEqual(input, snapshot)
    })
  }
}

for (const [input, affectedFields] of [
  [{ minutes: '0', seconds: '0' }, ['minutes', 'seconds']],
  [{ minutes: '2', seconds: '60' }, ['seconds']],
  [{ minutes: '150119987579016', seconds: '32' }, ['minutes']],
  [{ minutes: '9007199254740991', seconds: '0' }, ['minutes']],
] as const) {
  test(`rejects zero, seconds overflow, or arithmetic overflow: ${JSON.stringify(input)}`, () => {
    const result = calculateWorkout(input)
    assert.equal(result.status, 'incomplete')
    if (result.status === 'incomplete') {
      for (const field of affectedFields) assert.ok(result.errors[field])
    }
    assert.ok(!('phases' in result))
    assert.ok(!('totalSeconds' in result))
  })
}

test('resolves errors when invalid input becomes valid', () => {
  assert.equal(calculateWorkout({ minutes: '', seconds: '60' }).status, 'incomplete')
  const result = calculateWorkout({ minutes: '0', seconds: '30' })
  assert.equal(result.status, 'valid')
  assert.ok(!('errors' in result))
})
