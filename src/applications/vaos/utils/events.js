import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from './constants';

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
    'facility-id': undefined,
    'tab-text': undefined,
    alertBoxHeading: undefined,
    'vaos-item-type': undefined,
    'vaos-number-of-items': undefined,
    'vaos-number-of-preferred-providers': undefined,
  });
}

export function recordItemsRetrieved(type, count) {
  recordEvent({
    event: `${GA_PREFIX}-number-of-items-retrieved`,
    [`${GA_PREFIX}-item-type`]: type,
    [`${GA_PREFIX}-number-of-items`]: count || 0,
  });
  resetDataLayer();
}
