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
    'health-express-care-reason': undefined,
    'error-key': undefined,
    appointmentType: undefined,
    facilityType: undefined,
    'vaos-express-care-number-of-cards': undefined,
  });
}
