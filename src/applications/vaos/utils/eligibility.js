import { DISABLED_LIMIT_VALUE } from '../utils/constants';
import { captureError } from '../utils/error';

import { checkPastVisits, getRequestLimits, getAvailableClinics } from '../api';

function handleDirectError(data) {
  captureError(data);

  return { directFailed: true };
}

function handleRequestError(data) {
  captureError(data);

  return { requestFailed: true };
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
  facility,
  typeOfCareId,
  systemId,
  isDirectScheduleEnabled,
) {
  const facilityId = facility.institutionCode;
  const eligibilityChecks = [
    checkPastVisits(systemId, facilityId, typeOfCareId, 'request').catch(
      handleRequestError,
    ),
    getRequestLimits(facilityId, typeOfCareId).catch(handleRequestError),
  ];

  if (facility.directSchedulingSupported && isDirectScheduleEnabled) {
    eligibilityChecks.push(
      checkPastVisits(systemId, facilityId, typeOfCareId, 'direct').catch(
        handleDirectError,
      ),
    );
    eligibilityChecks.push(
      getAvailableClinics(facilityId, typeOfCareId, systemId).catch(
        handleDirectError,
      ),
    );
  }

  const [requestPastVisit, requestLimits, ...directData] = await Promise.all(
    eligibilityChecks,
  );
  let eligibility = {
    requestPastVisit,
    requestLimits,
    directSupported: facility.directSchedulingSupported,
    requestSupported: facility.requestSupported,
  };

  if (directData?.length) {
    const [directPastVisit, clinics] = directData;
    eligibility = {
      ...eligibility,
      directPastVisit,
      clinics,
    };
  }

  return eligibility;
}

function hasVisitedInPastMonthsDirect(eligibilityData) {
  return (
    eligibilityData.directPastVisit.durationInMonths === DISABLED_LIMIT_VALUE ||
    eligibilityData.directPastVisit.hasVisitedInPastMonths
  );
}

function hasVisitedInPastMonthsRequest(eligibilityData) {
  return (
    eligibilityData.requestPastVisit.durationInMonths ===
      DISABLED_LIMIT_VALUE ||
    eligibilityData.requestPastVisit.hasVisitedInPastMonths
  );
}

function isUnderRequestLimit(eligibilityData) {
  return (
    eligibilityData.requestLimits.requestLimit === DISABLED_LIMIT_VALUE ||
    eligibilityData.requestLimits.numberOfRequests <
      eligibilityData.requestLimits.requestLimit
  );
}

/*
 * This function takes the data from the eligibility related services and 
 * decides if each check we need to make passes or fails. It also checks for
 * errors in either of the two "blocks" of checks (requests or direct). If 
 * one block of checks is successful, we can still let a user continue on that,
 * even if another path is blocked.
*/
export function getEligibilityChecks(systemId, typeOfCareId, eligibilityData) {
  // If we're missing this property, it means no DS checks were made
  // because it's disabled
  const directSchedulingEnabled =
    typeof eligibilityData.directPastVisit !== 'undefined';

  let eligibilityChecks = {
    requestSupported: eligibilityData.requestSupported,
    requestFailed: Object.values(eligibilityData).some(
      result => result.requestFailed,
    ),
    directSupported: eligibilityData.directSupported,
    directFailed: Object.values(eligibilityData).some(
      result => result.directFailed,
    ),
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
        directSchedulingEnabled && !!eligibilityData.clinics.length,
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

export function getEligibleFacilities(facilities) {
  return facilities.filter(
    facility => facility.requestSupported || facility.directSchedulingSupported,
  );
}
