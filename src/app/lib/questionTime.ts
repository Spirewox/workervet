export const DEFAULT_TIME_PER_QUESTION = 20;

function positiveSeconds(value: unknown): number | undefined {
  const numeric =
    typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof numeric === 'number' && Number.isFinite(numeric) && numeric > 0) {
    return Math.floor(numeric);
  }
  return undefined;
}

export function questionTimeSeconds(
  question?: { time_seconds?: unknown; timeLimit?: unknown } | null,
): number {
  return (
    positiveSeconds(question?.time_seconds) ??
    positiveSeconds(question?.timeLimit) ??
    DEFAULT_TIME_PER_QUESTION
  );
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
