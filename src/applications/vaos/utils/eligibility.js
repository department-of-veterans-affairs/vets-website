import { DISABLED_LIMIT_VALUE } from '../utils/constants';
import { captureError } from '../utils/error';

import {
  checkPastVisits,
  getRequestLimits,
  getAvailableClinics,
  getLongTermAppointmentHistory,
} from '../api';
import { getFacilityIdFromLocation } from '../services/location';

import { recordVaosError, recordEligibilityFailure } from './events';

function createErrorHandler(directOrRequest, errorKey) {
  return data => {
    captureError(data, true);
    recordVaosError(`eligibility-${errorKey}`);
    return { [`${directOrRequest}Failed`]: true };
  };
}

/*
 * This makes all the service calls needed to determine if a Veteran
 * is eligible for direct scheduling or requests. The getEligibilityChecks
 * function below takes the raw data from here and determines if the 
 * check passes or fails.
 *
 * Any errors in the promises for each service are caught so that
 * Promise.all doesn't abort and we can figure out if we can see if
 * we made it through either all the request related checks or all the 
 * direct related requests
 */
export async function getEligibilityData(
  location,
  typeOfCareId,
  systemId,
  isDirectScheduleEnabled,
) {
  const facilityId = getFacilityIdFromLocation(location);
  const eligibilityChecks = [
    checkPastVisits(systemId, facilityId, typeOfCareId, 'request').catch(
      createErrorHandler('request', 'request-check-past-visits-error'),
    ),
    getRequestLimits(facilityId, typeOfCareId).catch(
      createErrorHandler(
        'request',
        'request-exceeded-outstanding-requests-error',
      ),
    ),
  ];

  if (location.legacyVAR.directSchedulingSupported && isDirectScheduleEnabled) {
    eligibilityChecks.push(
      checkPastVisits(systemId, facilityId, typeOfCareId, 'direct').catch(
        createErrorHandler('direct', 'direct-check-past-visits-error'),
      ),
    );
    eligibilityChecks.push(
      getAvailableClinics(facilityId, typeOfCareId, systemId).catch(
        createErrorHandler('direct', 'direct-available-clinics-error'),
      ),
    );
    eligibilityChecks.push(
      getLongTermAppointmentHistory().catch(
        createErrorHandler('direct', 'direct-no-matching-past-clinics-error'),
      ),
    );
  }

  const [requestPastVisit, requestLimits, ...directData] = await Promise.all(
    eligibilityChecks,
  );
  let eligibility = {
    requestPastVisit,
    requestLimits,
    directSupported: location.legacyVAR.directSchedulingSupported,
    directEnabled: isDirectScheduleEnabled,
    requestSupported: location.legacyVAR.requestSupported,
  };

  if (directData?.length) {
    const [directPastVisit, clinics, pastAppointments] = directData;

    const hasMatchingClinics = clinics?.length
      ? clinics.some(
          clinic =>
            !!pastAppointments.find(
              appt =>
                clinic.siteCode === appt.facilityId &&
                clinic.clinicId === appt.clinicId,
            ),
        )
      : false;

    if (!hasMatchingClinics) {
      recordEligibilityFailure('direct-no-matching-past-clinics');
    }

    eligibility = {
      ...eligibility,
      directPastVisit,
      clinics,
      hasMatchingClinics,
      pastAppointments,
    };
  }

  return eligibility;
}

function hasVisitedInPastMonthsDirect(eligibilityData) {
  return (
    eligibilityData.directPastVisit?.durationInMonths ===
      DISABLED_LIMIT_VALUE ||
    eligibilityData.directPastVisit?.hasVisitedInPastMonths
  );
}

function hasVisitedInPastMonthsRequest(eligibilityData) {
  return (
    eligibilityData.requestPastVisit?.durationInMonths ===
      DISABLED_LIMIT_VALUE ||
    eligibilityData.requestPastVisit?.hasVisitedInPastMonths
  );
}

function isUnderRequestLimit(eligibilityData) {
  return (
    eligibilityData.requestLimits?.requestLimit === DISABLED_LIMIT_VALUE ||
    eligibilityData.requestLimits?.numberOfRequests <
      eligibilityData.requestLimits?.requestLimit
  );
}

