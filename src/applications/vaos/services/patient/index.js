/**
 * Functions related to patient specific information
 * @module services/Patient
 */
import environment from 'platform/utilities/environment';
import {
  checkPastVisits,
  getLongTermAppointmentHistory,
  getRequestLimits,
} from '../var';
import { recordEligibilityFailure, recordVaosError } from '../../utils/events';
import { captureError } from '../../utils/error';
import { ELIGIBILITY_REASONS } from '../../utils/constants';
import { promiseAllFromObject } from '../../utils/data';
import { getAvailableHealthcareServices } from '../healthcare-service';

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
    return new Error('Eligibility error');
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

  if (results.directPastVisit instanceof Error) {
    output.direct = new Error('Direct scheduling eligibility check error');
  } else if (type !== 'request') {
    output.direct = {
      hasRequiredAppointmentHistory: hasVisitedInPastMonths(
        results.directPastVisit,
      ),
    };
  }

  if (
    results.requestPastVisit instanceof Error ||
    results.requestLimit instanceof Error
  ) {
    output.request = new Error('Request eligibility check error');
  } else if (type !== 'direct') {
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

function locationSupportsDirectScheduling(location, typeOfCare) {
  return (
    // this check is included due to old two step facilities page
    location.legacyVAR.directSchedulingSupported ||
    location.legacyVAR.settings?.[typeOfCare.id]?.direct.enabled
  );
}

function locationSupportsRequests(location, typeOfCare) {
  return (
    // this check is included due to old two step facilities page
    location.legacyVAR.requestSupported ||
    location.legacyVAR.settings?.[typeOfCare.id]?.request.enabled
  );
}

function hasMatchingClinics(clinics, pastAppointments) {
  return clinics?.some(
    clinic =>
      !!pastAppointments.find(appt => {
        return (
          clinic.identifier[0].value ===
          `urn:va:healthcareservice:${appt.facilityId}:${appt.sta6aid}:${
            appt.clinicId
          }`
        );
      }),
  );
}

/*
 * This function logs information about eligibility to the console, to help with
 * testing in non-production environments
 */
/* istanbul ignore next */
function logEligibilityExplanation(
  location,
  typeOfCare,
  { request, direct, directReasons, requestReasons },
) {
  if (environment.isProduction() || navigator.userAgent === 'node.js') {
    return;
  }
  const reasonMapping = {
    [ELIGIBILITY_REASONS.notEnabled]:
      'The FE has disabled direct scheduling via feature toggle',
    [ELIGIBILITY_REASONS.notSupported]:
      'Disabled in VATS for this location and type of care',
    [ELIGIBILITY_REASONS.noRecentVisit]:
      'The var-resources visited in past months service indicated that there has not been a recent visit',
    [ELIGIBILITY_REASONS.overRequestLimit]:
      'The var-resources request limit service indicated that there are too many outstanding requests',
    [ELIGIBILITY_REASONS.noClinics]:
      'The var-resources clinics service did not return any clinics',
    [ELIGIBILITY_REASONS.noMatchingClinics]:
      'The FE could not find any of the clinics returned by var-resources in the past 24 months of appointments',
    [ELIGIBILITY_REASONS.error]:
      'There were errors trying to determine eligibility',
  };

  try {
    /* eslint-disable no-console */
    console.log('----');
    console.log(
      `%cEligibility checks for location ${location.id} and type of care ${
        typeOfCare.id
      }`,
      'font-weight: bold',
    );

    if (!direct) {
      console.log('%cUser not eligible for direct scheduling:', 'color: red');
      directReasons.map(reason => reasonMapping[reason]).forEach(message => {
        console.log(`  ${message}`);
      });
    } else {
      console.log('%cUser passed checks for direct scheduling', 'color: green');
    }

    if (!request) {
      console.log('%cUser not eligible for requests:', 'color: red');
      requestReasons.map(reason => reasonMapping[reason]).forEach(message => {
        console.log(`  ${message}`);
      });
    } else {
      console.log('%cUser passed checks for requests', 'color: green');
    }
  } catch (e) {
    captureError(e);
  }
  /* eslint-enable no-console */
}

export async function fetchFlowEligibilityAndClinics({
  typeOfCare,
  location,
  directSchedulingEnabled,
}) {
  const directSchedulingAvailable =
    locationSupportsDirectScheduling(location, typeOfCare) &&
    directSchedulingEnabled;

  const apiCalls = {
    patientEligibility: fetchPatientEligibility({
      typeOfCare,
      location,
      type: !directSchedulingAvailable ? 'request' : null,
    }),
  };

  // We don't want to make unnecessary api calls if DS is turned off
  if (directSchedulingAvailable) {
    apiCalls.clinics = getAvailableHealthcareServices({
      facilityId: location.id,
      typeOfCareId: typeOfCare.id,
      systemId: location.vistaId,
    }).catch(createErrorHandler('direct-available-clinics-error'));
    apiCalls.pastAppointments = getLongTermAppointmentHistory().catch(
      createErrorHandler('direct-no-matching-past-clinics-error'),
    );
  }

  // This waits for all the api calls we're running in parallel to finish
  // It does not have a try/catch because all errors in the calls are caught
  // and resolved, so that we can still provide users a path forward if enough
  // checks succeeded
  const results = await promiseAllFromObject(apiCalls);

  const eligibility = {
    direct: directSchedulingEnabled,
    directReasons: !directSchedulingEnabled
      ? [ELIGIBILITY_REASONS.notEnabled]
      : [],
    request: true,
    requestReasons: [],
  };

  // This is going through all of our request related checks and setting
  // to false if we fail any of them. Order is important here, because the UI
  // will only be able to show one reason, the first one
  if (!locationSupportsRequests(location, typeOfCare)) {
    eligibility.request = false;
    eligibility.requestReasons.push(ELIGIBILITY_REASONS.notSupported);
  } else if (results.patientEligibility.request instanceof Error) {
    eligibility.request = false;
    eligibility.requestReasons.push(ELIGIBILITY_REASONS.error);
  } else {
    if (!results.patientEligibility.request.hasRequiredAppointmentHistory) {
      eligibility.request = false;
      eligibility.requestReasons.push(ELIGIBILITY_REASONS.noRecentVisit);
      recordEligibilityFailure('request-past-visits');
    }

    if (
      !results.patientEligibility.request.isEligibleForNewAppointmentRequest
    ) {
      eligibility.request = false;
      eligibility.requestReasons.push(ELIGIBILITY_REASONS.overRequestLimit);
      recordEligibilityFailure('request-exceeded-outstanding-requests');
    }
  }

  // Similar to above, but for direct scheduling
  if (!locationSupportsDirectScheduling(location, typeOfCare)) {
    eligibility.direct = false;
    eligibility.directReasons.push(ELIGIBILITY_REASONS.notSupported);
  } else if (
    results.patientEligibility.direct instanceof Error ||
    results.clinics instanceof Error ||
    results.pastAppointments instanceof Error
  ) {
    eligibility.direct = false;
    eligibility.directReasons.push(ELIGIBILITY_REASONS.error);
  } else {
    if (!results.patientEligibility.direct.hasRequiredAppointmentHistory) {
      eligibility.direct = false;
      eligibility.directReasons.push(ELIGIBILITY_REASONS.noRecentVisit);
      recordEligibilityFailure('direct-check-past-visits');
    }

    if (!results.clinics.length) {
      eligibility.direct = false;
      eligibility.directReasons.push(ELIGIBILITY_REASONS.noClinics);
      recordEligibilityFailure('direct-available-clinics');
    }

    if (!hasMatchingClinics(results.clinics, results.pastAppointments)) {
      eligibility.direct = false;
      eligibility.directReasons.push(ELIGIBILITY_REASONS.noMatchingClinics);
      recordEligibilityFailure('direct-no-matching-past-clinics');
    }
  }

  logEligibilityExplanation(location, typeOfCare, eligibility);

  return {
    eligibility,
    // it feels sort of hackish to return these along with our main
    // eligibility calcs, but we want to cache them for future use
    clinics: results.clinics,
    pastAppointments: results.pastAppointments,
  };
}
