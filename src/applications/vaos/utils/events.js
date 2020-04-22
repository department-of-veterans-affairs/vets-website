import recordEvent from 'platform/monitoring/record-event';

export function recordVaosError(errorKey) {
  recordEvent({
    event: 'vaos-error',
    'error-key': errorKey,
  });
}

export function recordEligibilityFailure(errorKey) {
  recordEvent({
    event: `vaos-eligibility${errorKey ? `-${errorKey}` : ''}-failed`,
  });
}

export function resetDataLayer() {
  recordEvent({
    flow: undefined,
    'health-TypeOfCare': undefined,
    'health-ReasonForAppointment': undefined,
    'error-key': undefined,
    appointmentType: undefined,
    facilityType: undefined,
  });
}
