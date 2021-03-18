import { captureError } from '../../../utils/error';
import {
  checkPastVisits,
  getRequestLimits,
  getLongTermAppointmentHistory,
} from '../../../services/var';
import {
  recordVaosError,
  recordEligibilityFailure,
} from '../../../utils/events';
import { getFacilityIdFromLocation } from '../../../services/location';
import { getAvailableHealthcareServices } from '../../../services/healthcare-service';
import environment from 'platform/utilities/environment';

const DISABLED_LIMIT_VALUE = 0;

const PRIMARY_CARE = '323';

function hasVisitedInPastMonthsDirect(eligibilityData) {
  if (!eligibilityData.directPastVisit) {
    return true;
  }

  return (
    eligibilityData.directPastVisit.durationInMonths === DISABLED_LIMIT_VALUE ||
    eligibilityData.directPastVisit.hasVisitedInPastMonths
  );
}

function hasVisitedInPastMonthsRequest(eligibilityData) {
  if (!eligibilityData.requestPastVisit) {
    return true;
  }

  return (
    eligibilityData.requestPastVisit.durationInMonths ===
      DISABLED_LIMIT_VALUE ||
    eligibilityData.requestPastVisit.hasVisitedInPastMonths
  );
}

function isUnderRequestLimit(eligibilityData) {
  return (
    eligibilityData.requestLimits?.requestLimit === DISABLED_LIMIT_VALUE ||
    eligibilityData.requestLimits?.numberOfRequests <
      eligibilityData.requestLimits?.requestLimit
  );
}

function hasRequestFailed(eligibilityData) {
  return Object.values(eligibilityData).some(result => result?.requestFailed);
}

function hasDirectFailed(eligibilityData) {
  return Object.values(eligibilityData).some(result => result?.directFailed);
}

function createErrorHandler(directOrRequest, errorKey) {
  return data => {
    captureError(data, true);
    recordVaosError(`eligibility-${errorKey}`);
    return { [`${directOrRequest}Failed`]: true };
  };
}

async function promiseAllFromObject(data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const results = await Promise.all(values);

  return keys.reduce(
    (resultsObj, key, i) => ({
      ...resultsObj,
      [key]: results[i],
    }),
    {},
  );
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
  useVSP,
) {
  const facilityId = getFacilityIdFromLocation(location);
  const directSchedulingAvailable =
    (useVSP ||
      location.legacyVAR.directSchedulingSupported === true ||
      location.legacyVAR.directSchedulingSupported[typeOfCareId]) &&
    isDirectScheduleEnabled;

  const eligibilityChecks = {
    requestLimits: getRequestLimits(facilityId, typeOfCareId).catch(
      createErrorHandler(
        'request',
        'request-exceeded-outstanding-requests-error',
      ),
    ),
  };

  if (typeOfCareId !== PRIMARY_CARE) {
    eligibilityChecks.requestPastVisit = checkPastVisits(
      systemId,
      facilityId,
      typeOfCareId,
      'request',
    ).catch(createErrorHandler('request', 'request-check-past-visits-error'));
  }

  if (directSchedulingAvailable) {
    if (typeOfCareId !== PRIMARY_CARE) {
      eligibilityChecks.directPastVisit = checkPastVisits(
        systemId,
        facilityId,
        typeOfCareId,
        'direct',
      ).catch(createErrorHandler('direct', 'direct-check-past-visits-error'));
    }

    eligibilityChecks.clinics = getAvailableHealthcareServices({
      facilityId,
      typeOfCareId,
      systemId,
      useVSP,
    }).catch(createErrorHandler('direct', 'direct-available-clinics-error'));
    eligibilityChecks.pastAppointments = getLongTermAppointmentHistory().catch(
      createErrorHandler('direct', 'direct-no-matching-past-clinics-error'),
    );
  }

  const results = await promiseAllFromObject(eligibilityChecks);

  const eligibility = {
    ...results,
    hasMatchingClinics: !!results.clinics?.length,
    directSupported:
      useVSP ||
      location.legacyVAR.directSchedulingSupported === true ||
      location.legacyVAR.directSchedulingSupported[typeOfCareId],
    directEnabled: isDirectScheduleEnabled,
    requestSupported:
      useVSP ||
      location.legacyVAR.requestSupported === true ||
      location.legacyVAR.requestSupported[typeOfCareId],
  };

  if (directSchedulingAvailable && eligibility.clinics?.length) {
    eligibility.hasMatchingClinics = eligibility.clinics.some(
      clinic =>
        !!eligibility.pastAppointments.find(appt => {
          return (
            clinic.identifier[0].value ===
            `urn:va:healthcareservice:${appt.facilityId}:${appt.sta6aid}:${
              appt.clinicId
            }`
          );
        }),
    );

    if (!eligibility.hasMatchingClinics) {
      recordEligibilityFailure('direct-no-matching-past-clinics');
    }
  }

  return eligibility;
}

