import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';
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

export const NULL_STATE_FIELD = {
  TYPE_OF_CARE: 'type-of-care',
  PROVIDER: 'provider',
  CLINIC_PHONE: 'clinic-phone',
  FACILITY_ID: 'facility-id',
  FACILITY_DETAILS: 'facility-details',
  FACILITY_PHONE: 'facility-phone',
};

/**
 * Records events for appointment details null states
 *
 * @export
 * @param {Object} attributes  This is the dictionary containing the attributes
 *   of the appointment to be recorded as part of the missing event.
 * @param {Object} nullStates This is the dictionary containing the null state
 *   details to be logged. The keys are the keys of NULL_STATE_TYPE and the
 *   values are booleans indicating whether that field is missing in the
 *   appointment details (i.e. true for missing, false for not missing). If an
 *   information type is not applicable for the appointment type (e.g. Provider
 *   for Claim Exam) do not include an entry for the field in the dictionary.
 */
export function recordAppointmentDetailsNullStates(attributes, nullStates) {
  const missingFields = [];
  const presentFields = [];

  // Examine each field type and determine which events should be logged
  Object.values(NULL_STATE_FIELD).forEach(key => {
    // Only log events if a field exists in the input dictionary, otherwise ignore it
    if (key in nullStates) {
      if (nullStates[key]) {
        // If the field is missing, record the missing event
        missingFields.push(key);
      } else {
        // If the field is present, record the expected event
        presentFields.push(key);
      }
    }
  });

  recordEvent({
    event: `${GA_PREFIX}-null-states`,
    ...attributes,
    'fields-load-success': presentFields.join(','),
    'fields-load-fail': missingFields.join(','),
  });
}

export function captureMissingModalityLogs(appointment) {
  Sentry.withScope(scope => {
    try {
      scope.setExtra(
        'metadata',
        JSON.stringify({
          // Raw API fields
          start: appointment.vaos.apiData.start,
          created: appointment.vaos.apiData.created,
          status: appointment.vaos.apiData.status,
          past: appointment.vaos.apiData.past,
          pending: appointment.vaos.apiData.pending,
          future: appointment.vaos.apiData.future,
          serviceType: appointment.vaos.apiData.serviceType,
          serviceCategory: appointment.vaos.apiData.serviceCategory,
          kind: appointment.vaos.apiData.kind,
          vvsKind: appointment.vaos.apiData.telehealth?.vvsKind,
          hasAtlas: !!appointment.vaos.apiData.telehealth?.atlas,
          vvsVideoAppt: appointment.vaos.apiData.extension?.vvsVistaVideoAppt,
          apiModality: appointment.vaos.apiData.modality,
          hasProviderName: !!appointment.vaos.apiData.providerName,
          providerServiceId: appointment.vaos.apiData.providerServiceId,
          hasReferral: !!appointment.vaos.apiData.referral,
          referralId: appointment.vaos.apiData.referralId,
          // Derived fields
          type: appointment.type,
          modality: appointment.modality,
          isCerner: appointment.vaos.isCerner,
        }),
      );
    } catch (error) {
      scope.setExtra('metadataError', error);
    }

    Sentry.captureMessage(
      `VAOS appointment with missing modality: ${appointment.modality}.`,
    );
  });
}
