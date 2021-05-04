import { captureError } from '../../../utils/error';
import { getLongTermAppointmentHistory } from '../../../services/var';
import {
  recordVaosError,
  recordEligibilityFailure,
} from '../../../utils/events';
import { getFacilityIdFromLocation } from '../../../services/location';
import { getAvailableHealthcareServices } from '../../../services/healthcare-service';
import environment from 'platform/utilities/environment';
import { fetchPatientEligibility } from '../../../services/patient';

function createErrorHandler(errorKey) {
  return data => {
    captureError(data, true);
    recordVaosError(`eligibility-${errorKey}`);
    return 'error';
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
  typeOfCare,
  isDirectScheduleEnabled,
) {
  const systemId = location.vistaId;
  const typeOfCareId = typeOfCare.id;
  const facilityId = getFacilityIdFromLocation(location);
  const directSchedulingAvailable =
    // this check is included due to old two step facilities page
    (location.legacyVAR.directSchedulingSupported ||
      location.legacyVAR.settings?.[typeOfCareId]?.direct.enabled) &&
    isDirectScheduleEnabled;

  const eligibilityChecks = {
    eligibility: fetchPatientEligibility({
      typeOfCare,
      location,
      type: !directSchedulingAvailable ? 'request' : null,
    }),
  };

  if (directSchedulingAvailable) {
    eligibilityChecks.clinics = getAvailableHealthcareServices({
      facilityId,
      typeOfCareId,
      systemId,
    }).catch(createErrorHandler('direct-available-clinics-error'));
    eligibilityChecks.pastAppointments = getLongTermAppointmentHistory().catch(
      createErrorHandler('direct-no-matching-past-clinics-error'),
    );
  }

  const results = await promiseAllFromObject(eligibilityChecks);

  const eligibility = {
    ...results.eligibility,
    clinics: results.clinics,
    pastAppointments: results.pastAppointments,
    hasMatchingClinics: !!results.clinics?.length,
    directSupported:
      // this check is included due to old two step facilities page
      location.legacyVAR.directSchedulingSupported ||
      location.legacyVAR.settings?.[typeOfCareId]?.direct.enabled,
    directEnabled: isDirectScheduleEnabled,
    requestSupported:
      // this check is included due to old two step facilities page
      location.legacyVAR.requestSupported ||
      location.legacyVAR.settings?.[typeOfCareId]?.request.enabled,
  };

  if (
    directSchedulingAvailable &&
    eligibility.clinics !== 'error' &&
    eligibility.clinics?.length
  ) {
    eligibility.hasMatchingClinics = eligibility.clinics?.some(
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
export function getEligibilityChecks(eligibilityData, location, typeOfCare) {
  return {
    directPastVisit: eligibilityData.direct?.hasRequiredAppointmentHistory,
    requestPastVisit: eligibilityData.request?.hasRequiredAppointmentHistory,
    requestLimit: eligibilityData.request?.isEligibleForNewAppointmentRequest,
    requestSupported: eligibilityData.requestSupported,
    directSupported: eligibilityData.directSupported,
    requestFailed: !eligibilityData.request,
    directFailed:
      eligibilityData.directSupported &&
      (!eligibilityData.direct ||
        eligibilityData.clinics === 'error' ||
        eligibilityData.pastAppointments === 'error'),
    directPastVisitValue:
      (location.legacyVAR.settings?.[typeOfCare.id].direct
        .patientHistoryDuration /
        365) *
      12,
    requestPastVisitValue:
      (location.legacyVAR.settings?.[typeOfCare.id].request
        .patientHistoryDuration /
        365) *
      12,
    requestLimitValue:
      location.legacyVAR.settings?.[typeOfCare.id].request
        .submittedRequestLimit,
    directClinics:
      eligibilityData.directEnabled &&
      !!eligibilityData.clinics?.length &&
      eligibilityData.hasMatchingClinics,
  };
}

/*
 * Record Google Analytics events based on results of eligibility checks.
 * Error keys ending with 'error' represent a failure in fetching info for the check,
 * while keys ending with 'failure' signify that the user didn't meet the condition
 * of the check.
 */
export function recordEligibilityGAEvents(eligibilityData) {
  if (eligibilityData.requestSupported && eligibilityData.request) {
    if (!eligibilityData.request.isEligibleForNewAppointmentRequest) {
      recordEligibilityFailure('request-exceeded-outstanding-requests');
    }

    if (!eligibilityData.request.hasRequiredAppointmentHistory) {
      recordEligibilityFailure('request-past-visits');
    }
  }

  if (!eligibilityData.requestSupported) {
    recordEligibilityFailure('request-supported');
  }

  if (
    eligibilityData.directEnabled &&
    eligibilityData.directSupported &&
    eligibilityData.direct
  ) {
    if (!eligibilityData.direct.hasRequiredAppointmentHistory) {
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
    if (eligibilityData.requestSupported && eligibilityData.request) {
      if (!eligibilityData.request.isEligibleForNewAppointmentRequest) {
        requestMessages.push(
          'The var-resources request limit service indicated that there are too many outstanding requests',
        );
      }

      if (!eligibilityData.request.hasRequiredAppointmentHistory) {
        requestMessages.push(
          `The var-resources visited in past months service indicated that there has not been a recent visit`,
        );
      }
    } else {
      if (!eligibilityData.request) {
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
      eligibilityData.direct
    ) {
      if (!eligibilityData.direct.hasRequiredAppointmentHistory) {
        directMessages.push(
          `The var-resources visited in past months service indicated that there has not been a recent visit`,
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
      if (!eligibilityData.direct) {
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