/*
 * This function takes the data from the eligibility related services and 
 * decides if each check we need to make passes or fails. It also checks for
 * errors in either of the two "blocks" of checks (requests or direct). If 
 * one block of checks is successful, we can still let a user continue on that,
 * even if another path is blocked.
*/
export function getEligibilityChecks(eligibilityData) {
  let eligibilityChecks = {
    requestSupported: eligibilityData.requestSupported,
    requestFailed: hasRequestFailed(eligibilityData),
    directSupported: eligibilityData.directSupported,
    directFailed: hasDirectFailed(eligibilityData),
    directPastVisit: false,
    directPastVisitValue: null,
    directClinics: null,
  };

  if (!eligibilityChecks.requestFailed) {
    eligibilityChecks = {
      ...eligibilityChecks,
      requestPastVisit: hasVisitedInPastMonthsRequest(eligibilityData),
      requestPastVisitValue:
        eligibilityData.requestPastVisit?.durationInMonths || null,
      requestLimit: isUnderRequestLimit(eligibilityData),
      requestLimitValue: eligibilityData.requestLimits.requestLimit,
    };
  }

  if (
    !eligibilityChecks.directFailed &&
    eligibilityData.directSupported &&
    eligibilityData.directEnabled
  ) {
    eligibilityChecks = {
      ...eligibilityChecks,
      directPastVisit:
        eligibilityData.directEnabled &&
        hasVisitedInPastMonthsDirect(eligibilityData),
      directPastVisitValue:
        eligibilityData.directPastVisit?.durationInMonths || null,
      directClinics:
        eligibilityData.directEnabled &&
        !!eligibilityData.clinics?.length &&
        eligibilityData.hasMatchingClinics,
    };
  }

  return eligibilityChecks;
}

/*
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

/*
 * This function logs information about eligibility to the console, to help with
 * testing in non-production environments
 */
/* istanbul ignore next */
export function logEligibilityExplanation(
  eligibilityData,
  typeOfCareId,
  locationId,
) {
  if (environment.isProduction() || navigator.userAgent === 'node.js') {
    return;
  }

  try {
    /* eslint-disable no-console */
    console.log('----');
    console.log(
      `%cEligibility checks for location ${locationId} and type of care ${typeOfCareId}`,
      'font-weight: bold',
    );
    const requestMessages = [];
    const directMessages = [];
    if (eligibilityData.requestSupported && !eligibilityData.requestFailed) {
      if (!isUnderRequestLimit(eligibilityData)) {
        requestMessages.push(
          'The var-resources request limit service indicated that there are too many outstanding requests',
        );
      }

      if (!hasVisitedInPastMonthsRequest(eligibilityData)) {
        requestMessages.push(
          `The var-resources visited in past months service indicated that there has not been a recent visit (past ${
            eligibilityData.requestPastVisit.durationInMonths
          } months)`,
        );
      }
    } else {
      if (eligibilityData.requestFailed) {
        requestMessages.push(
          'There were errors trying to determine eligibility for making requests',
        );
      }
      if (!eligibilityData.requestSupported) {
        requestMessages.push(
          'VATS has requests disabled for this facility and type of care',
        );
      }
    }

    if (
      eligibilityData.directEnabled &&
      eligibilityData.directSupported &&
      !eligibilityData.directFailed
    ) {
      if (!hasVisitedInPastMonthsDirect(eligibilityData)) {
        directMessages.push(
          `The var-resources visited in past months service indicated that there has not been a recent visit (past ${
            eligibilityData.directPastVisit.durationInMonths
          } months)`,
        );
      }

      if (!eligibilityData.clinics?.length) {
        directMessages.push(
          `The var-resources clinics service did not return any clinics`,
        );
      } else if (!eligibilityData.hasMatchingClinics) {
        directMessages.push(
          `The FE could not find any of the clinics returned by var-resources in the past 24 months of appointments: ${eligibilityData.clinics
            .map(clinic => `${clinic.serviceName} (${clinic.id})`)
            .join(', ')}`,
        );
      }
    } else if (eligibilityData.directEnabled) {
      if (eligibilityData.directFailed) {
        directMessages.push(
          'There were errors trying to determine eligibility for direct scheduling',
        );
      }
      if (!eligibilityData.directSupported) {
        directMessages.push(
          'VATS has direct scheduling disabled for this facility and type of care',
        );
      }
    } else {
      directMessages.push(
        'The FE has disabled direct scheduling via feature toggle',
      );
    }

    if (directMessages.length) {
      console.log('%cUser not eligible for direct scheduling:', 'color: red');
      directMessages.forEach(message => {
        console.log(`  ${message}`);
      });
    } else {
      console.log('%cUser passed checks for direct scheduling', 'color: green');
    }

    if (requestMessages.length) {
      console.log('%cUser not eligible for requests:', 'color: red');
      requestMessages.forEach(message => {
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