function isDirectSchedulingEnabled(eligibilityData) {
  return typeof eligibilityData.directPastVisit !== 'undefined';
}

function hasRequestFailed(eligibilityData) {
  return Object.values(eligibilityData).some(result => result?.requestFailed);
}

function hasDirectFailed(eligibilityData) {
  return Object.values(eligibilityData).some(result => result?.directFailed);
}

/*
 * This function takes the data from the eligibility related services and 
 * decides if each check we need to make passes or fails. It also checks for
 * errors in either of the two "blocks" of checks (requests or direct). If 
 * one block of checks is successful, we can still let a user continue on that,
 * even if another path is blocked.
*/
export function getEligibilityChecks(eligibilityData) {
  // If we're missing this property, it means no DS checks were made
  // because it's disabled
  const directSchedulingEnabled = isDirectSchedulingEnabled(eligibilityData);

  let eligibilityChecks = {
    requestSupported: eligibilityData.requestSupported,
    requestFailed: hasRequestFailed(eligibilityData),
    directSupported: eligibilityData.directSupported,
    directFailed: hasDirectFailed(eligibilityData),
  };

  if (!eligibilityChecks.requestFailed) {
    eligibilityChecks = {
      ...eligibilityChecks,
      requestPastVisit: hasVisitedInPastMonthsRequest(eligibilityData),
      requestPastVisitValue: eligibilityData.requestPastVisit.durationInMonths,
      requestLimit: isUnderRequestLimit(eligibilityData),
      requestLimitValue: eligibilityData.requestLimits.requestLimit,
    };
  }

  if (!eligibilityChecks.directFailed) {
    eligibilityChecks = {
      ...eligibilityChecks,
      directPastVisit:
        directSchedulingEnabled &&
        hasVisitedInPastMonthsDirect(eligibilityData),
      directPastVisitValue:
        directSchedulingEnabled &&
        eligibilityData.directPastVisit.durationInMonths,
      directClinics:
        directSchedulingEnabled &&
        !!eligibilityData.clinics.length &&
        eligibilityData.hasMatchingClinics,
    };
  }

  return eligibilityChecks;
}

export function isEligible(eligibilityChecks) {
  if (!eligibilityChecks) {
    return {
      direct: null,
      request: null,
    };
  }

  const {
    directFailed,
    directSupported,
    directPastVisit,
    directClinics,
    requestFailed,
    requestSupported,
    requestLimit,
    requestPastVisit,
  } = eligibilityChecks;

  return {
    direct:
      !directFailed && directSupported && directPastVisit && directClinics,
    request:
      !requestFailed && requestSupported && requestLimit && requestPastVisit,
  };
}

/**
 * Record Google Analytics events based on results of eligibility checks.
 * Error keys ending with 'error' represent a failure in fetching info for the check,
 * while keys ending with 'failure' signify that the user didn't meet the condition
 * of the check.
 */
export function recordEligibilityGAEvents(eligibilityData) {
  if (eligibilityData.requestSupported && !eligibilityData.requestFailed) {
    if (!isUnderRequestLimit(eligibilityData)) {
      recordEligibilityFailure('request-exceeded-outstanding-requests');
    }

    if (!hasVisitedInPastMonthsRequest(eligibilityData)) {
      recordEligibilityFailure('request-past-visits');
    }
  }

  if (!eligibilityData.requestSupported) {
    recordEligibilityFailure('request-supported');
  }

  if (
    eligibilityData.directEnabled &&
    eligibilityData.directSupported &&
    !eligibilityData.directFailed
  ) {
    if (!hasVisitedInPastMonthsDirect(eligibilityData)) {
      recordEligibilityFailure('direct-check-past-visits');
    }

    if (!eligibilityData.clinics?.length) {
      recordEligibilityFailure('direct-available-clinics');
    }
  }

  if (eligibilityData.directEnabled && !eligibilityData.directSupported) {
    recordEligibilityFailure('direct-supported');
  }
}
