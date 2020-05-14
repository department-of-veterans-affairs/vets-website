import recordEvent from 'platform/monitoring/record-event';

export function recordVaosError(errorKey) {
  recordEvent({
    event: 'vaos-error',
    'error-key': errorKey,
  });
}

export function recordEligibilityFailure(
  errorKey,
  typeOfCare = null,
  facilityId = null,
) {
  recordEvent({
    event: `vaos-eligibility${errorKey ? `-${errorKey}` : ''}-failed`,
    'health-TypeOfCare': typeOfCare,
    'health-FacilityID': facilityId,
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
