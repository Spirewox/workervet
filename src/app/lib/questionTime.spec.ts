import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatCountdown, questionTimeSeconds } from './questionTime.ts';

describe('candidate question timer', () => {
  it('uses the uploaded time_seconds instead of the 20 second fallback', () => {
    assert.equal(questionTimeSeconds({ time_seconds: 45 }), 45);
    assert.equal(questionTimeSeconds({ time_seconds: '90' }), 90);
  });

  it('falls back only when the uploaded duration is missing or invalid', () => {
    assert.equal(questionTimeSeconds(undefined), 20);
    assert.equal(questionTimeSeconds({ time_seconds: 0 }), 20);
    assert.equal(questionTimeSeconds({ timeLimit: 35 }), 35);
  });

  it('formats durations of a minute or more as mm:ss', () => {
    assert.equal(formatCountdown(45), '00:45');
    assert.equal(formatCountdown(90), '01:30');
    assert.equal(formatCountdown(0), '00:00');
  });
});
