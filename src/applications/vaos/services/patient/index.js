/**
 * Functions related to patient specific information
 * @module services/Patient
 */
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { recordEligibilityFailure, recordVaosError } from '../../utils/events';
import { captureError } from '../../utils/error';
import {
  ELIGIBILITY_REASONS,
  TYPE_OF_CARE_IDS,
  INELIGIBILITY_CODES_VAOS,
} from '../../utils/constants';
import { promiseAllFromObject } from '../../utils/data';
import { getAvailableHealthcareServices } from '../healthcare-service';
import { getPatientEligibility, getPatientRelationships } from '../vaos';
import { getLongTermAppointmentHistoryV2 } from '../appointment';
import { transformPatientRelationships } from './transformers';

/**
 * Checks if a type of care is exempted from requiring past appointment history
 * for scheduling
 * @param {string} typeOfCareId The type of care ID to check
 * @param {boolean} [featurePastVisitMHFilter=false] whether to use past visits as a filter for scheduling MH appointments
 * @returns {boolean} true if the type of care is exempted from past appointment history requirement
 */
export function typeOfCareRequiresPastHistory(
  typeOfCareId,
  featurePastVisitMHFilter = false,
) {
  const {
    MENTAL_HEALTH_SERVICES_ID,
    PRIMARY_CARE,
    MENTAL_HEALTH_SUBSTANCE_USE_ID,
  } = TYPE_OF_CARE_IDS;
  const exempted = new Set([PRIMARY_CARE, MENTAL_HEALTH_SUBSTANCE_USE_ID]);

  if (!featurePastVisitMHFilter) {
    exempted.add(MENTAL_HEALTH_SERVICES_ID);
  }

  return !exempted.has(typeOfCareId);
}

function createErrorHandler(errorKey) {
  return data => {
    captureError(data, true);
    recordVaosError(`eligibility-${errorKey}`);
    return new Error('Eligibility error');
  };
}

/**
 * Checks if returned values from patient eligibility contain a specific error code
 * @param {{coding:{code:string}[]}[]} ineligibilityReasons
 * @param {string} vaosErrorCode, a keyof INELIGIBILITY_CODES_VAOS in src/applications/vaos/utils/constants.js
 * @returns {boolean} true if ineligibilityReasons contains the vaosErrorCode
 */
export function hasEligibilityError(ineligibilityReasons, vaosErrorCode) {
  return Array.isArray(ineligibilityReasons)
    ? ineligibilityReasons.some(reason => {
        const { code } = reason.coding[0];
        return code === vaosErrorCode;
      })
    : false;
}

/** Negation of hasEligibilityError, for readability
 * @param {{coding:{code:string}[]}[]} ineligibilityReasons
 * @param {string} ineligibilityType, a keyof INELIGIBILITY_CODES_VAOS in src/applications/vaos/utils/constants.js
 * @returns {boolean} true if ineligibilityReasons does not contain the ineligibilityType or ineligibilityReasons is not an array (e.g. undefined)
 */
function doesNotHaveEligibilityError(ineligibilityReasons, ineligibilityType) {
  return !hasEligibilityError(ineligibilityReasons, ineligibilityType);
}

/**
 * Returns patient based eligibility checks for specified request or direct types
 *
 * @param {Object} params
 * @param {TypeOfCare} params.typeOfCare Type of care object,
 * @param {Location} params.location Location of where patient should have eligibility checked,
 * @param {'direct'|'request'|null} [params.type=null] The type to check eligibility for. By default,
 *   will check both
 * }
 * @returns {PatientEligibility} Patient eligibility data
 */
async function fetchPatientEligibility({ typeOfCare, location, type = null }) {
  const checks = {};
  if (type !== 'request') {
    checks.direct = getPatientEligibility(
      location.id,
      typeOfCare.idV2,
      'direct',
    ).catch(createErrorHandler(`direct-check-metadata-error`));
  }

  if (type !== 'direct') {
    checks.request = getPatientEligibility(
      location.id,
      typeOfCare.idV2,
      'request',
    ).catch(createErrorHandler(`request-check-metadata-error`));
  }

  const results = await promiseAllFromObject(checks);
  const output = { direct: null, request: null };

  if (results.direct instanceof Error) {
    output.direct = new Error('Direct scheduling eligibility check error');
  } else if (results.direct) {
    output.direct = {
      eligible: results.direct.eligible,
      hasRequiredAppointmentHistory: doesNotHaveEligibilityError(
        results.direct.ineligibilityReasons,
        INELIGIBILITY_CODES_VAOS.PATIENT_HISTORY_INSUFFICIENT,
      ),
      disabled: hasEligibilityError(
        results.direct.ineligibilityReasons,
        INELIGIBILITY_CODES_VAOS.DIRECT_SCHEDULING_DISABLED,
      ),
    };
  }

  if (results.request instanceof Error) {
    output.request = new Error('Request eligibility check error');
  } else if (results.request) {
    const disabled = hasEligibilityError(
      results.request.ineligibilityReasons,
      INELIGIBILITY_CODES_VAOS.REQUEST_SCHEDULING_DISABLED,
    );
    output.request = {
      disabled,
      eligible: results.request.eligible,
      hasRequiredAppointmentHistory:
        !disabled &&
        doesNotHaveEligibilityError(
          results.request.ineligibilityReasons,
          INELIGIBILITY_CODES_VAOS.PATIENT_HISTORY_INSUFFICIENT,
        ),
      isEligibleForNewAppointmentRequest:
        !disabled &&
        doesNotHaveEligibilityError(
          results.request.ineligibilityReasons,
          INELIGIBILITY_CODES_VAOS.REQUEST_LIMIT_EXCEEDED,
        ),
    };
  }

  return output;
}

