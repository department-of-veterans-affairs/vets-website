import recordEvent from 'platform/monitoring/record-event';

export function recordVaosError(errorKey) {
  recordEvent({
    event: 'vaos-error',
    'error-key': errorKey,
  });
}
