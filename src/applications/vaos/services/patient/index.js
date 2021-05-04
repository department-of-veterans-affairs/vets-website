/**
 * Functions related to patient specific information
 * @module services/Patient
 */
import { checkPastVisits, getRequestLimits } from '../var';
import { recordVaosError } from '../../utils/events';
import { captureError } from '../../utils/error';
import { promiseAllFromObject } from '../../utils/data';

/**
 * @typedef PatientEligibilityForType
 * @global
 *
 * @property {boolean} hasRequiredAppointmentHistory Has had appointment in the past that meets VATS requirements
 *   - Mapped from past visits check
 * @property {?boolean} isEligibleForNewAppointmentRequest Is under the request limit
 *   - Mapped from request limits check
 */

/**
 * @typedef PatientEligibility
 * @global
 *
 * @property {?PatientEligibilityForType} direct Patient eligibility for direct scheduling
 * @property {?PatientEligibilityForType} request Patient eligibility for requests
 */

function createErrorHandler(errorKey) {
  return data => {
    captureError(data, true);
    recordVaosError(`eligibility-${errorKey}`);
    return 'error';
  };
}

const PRIMARY_CARE = '323';

const DISABLED_LIMIT_VALUE = 0;

function hasVisitedInPastMonths(pastVisit) {
  if (!pastVisit) {
    return true;
  }

  return (
    pastVisit.durationInMonths === DISABLED_LIMIT_VALUE ||
    pastVisit.hasVisitedInPastMonths
  );
}

function isUnderRequestLimit(data) {
  return (
    data?.requestLimit === DISABLED_LIMIT_VALUE ||
    data?.numberOfRequests < data?.requestLimit
  );
}

async function fetchPatientEligibilityFromVAR({
  typeOfCare,
  location,
  type = null,
}) {
  const checks = {};
  if (type !== 'direct') {
    checks.requestLimit = getRequestLimits(location.id, typeOfCare.id)
      .then(resp => resp[0])
      .catch(createErrorHandler('request-exceeded-outstanding-requests-error'));
  }

  if (type !== 'direct' && typeOfCare.id !== PRIMARY_CARE) {
    checks.requestPastVisit = checkPastVisits(
      location.vistaId,
      location.id,
      typeOfCare.id,
      'request',
    ).catch(createErrorHandler('request-check-past-visits-error'));
  }

  if (type !== 'request' && typeOfCare.id !== PRIMARY_CARE) {
    checks.directPastVisit = checkPastVisits(
      location.vistaId,
      location.id,
      typeOfCare.id,
      'direct',
    ).catch(createErrorHandler('direct-check-past-visits-error'));
  }

  const results = await promiseAllFromObject(checks);
  const output = { direct: null, request: null };

  if (type !== 'request' && results.directPastVisit !== 'error') {
    output.direct = {
      hasRequiredAppointmentHistory: hasVisitedInPastMonths(
        results.directPastVisit,
      ),
    };
  }

  if (
    type !== 'direct' &&
    results.requestPastVisit !== 'error' &&
    results.requestLimit !== 'error'
  ) {
    output.request = {
      hasRequiredAppointmentHistory: hasVisitedInPastMonths(
        results.requestPastVisit,
      ),
      isEligibleForNewAppointmentRequest: isUnderRequestLimit(
        results.requestLimit,
      ),
    };
  }

  return output;
}

/**
 * Returns patient based eligibility checks for specified request or direct types
 *
 * @export
 * @param {Object} params
 * @param {Object} typeOfCare Type of care object,
 * @param {Location} location Location of where patient should have eligibility checked,
 * @param {'direct'|'request'|null} [type=null] The type to check eligibility for. By default,
 *   will check both
 * }
 * @returns {PatientEligibility} Patient eligibility data
 */
export async function fetchPatientEligibility({
  typeOfCare,
  location,
  type = null,
}) {
  return fetchPatientEligibilityFromVAR({ typeOfCare, location, type });
}
