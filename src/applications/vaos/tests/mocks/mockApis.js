/** @module testing/mocks/mockApis */
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  addMonths,
  format,
  lastDayOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
  subYears,
} from 'date-fns';
import {
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import sinon from 'sinon';
import metaWithoutFailures from '../../services/mocks/v2/meta.json';
import metaWithFailures from '../../services/mocks/v2/meta_failures.json';
import MockAppointmentResponse from '../fixtures/MockAppointmentResponse';

/**
 * Return a collection of start and end dates. The start date starts from the current
 * date and the end date will be the previous year.
 *
 * @export
 * @param {number} [nbrOfYears=2] Number of years to compute the start and end dates
 * @returns A collection of mock start and end date objects
 */
export function getDateRanges(nbrOfYears = 1) {
  return Array.from(Array(nbrOfYears).keys()).map(i => {
    return {
      start: subYears(startOfDay(new Date()), i + 1),
      end: subYears(startOfDay(new Date()), i),
    };
  });
}

/**
 * Function to mock the 'GET' appointment endpoint.
 *
 * @example GET '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {boolean} [arguments.avs=false] Flag to include after visit summary information.
 * @param {boolean} [arguments.fetchClaimStatus=false] Flag to include claim status information.
 * @param {Object} arguments.response - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockAppointmentApi({
  includes = ['facilities', 'clinics'],
  response: data,
  responseCode = 200,
}) {
  const baseUrl = `${environment.API_URL}/vaos/v2/appointments/${
    data.id
  }?_include=${includes}`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Function to mock the 'GET' appointments endpoint.
 *
 * @example GET '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {boolean} [arguments.backendServiceFailures] - Flag to simulate backend end service error.
 * @param {Date} arguments.end - Appointment end date
 * @param {Array<string>} [arguments.includes] - API parameter to include facility or clinic information.
 * @param {Date} arguments.start - Appointment start date
 * @param {Array<string>} arguments.statuses - Appointment states. Ex. 'booked', 'arrived', 'fulfilled', 'cancelled', 'proposed', 'pending'
 * @param {boolean} [arguments.useRFC3339] - Flag to use RFC3339 format (yyyy-MM-ddTHH:mm:ssZ) for start and end date
 * @param {Object} arguments.response - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockAppointmentsApi({
  backendServiceFailures = false,
  end,
  includes = ['facilities', 'clinics'],
  start,
  statuses = [],
  useRFC3339 = false,
  response: data = [],
  responseCode = 200,
}) {
  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/appointments?_include=${includes}&start=${
    useRFC3339
      ? `${start.toISOString().slice(0, 19)}Z`
      : format(start, 'yyyy-MM-dd')
  }&end=${
    useRFC3339
      ? `${end.toISOString().slice(0, 19)}Z`
      : format(end, 'yyyy-MM-dd')
  }&${statuses.map(status => `statuses[]=${status}`).join('&')}`;

  const meta = backendServiceFailures ? metaWithFailures : metaWithoutFailures;

  if (responseCode === 200) {
    // Returns a meta object within the response with or without any backendServiceFailures
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data,
      meta,
    });
  } else {
    // General fetching error, no appointments returned
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Mocks the api call that submits an appointment or request to the VAOS service
 *
 * @example POST '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 */
export function mockAppointmentSubmitApi({
  response: data,
  responseCode = 200,
}) {
  const baseUrl = `${environment.API_URL}/vaos/v2/appointments`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Function to mock the 'update' appointments endpoint.
 *
 * @example PUT '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} arguments.response - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockAppointmentUpdateApi({
  id,
  response: data,
  responseCode = 200,
} = {}) {
  const _id = id || data?.id;
  const baseUrl = `${environment.API_URL}/vaos/v2/appointments/${_id}`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Mocks request to VA community care providers api, used in community care request flow
 *
 * @example GET '/vaos/v2/facilities_api/v2/ccp/provider'
 *
 * @export
 * @param {Object} address Facility address object with latitude and longitude properties
 * @param {Array<string>} specialties Array of specialty codes used for a type of care
 * @param {Array<string>} bbox Array of bounding box coordinates to search in
 * @param {Array<PPMSProvider>} response Array of providers to return from mock
 * @param {boolean} [vaError=false] If true mock will return an error response
 * @param {number} [radius=60] Miles radius to search within for the mock, used in query param
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockCCProviderApi({
  address,
  bbox,
  radius = 60,
  specialties,
  response: data,
  responseCode = 200,
}) {
  const bboxQuery = bbox.map(c => `bbox[]=${c}`).join('&');
  const specialtiesQuery = specialties.map(s => `specialties[]=${s}`).join('&');
  const baseUrl = `${
    environment.API_URL
  }/facilities_api/v2/ccp/provider?latitude=${address.latitude}&longitude=${
    address.longitude
  }&radius=${radius}&per_page=15&page=1&${bboxQuery}&${specialtiesQuery}&trim=true`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Function to mock the 'GET' clinics endpoint. This function is used get all
 * clinics associated with the given facility/location.
 *
 * @example GET '/vaos/v2/locations/:locationId/clinics'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Array<string>} arguments.clinicId - Clinic ids
 * @param {String} arguments.locationId - Location id.
 * @param {String} arguments.typeOfCareId - Type of care id.
 * @param {Object} arguments.response - The response to return from the mock api call.
 * @param {?number} [arguments.responseCode] - The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockClinicsApi({
  clinicId,
  locationId,
  typeOfCareId,
  response: data,
  responseCode = 200,
}) {
  let baseUrl = `${
    environment.API_URL
  }/vaos/v2/locations/${locationId}/clinics?clinic_ids%5B%5D=${clinicId}`;

  if (typeOfCareId)
    baseUrl = `${
      environment.API_URL
    }/vaos/v2/locations/${locationId}/clinics?clinical_service=${typeOfCareId}`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data,
    });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