/**
 * Method to get logged in user's patient/provider relationships objects
 *
 * @export
 * @async
 * @param {TypeOfCare} params.typeOfCare Type of care object for which to check patient relationships
 * @param {string} params.facilityId of facility to check for relationships
 * @param {Date} params.hasAvailabilityBefore A date object for determining how long into the future to look for appointment availability
 * @returns {Promise<Array<PatientProviderRelationship>>} Returns an array of PatientProviderRelationship objects
 */

export async function fetchPatientRelationships(
  facilityId,
  typeOfCare,
  hasAvailabilityBefore,
) {
  try {
    const data = await getPatientRelationships({
      locationId: facilityId,
      typeOfCareId: typeOfCare.idV2,
      hasAvailabilityBefore,
    });

    return {
      patientProviderRelationships: transformPatientRelationships(data),
      backendServiceFailures: data.meta?.failures,
    };
  } catch (e) {
    return null;
  }
}

function locationSupportsDirectScheduling(location, typeOfCare) {
  return (
    // this check is included due to old two step facilities page
    location.legacyVAR.directSchedulingSupported ||
    location.legacyVAR.settings?.[typeOfCare.id]?.direct?.enabled
  );
}

function locationSupportsRequests(location, typeOfCare) {
  return (
    // this check is included due to old two step facilities page
    location.legacyVAR.requestSupported ||
    location.legacyVAR.settings?.[typeOfCare.id]?.request?.enabled
  );
}

/**
 * Has maching clinics that support direct scheduling and match past appointments if required
 * @param {HealthCareService[]} clinics
 * @param {Object[]} pastAppointments -- from getLongTermAppointmentHistoryV2 - no return type
 * @param {boolean} [requiresPastHistory=true]
 * @returns {boolean}
 */
