import { PRIMARY_CARE, DISABLED_LIMIT_VALUE } from '../utils/constants';

import {
  checkPastVisits,
  getRequestLimits,
  getPacTeam,
  getAvailableClinics,
} from '../api';

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

    if (typeOfCareId === PRIMARY_CARE) {
      eligibilityChecks.push(getPacTeam(systemId));
    }
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
    const [directPastVisit, clinics, ...pacTeam] = directData;
    eligibility = {
      ...eligibility,
      directPastVisit,
      clinics,
    };

    if (pacTeam.length) {
      eligibility = {
        ...eligibility,
        pacTeam: pacTeam[0],
      };
    }
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

function hasPACTeamIfPrimaryCare(eligibilityData, typeOfCareId, vaSystem) {
  return (
    typeOfCareId !== PRIMARY_CARE ||
    eligibilityData.pacTeam.some(provider => provider.facilityId === vaSystem)
  );
}

function isUnderRequestLimit(eligibilityData) {
  return (
    eligibilityData.requestLimits.requestLimit === DISABLED_LIMIT_VALUE ||
    eligibilityData.requestLimits.numberOfRequests <
      eligibilityData.requestLimits.requestLimit
  );
}

export function getEligibilityChecks(vaSystem, typeOfCareId, eligibilityData) {
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
    directPACT:
      directSchedulingEnabled &&
      hasPACTeamIfPrimaryCare(eligibilityData, typeOfCareId, vaSystem),
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
    directPACT,
    requestSupported,
    requestLimit,
    requestPastVisit,
  } = eligibilityChecks;

  return {
    direct: directSupported && directPastVisit && directPACT && directClinics,
    request: requestSupported && requestLimit && requestPastVisit,
  };
}

export function getEligibleFacilities(facilities) {
  return facilities.filter(
    facility => facility.requestSupported || facility.directSchedulingSupported,
  );
}