export function mockEligibilityDirectApi({
  facilityId,
  patientHistoryInsufficientError = false,
  typeOfCareId,
  response: _data,
  responseCode = 200,
}) {
  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/eligibility?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=direct`;
  const directReasons = [];

  if (responseCode === 200) {
    if (patientHistoryInsufficientError && typeOfCareId !== 'primaryCare') {
      directReasons.push({
        coding: [
          {
            code: 'patient-history-insufficient',
          },
        ],
      });
    }

    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data: {
        attributes: {
          eligible: directReasons.length === 0,
          ineligibilityReasons:
            directReasons.length === 0 ? undefined : directReasons,
        },
      },
    });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }
}

export function mockEligibilityRequestApi({
  facilityId,
  facilityRequestLimitExceeded = false,
  patientHistoryInsufficientError = false,
  typeOfCareId,
  response: _data,
  responseCode = 200,
}) {
  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/eligibility?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=request`;
  const requestReasons = [];

  if (responseCode === 200) {
    if (patientHistoryInsufficientError && typeOfCareId !== 'primaryCare') {
      requestReasons.push({
        coding: [
          {
            code: 'patient-history-insufficient',
          },
        ],
      });
    }

    if (facilityRequestLimitExceeded) {
      requestReasons.push({
        coding: [
          {
            code: 'facility-request-limit-exceeded',
          },
        ],
      });
    }

    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data: {
        attributes: {
          eligible: requestReasons.length === 0,
          ineligibilityReasons:
            requestReasons.length === 0 ? undefined : requestReasons,
        },
      },
    });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Mocks the facilities fetch call using the api
 *
 * @example GET '/vaos/v2/facilities'
 *
 * @export
 * @param {Object} arguments
 * @param {Array<string>} arguments.ids An array of facility ids to use in the query params. Not necessary unless you are using the children param to return the child facilities of parents
 * @param {Boolean} [arguments.children=true] Sets the children query param, which is meant to include child
 * @param {Array<Object>} [arguments.response=[]] The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockFacilitiesApi({
  ids,
  children = true,
  response: data = [],
  responseCode = 200,
}) {
  let idList = ids;
  if (!idList || idList.length === 0) idList = data.map(f => f.id);

  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/facilities?children=${children}&${idList
    .map(id => `ids[]=${id}`)
    .join('&')}`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Mocks the single facility fetch call using the api
 *
 * @example GET '/vaos/v2/facilities/:id'
 *
 * @export
 * @param {Object} arguments
 * @param {string} [arguments.id] Facility id. NOTE: Facility id will be used from the response object when the 'id' is not set.
 * @param {Object} [arguments.response] The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockFacilityApi({
  id,
  response: data = {},
  responseCode = 200,
}) {
  const _id = id || data?.id;
  const baseUrl = `${environment.API_URL}/vaos/v2/facilities/${_id}`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Mock the browser geolocation api with a given position
 *
 * @export
 * @param {Object} [params]
 * @param {number} [latitude=53.2734] Latitude value (defaulted to San Diego)
 * @param {number} [longitude=-7.77832031] Longitude value (defaulted to San Diego)
 * @param {boolean} [fail=false] Should the geolocation request fail
 */
export function mockGetCurrentPosition({
  latitude = 53.2734, // San Diego, CA
  longitude = -7.77832031,
  fail = false,
} = {}) {
  global.navigator.geolocation = {
    getCurrentPosition: sinon.stub().callsFake(
      (successCallback, failureCallback) =>
        fail
          ? Promise.resolve(
              failureCallback({
                code: 1,
                message: 'User denied Geolocation',
              }),
            )
          : Promise.resolve(
              successCallback({ coords: { latitude, longitude } }),
            ),
    ),
  };
}

/**
 * Mocks the api call that gets direct and request scheduling settings from VATS
 *
 * @example GET '/vaos/v2/scheduling/configurations'
 *
 * @export
 * @param {Object} arguments
 * @param {boolean} [arguments.isCCEnabled] - Community care enabled flag
 * @param {Array<string>} [arguments.facilityIds] - The facility ids to pull settings for
 * @param {Array<Object>} arguments.response - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockSchedulingConfigurationsApi({
  isCCEnabled = false,
  facilityIds,
  response: data,
  responseCode = 200,
}) {
  let ccEnabledParam = '';
  if (isCCEnabled) {
    ccEnabledParam = `&cc_enabled=${isCCEnabled}`;
  }
  const ids = facilityIds || data.map(config => config.id);
  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/scheduling/configurations?${ids
    .map(id => `facility_ids[]=${id}`)
    .join('&')}${ccEnabledParam}`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Mocks the api call that fetches a list of appointment slots for direct scheduling
 *
 * @example GET '/vaos/v2/locations/:facilityId/clinics/:clinicId/slots'
 *
 * @export
 * @param {Object} arguments
 * @param {string} arguments.facilityId The VistA facility id where slots are from
 * @param {string} arguments.preferredDate The preferred date chosen by the user, which determines the date range fetched,
 *    if startDate and endDate are not provided
 * @param {Date} arguments.startDate The start date for the appointment slots
 * @param {Date} arguments.endDate The end date for the appointment slots
 * @param {string} arguments.clinicId The VistA clinic id the slots are in
 * @param {Array<VARSlot>} arguments.response The response to return from the mock api call.
 * @param {boolean} arguments.responseCode The response code to return from the mock api call.
 */
export function mockAppointmentSlotApi({
  clinicId,
  endDate,
  facilityId,
  preferredDate,
  startDate,
  typeOfCare,
  provider,
  response: data = [],
  responseCode = 200,
} = {}) {
  const start = startDate || startOfMonth(preferredDate);
  const end = endDate || lastDayOfMonth(addMonths(preferredDate, 1));

  let clinicSegment = '';
  let selectedClinicId;
  if (clinicId) {
    selectedClinicId = clinicId.includes('_')
      ? clinicId.split('_')[1]
      : clinicId;
    clinicSegment = `/clinics/${selectedClinicId}`;
  }

  const extraParams = [];
  if (typeOfCare) extraParams.push(`&clinical_service=${typeOfCare}`);
  if (provider) extraParams.push(`&provider=${encodeURIComponent(provider)}`);

  const providerSlotUrl = `${
    environment.API_URL
  }/vaos/v2/locations/${facilityId}${clinicSegment}/slots?start=${encodeURIComponent(
    start.toISOString(),
  )}&end=${encodeURIComponent(end.toISOString())}${extraParams.join('')}`;

  let primaryUrl = null;
  if (clinicId && clinicId.includes('_')) {
    primaryUrl = `${
      environment.API_URL
    }/vaos/v2/locations/${facilityId}/clinics/${clinicId}/slots?start=${encodeURIComponent(
      start.toISOString(),
    )}&end=${encodeURIComponent(end.toISOString())}${extraParams.join('')}`;
  }

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(providerSlotUrl), { data });
    if (primaryUrl) {
      setFetchJSONResponse(global.fetch.withArgs(primaryUrl), { data });
    }
  } else {
    setFetchJSONFailure(global.fetch.withArgs(providerSlotUrl), { errors: [] });
    if (primaryUrl) {
      setFetchJSONFailure(global.fetch.withArgs(primaryUrl), { errors: [] });
    }
  }

  return providerSlotUrl;
}