function hasMatchingClinics(
  clinics,
  pastAppointments,
  requiresPastHistory = true,
) {
  return clinics?.some(clinic => {
    const [facilityId, clinicId] = clinic.id.split('_');
    const acceptsDirect = clinic.patientDirectScheduling === true;

    return !!pastAppointments.find(appt => {
      const matchesClinic =
        appt.version === 2
          ? clinic.stationId === appt.location?.stationId &&
            clinicId === appt.location?.clinicId
          : clinicId === appt.clinicId && facilityId === appt.facilityId;
      if (appt.version === 2) {
        if (requiresPastHistory) {
          return matchesClinic && acceptsDirect;
        }
        return acceptsDirect;
      }
      // v1 appointments fallback, despite the fact that clinics response now should be updated
      // and have the possibility to match acceptsDirect for whichever type of appt is returned
      return matchesClinic;
    });
  });
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

/**
 * Checks eligibility for new appointment flow and returns
 * results, plus clinics and past appointments fetched along the way
 *
 * @export
 * @async
 * @param {Object} params
 * @param {TypeOfCare} params.typeOfCare Type of care object for the currently chosen type of care
 * @param {Location} params.location The current location to check eligibility against
 * @param {boolean} params.directSchedulingEnabled If direct scheduling is currently enabled
 * @param {boolean} [params.featurePastVisitMHFilter=false] whether to use past visits as a filter for scheduling MH appointments
 * @param {boolean} [params.isCerner=false] whether the current site is a Cerner site
 * @param {boolean} [params.removeFacilityConfigCheck=false] whether to skip the facility configurations endpoint check and use eligibility from the patient eligibility API SOT only
 * @returns {FlowEligibilityReturnData} Eligibility results, plus clinics and past appointments
 *   so that they can be cache and reused later
 */
export async function fetchFlowEligibilityAndClinics({
  typeOfCare,
  location,
  directSchedulingEnabled,
  featurePastVisitMHFilter = false,
  isCerner = false,
  removeFacilityConfigCheck = false,
  featureUseBrowserTimezone,
}) {
  // Helper to avoid confusion
  const keepFacilityConfigCheck = !removeFacilityConfigCheck;
  // When the removeFacilityConfigCheck flipper is removed, all directSchedulingAvailable should be changed to directSchedulingEnabled
  const directSchedulingAvailable =
    (locationSupportsDirectScheduling(location, typeOfCare) ||
      removeFacilityConfigCheck) &&
    directSchedulingEnabled;

  const typeOfCareRequiresCheck = typeOfCareRequiresPastHistory(
    typeOfCare.id,
    featurePastVisitMHFilter,
  );

  const apiCalls = {
    patientEligibility: fetchPatientEligibility({
      typeOfCare,
      location,
      type: !directSchedulingAvailable ? 'request' : null,
    }),
  };

  // When removeFacilityConfigCheck is removed, directTypeOfCareSettings should be removed and not used
  // location contains legacyVAR that contains patientHistoryRequired
  const directTypeOfCareSettings =
    location.legacyVAR.settings?.[typeOfCare.id]?.direct;

  // We don't want to make unnecessary api calls if DS is turned off and we are using the configuration call
  if (directSchedulingAvailable && !isCerner) {
    apiCalls.clinics = getAvailableHealthcareServices({
      facilityId: location.id,
      typeOfCare,
    }).catch(createErrorHandler('direct-available-clinics-error'));

    apiCalls.pastAppointments = getLongTermAppointmentHistoryV2(
      featureUseBrowserTimezone,
    ).catch(createErrorHandler('direct-no-matching-past-clinics-error'));
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

  // When removeFacilityConfigCheck is removed, remove first condition in first if and remove
  // removeFacilityConfigCheck from 2nd condition in first if condition
  // This is going through all of our request related checks and setting
  // to false if we fail any of them. Order is important here, because the UI
  // will only be able to show one reason, the first one
  if (
    (keepFacilityConfigCheck &&
      !locationSupportsRequests(location, typeOfCare)) ||
    (removeFacilityConfigCheck && results.patientEligibility.request?.disabled)
  ) {
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
  if (!isCerner) {
    results.clinics = results?.clinics?.filter(
      clinic => clinic.patientDirectScheduling === true,
    );
  }

  // When removeFacilityConfigCheck removed, first if condition should just be:
  // if (results.patientEligibility.direct?.disabled)
  // Location does not support direct scheduling
  if (
    (keepFacilityConfigCheck &&
      !locationSupportsDirectScheduling(location, typeOfCare)) ||
    (removeFacilityConfigCheck && results.patientEligibility.direct?.disabled)
  ) {
    eligibility.direct = false;
    eligibility.directReasons.push(ELIGIBILITY_REASONS.notSupported);
  } else if (
    results.patientEligibility.direct instanceof Error ||
    results.clinics instanceof Error ||
    results.pastAppointments instanceof Error
  ) {
    eligibility.direct = false;
    eligibility.directReasons.push(ELIGIBILITY_REASONS.error);
  } else if (directSchedulingEnabled) {
    if (!results.patientEligibility.direct.hasRequiredAppointmentHistory) {
      eligibility.direct = false;
      eligibility.directReasons.push(ELIGIBILITY_REASONS.noRecentVisit);
      recordEligibilityFailure(
        'direct-check-past-visits',
        typeOfCare?.id,
        location?.id,
      );
    }

    if (!results.clinics?.length && !isCerner) {
      eligibility.direct = false;
      eligibility.directReasons.push(ELIGIBILITY_REASONS.noClinics);
      recordEligibilityFailure(
        'direct-available-clinics',
        typeOfCare?.id,
        location?.id,
      );
    }
    // When removeFacilityConfigCheck is removed, remove the requiresMatchingClinics variable because
    // we will always need to check for matching clinics at that point.
    const requiresMatchingClinics =
      removeFacilityConfigCheck ||
      (keepFacilityConfigCheck &&
        directTypeOfCareSettings.patientHistoryRequired);
    if (
      !isCerner &&
      requiresMatchingClinics &&
      !hasMatchingClinics(
        results.clinics,
        results.pastAppointments,
        typeOfCareRequiresCheck,
      )
    ) {
      eligibility.direct = false;
      eligibility.directReasons.push(ELIGIBILITY_REASONS.noMatchingClinics);
      recordEligibilityFailure('direct-no-matching-past-clinics');
    }
  }

  logEligibilityExplanation(location, typeOfCare, eligibility);

  return {
    eligibility,
    clinics: results.clinics,
    pastAppointments: results.pastAppointments,
  }; // clinics and past appointments are returned in addition to eligibilty to be cached for later user
}
