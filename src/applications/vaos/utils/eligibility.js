import {
  DIRECT_SCHEDULE_TYPES,
  PRIMARY_CARE,
  DISABLED_LIMIT_VALUE,
  CANCELLED_APPOINTMENT_SET,
} from '../utils/constants';

import {
  checkPastVisits,
  getRequestLimits,
  getPacTeam,
  getClinics,
} from '../api';

export async function getEligibilityData(facilityId, typeOfCareId) {
  let eligibilityChecks = [
    checkPastVisits(facilityId, typeOfCareId, 'request'),
    getRequestLimits(facilityId, typeOfCareId),
  ];

  if (DIRECT_SCHEDULE_TYPES.has(typeOfCareId)) {
    eligibilityChecks = eligibilityChecks.concat([
      checkPastVisits(facilityId, typeOfCareId, 'direct'),
      getClinics(facilityId, typeOfCareId),
    ]);
  }

  if (typeOfCareId === PRIMARY_CARE) {
    eligibilityChecks.push(getPacTeam(facilityId));
  }

  const [requestPastVisit, requestLimits, ...directData] = await Promise.all(
    eligibilityChecks,
  );
  let eligibility = {
    requestPastVisit,
    requestLimits,
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

export function getEligibilityChecks(
  vaFacility,
  typeOfCareId,
  eligibilityData,
) {
  const eligibility = {
    directTypes: true,
    directPastVisit: true,
    directPastVisitValue: null,
    directPACT: true,
    directClinics: true,
    requestPastVisit: true,
    requestPastVisitValue: null,
    requestLimit: true,
    requestLimitValue: null,
  };

  if (!DIRECT_SCHEDULE_TYPES.has(typeOfCareId)) {
    eligibility.directTypes = false;
  } else {
    if (
      eligibilityData.directPastVisit.durationInMonths ===
        DISABLED_LIMIT_VALUE ||
      !eligibilityData.directPastVisit.hasVisitedInPastMonths
    ) {
      eligibility.directPastVisit = false;
      eligibility.directPastVisitValue =
        eligibilityData.directPastVisit.durationInMonths;
    }

    if (
      typeOfCareId === PRIMARY_CARE &&
      !eligibilityData.pacTeam.some(
        provider => provider.facilityId === vaFacility.substring(0, 3),
      )
    ) {
      eligibility.directPACT = false;
    }

    if (!eligibilityData.clinics.length) {
      eligibility.directClinics = false;
    }
  }

  if (
    eligibilityData.requestPastVisit.durationInMonths ===
      DISABLED_LIMIT_VALUE ||
    !eligibilityData.requestPastVisit.hasVisitedInPastMonths
  ) {
    eligibility.requestPastVisit = false;
    eligibility.requestPastVisitValue =
      eligibilityData.requestPastVisit.durationInMonths;
  }

  if (
    eligibilityData.requestLimits.requestLimit === DISABLED_LIMIT_VALUE ||
    eligibilityData.requestLimits.numberOfRequests >=
      eligibilityData.requestLimits.requestLimit
  ) {
    eligibility.requestLimit = false;
    eligibility.requestLimitValue = eligibilityData.requestLimits.requestLimit;
  }

  return eligibility;
}

export function isEligible(eligibilityChecks) {
  if (!eligibilityChecks) {
    return {
      direct: null,
      request: null,
    };
  }

  const {
    directPastVisit,
    directTypes,
    directClinics,
    directPACT,
    requestLimit,
    requestPastVisit,
  } = eligibilityChecks;

  return {
    direct: directTypes && directPastVisit && directPACT && directClinics,
    request: requestLimit && requestPastVisit,
  };
}

export function getEligibleFacilities(facilities) {
  return facilities.filter(
    facility => facility.requestSupported || facility.directSchedulingSupported,
  );
}

export function hasEligibleClinics(facilityId, pastAppointments, clinics) {
  const pastClinicIds = new Set(
    pastAppointments
      .filter(
        appt =>
          appt.facilityId === facilityId &&
          appt.clinicId &&
          !CANCELLED_APPOINTMENT_SET.has(
            appt.vdsAppointments?.[0]?.currentStatus || 'FUTURE',
          ),
      )
      .map(appt => appt.clinicId),
  );

  return clinics.some(clinic => pastClinicIds.has(clinic.clinicId));
}