/**
 * Mocks the api calls for the various eligibility related fetches VAOS does in the new appointment flow
 *
 * @export
 * @param {Object} arguments
 * @param {string} arguments.siteId The VistA site id the facility is associated with
 * @param {string} arguments.facilityId The VA facility id to check for eligibility at
 * @param {string} arguments.typeOfCareId The type of care id to check for eligibility for
 * @param {boolean} [arguments.limit=false] Whether the mock should set the user as passing the request limit check
 * @param {boolean} [arguments.requestPastVisits=false] Whether the mock should set the user as passing the past visits check
 *    for requests
 * @param {boolean} [arguments.directPastVisits=false] Whether the mock should set the user as passing the past visits check
 *    for direct scheduling
 * @param {Array<VAOSClinic>} [arguments.clinics=[]] The clinics returned during the eligibility checks
 * @param {boolean} [arguments.pastClinics=false] Whether or not the mock should also mock an appointments fetch with an
 *    past appointment with a clinic matching one passed in the clinics param, so that the user passes the past clinics check
 * }
 */
export function mockEligibilityFetches({
  facilityId,
  typeOfCareId,
  limit = false,
  requestPastVisits = false,
  requestsDisabled = false,
  directPastVisits = false,
  directDisabled = false,
  matchingClinics = null,
  clinics = [],
  pastClinics = false,
}) {
  const directReasons = [];
  const requestReasons = [];

  if (directDisabled) {
    directReasons.push({
      coding: [
        {
          code: 'facility-cs-direct-disabled',
        },
      ],
    });
  }

  if (requestsDisabled) {
    requestReasons.push({
      coding: [
        {
          code: 'facility-cs-request-disabled',
        },
      ],
    });
  }

  if (!directPastVisits && typeOfCareId !== 'primaryCare') {
    directReasons.push({
      coding: [
        {
          code: 'patient-history-insufficient',
        },
      ],
    });
  }

  if (!requestPastVisits && typeOfCareId !== 'primaryCare') {
    requestReasons.push({
      coding: [
        {
          code: 'patient-history-insufficient',
        },
      ],
    });
  }

  if (!limit) {
    requestReasons.push({
      coding: [
        {
          code: 'facility-request-limit-exceeded',
        },
      ],
    });
  }

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/eligibility?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=direct`,
    ),
    {
      data: {
        attributes: {
          eligible: directReasons.length === 0,
          ineligibilityReasons:
            directReasons.length === 0 ? undefined : directReasons,
        },
      },
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/eligibility?facility_id=${facilityId}&clinical_service_id=${typeOfCareId}&type=request`,
    ),
    {
      data: {
        attributes: {
          eligible: requestReasons.length === 0,
          ineligibilityReasons:
            requestReasons.length === 0 ? undefined : requestReasons,
        },
      },
    },
  );

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/locations/${facilityId}/clinics?clinical_service=${typeOfCareId}`,
    ),
    {
      data: clinics,
    },
  );

  const pastAppointments = (matchingClinics || clinics).map(clinic => {
    return new MockAppointmentResponse({
      localStartTime: subDays(new Date(), 1),
    })
      .setClinicId(clinic.id)
      .setLocationId(facilityId.substr(0, 3));
  });

  const dateRanges = getDateRanges(3);
  dateRanges.forEach(range => {
    mockAppointmentsApi({
      start: range.start,
      end: range.end,
      useRFC3339: false,
      response: pastClinics ? pastAppointments : [],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });
  });
}

/**
 * Function to mock the 'GET' community care endpoint.
 *
 * @example GET '/vaos/v2/community_care/eligibility/:serviceType'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {boolean} arguments.isEligible - Flag to determine eligibility.
 * @param {string} arguments.serviceType - Type of care.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 *
 * @return {string} Return mock API URL. This is useful for debugging.
 */
export function mockCCEligibilityApi({
  isEligible: eligible = true,
  serviceType,
  response: _data,
  responseCode = 200,
}) {
  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/community_care/eligibility/${serviceType}`;

  if (responseCode === 200) {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data: {
        id: serviceType,
        attributes: {
          eligible,
        },
      },
    });
  } else {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  }

  return baseUrl;
}

/**
 * Mock the api calls that checks if a user is eligible for community care for
 *   a given type of care and if the facility supports CC
 *
 * @export
 * @param {Object} arguments
 * @param {Array<string>} arguments.parentSites The VA parent sites to check for CC support
 * @param {Array<string>} arguments.supportedSites The VA parent sites that support CC
 * @param {string} arguments.careType Community care type of care string
 * @param {boolean} [eligible=true] Is the user eligible for CC
 */
export function mockV2CommunityCareEligibility({
  parentSites,
  supportedSites,
  careType,
  eligible = true,
}) {
  mockSchedulingConfigurationsApi({
    facilityIds: parentSites,
    isCCEnabled: true,
    response: (supportedSites || parentSites).map(parent => ({
      id: parent,
      attributes: {
        facilityId: parent,
        communityCare: true,
      },
    })),
  });
  mockCCEligibilityApi({
    serviceType: careType,
    isEligible: eligible,
    response: [
      {
        id: careType,
        attributes: {
          eligible,
        },
      },
    ],
  });
}
