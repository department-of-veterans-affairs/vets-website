import { DISABLED_LIMIT_VALUE } from '../utils/constants';

import { checkPastVisits, getRequestLimits, getAvailableClinics } from '../api';

export async function getEligibilityData(
  facility,
  typeOfCareId,
  systemId,
  isDirectScheduleEnabled,
) {
  const facilityId = facility.institutionCode;
  const eligibilityChecks = [
    checkPastVisits(systemId, facilityId, typeOfCareId, 'request'),
    getRequestLimits(facilityId, typeOfCareId),
  ];

  if (facility.directSchedulingSupported && isDirectScheduleEnabled) {
    eligibilityChecks.push(
      checkPastVisits(systemId, facilityId, typeOfCareId, 'direct'),
    );
    eligibilityChecks.push(
      getAvailableClinics(facilityId, typeOfCareId, systemId),
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

export function getEligibilityChecks(systemId, typeOfCareId, eligibilityData) {
  // If we're missing this property, it means no DS checks were made
  // because it's disabled
  const directSchedulingEnabled =
    typeof eligibilityData.directPastVisit !== 'undefined';

  return {
    directSupported: eligibilityData.directSupported,
    directPastVisit:
      directSchedulingEnabled && hasVisitedInPastMonthsDirect(eligibilityData),
    directPastVisitValue:
      directSchedulingEnabled &&
      eligibilityData.directPastVisit.durationInMonths,
    directClinics: directSchedulingEnabled && !!eligibilityData.clinics.length,
    requestSupported: eligibilityData.requestSupported,
    requestPastVisit: hasVisitedInPastMonthsRequest(eligibilityData),
    requestPastVisitValue: eligibilityData.requestPastVisit.durationInMonths,
    requestLimit: isUnderRequestLimit(eligibilityData),
    requestLimitValue: eligibilityData.requestLimits.requestLimit,
  };
}

export function isEligible(eligibilityChecks) {
  if (!eligibilityChecks) {
    return {
      direct: null,
      request: null,
    };
  }

  const {
    directSupported,
    directPastVisit,
    directClinics,
    requestSupported,
    requestLimit,
    requestPastVisit,
  } = eligibilityChecks;

  return {
    direct: directSupported && directPastVisit && directClinics,
    request: requestSupported && requestLimit && requestPastVisit,
  };
}

export function getEligibleFacilities(facilities) {
  return facilities.filter(
    facility => facility.requestSupported || facility.directSchedulingSupported,
  );
}
