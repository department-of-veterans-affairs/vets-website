/** @module testing/mocks/helpers/vaos */
import environment from 'platform/utilities/environment';
import {
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import moment from 'moment';
import metaWithFailures from '../../services/mocks/v2/meta_failures.json';
import metaWithoutFailures from '../../services/mocks/v2/meta.json';

/**
 * Mocks the api call that submits an appointment or request to the VAOS service
 *
 * @export
 * @param {VAOSAppointment} data The appointment data to return from the mock
 */
export function mockAppointmentSubmitV2(data) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
    { data },
  );
}

/**
 * Mocks the fetch made when retrieving a single VAOS appointment
 * for the details page
 *
 * @export
 * @param {Object} params
 * @param {VAOSRequest} params.appointment Request to be returned from the mock
 * @param {boolean} [params.error=null] Whether or not to return an error from the mock
 * }
 */
export function mockSingleVAOSAppointmentFetch({ appointment, error = null }) {
  const baseUrl = `${environment.API_URL}/vaos/v2/appointments/${
    appointment.id
  }?_include=facilities,clinics`;

  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: appointment });
  }
}

/**
 * Mocks the fetch request made when retrieving VAOS appointments from the appointment-list page
 *
 * @export
 * @param {Object} params
 * @param {string} start Start date for list of appointments
 * @param {string} end End date for list of appointments
 * @param {Array<string>} statuses An array of appointment statuses
 * @param {Array<VAOSRequest>} params.request Request to be returned from the mock
 * @param {boolean} [params.error=null] Whether or not to return a fetch error from the mock
 * @param {boolean} [params.backendServiceFailures=null] Whether or not to return a backend service error with the mock
 */
export function mockVAOSAppointmentsFetch({
  start,
  end,
  statuses = [],
  requests,
  error = null,
  backendServiceFailures = null,
}) {
  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/appointments?_include=facilities,clinics&start=${start}&end=${end}&${statuses
    .map(status => `statuses[]=${status}`)
    .join('&')}`;

  const meta = backendServiceFailures ? metaWithFailures : metaWithoutFailures;

  if (error) {
    // General fetching error, no appointments returned
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    // Returns a meta object within the response with or without any backendServiceFailures
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data: requests,
      meta,
    });
  }
}

/**
 * Mocks the api call to get parent sites from the VAOS service. Really only used
 * on the old two step facility page.
 *
 * @export
 * @param {Array<string>} ids A list of VistA site ids to mock the request for
 * @param {Array<VARParentSite>} data The list of parent site data returned from the mock call
 */
export function mockVAOSParentSites(ids, data, children = false) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v2/facilities?children=${children}&${ids
        .map(id => `ids[]=${id}`)
        .join('&')}`,
    ),
    { data },
  );
}

/**
 * Mock the api calls that checks if a user is eligible for community care for
 *   a given type of care and if the facility supports CC
 *
 * @export
 * @param {Object} params
 * @param {Array<string>} params.parentSites The VA parent sites to check for CC support
 * @param {Array<string>} params.supportedSites The VA parent sites that support CC
 * @param {string} params.careType Community care type of care string
 * @param {boolean} [eligible=true] Is the user eligible for CC
 */
export function mockV2CommunityCareEligibility({
  parentSites,
  supportedSites,
  careType,
  eligible = true,
}) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/scheduling/configurations?${parentSites
        .map(site => `facility_ids[]=${site}`)
        .join('&')}&cc_enabled=true`,
    ),
    {
      data: (supportedSites || parentSites).map(parent => ({
        id: parent,
        attributes: {
          facilityId: parent,
          communityCare: true,
        },
      })),
    },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v2/community_care/eligibility/${careType}`,
    ),
    {
      data: {
        id: careType,
        attributes: {
          eligible,
        },
      },
    },
  );
}

/**
 * Mocks the api call that gets direct and request scheduling settings from VATS
 *
 * @export
 * @param {Array<string>} ids The facility ids to pull settings for
 * @param {Array<SchedulingConfiguration>} data The list of facilities with their settings to return from the mock
 */
export function mockSchedulingConfigurations(configs, isCCEnabled = false) {
  let ccEnabledParam = '';
  if (isCCEnabled) {
    ccEnabledParam = `&cc_enabled=${isCCEnabled}`;
  }

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v2/scheduling/configurations?${configs
        .map(config => `facility_ids[]=${config.id}`)
        .join('&')}${ccEnabledParam}`,
    ),
    { data: configs },
  );
}

/**
 * Mocks the api call that fetches a list of appointment slots for direct scheduling
 *
 * @export
 * @param {Object} params
 * @param {string} facilityId The VistA facility id where slots are from
 * @param {string} preferredDate The preferred date chosen by the user, which determines the date range fetched,
 *    if startDate and endDate are not provided
 * @param {MomentDate} startDate The start date for the appointment slots
 * @param {MomentDate} endDate The end date for the appointment slots
 * @param {string} clinicId The VistA clinic id the slots are in
 * @param {boolean} withError Flag to determine if the response should fail.
 * @param {Array<VARSlot>} response The list of slots to return from the mock
 */
export function mockAppointmentSlotFetch({
  facilityId,
  preferredDate,
  startDate,
  endDate,
  clinicId,
  withError = false,
  response: data = [],
}) {
  const start = startDate || preferredDate.clone().startOf('month');
  const end =
    endDate ||
    preferredDate
      .clone()
      .add(1, 'month')
      .endOf('month')
      .startOf('day');

  if (withError) {
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v2/locations/${facilityId}/clinics/${clinicId}/slots?` +
          `start=${start.format()}` +
          `&end=${end.format()}`,
      ),
      {
        errors: [],
      },
    );
  } else {
    setFetchJSONResponse(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v2/locations/${facilityId}/clinics/${clinicId}/slots?` +
          `start=${start.format()}` +
          `&end=${end.format()}`,
      ),
      {
        data,
      },
    );
  }
}

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
      start: moment()
        .startOf('day')
        .subtract(i + 1, 'year')
        .utc()
        .format(),

      end: moment()
        .startOf('day')
        .subtract(i, 'year')
        .utc()
        .format(),
    };
  });
}

/**
 * Function to mock the 'update' appointments endpoint.
 *
 * @example PUT '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockAppointmentUpdateApi({
  response: data,
  responseCode = 200,
  version = 2,
}) {
  let baseUrl = '';

  if (version === 2) {
    baseUrl = `${environment.API_URL}/vaos/v2/appointments/${data.id}`;

    if (responseCode === 200) {
      setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
    } else {
      setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
    }
  }

  return baseUrl;
}

/**
 * Function to mock the 'GET' appointment endpoint.
 *
 * @example GET '/vaos/v2/appointments/:id'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockAppointmentApi({
  response: data,
  responseCode = 200,
  version = 2,
}) {
  let baseUrl = '';

  if (version === 2) {
    baseUrl = `${environment.API_URL}/vaos/v2/appointments/${
      data.id
    }?_include=facilities,clinics`;

    if (responseCode === 200) {
      setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data });
    } else {
      setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
    }
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
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockAppointmentsApi({
  end,
  start,
  statuses = [],
  response: data,
  backendServiceFailures = false,
  responseCode = 200,
  version = 2,
}) {
  let baseUrl = '';

  if (version === 2) {
    baseUrl = `${
      environment.API_URL
    }/vaos/v2/appointments?_include=facilities,clinics&start=${start}&end=${end}&${statuses
      .map(status => `statuses[]=${status}`)
      .join('&')}`;

    const meta = backendServiceFailures
      ? metaWithFailures
      : metaWithoutFailures;

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
  }

  return baseUrl;
}

/**
 * Function to mock the API call to get all upcoming appointments.
 *
 * @example GET '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockGetUpcomingAppointmentsApi({
  response: data,
  backendServiceFailures = false,
  responseCode = 200,
  version = 2,
}) {
  const end = moment()
    .add(395, 'days')
    .format('YYYY-MM-DD');
  const start = moment()
    .subtract(30, 'days')
    .format('YYYY-MM-DD');
  const statuses = ['booked', 'arrived', 'fulfilled', 'cancelled'];

  return mockAppointmentsApi({
    end,
    start,
    statuses,
    response: data,
    backendServiceFailures,
    responseCode,
    version,
  });
}

/**
 * Function to mock the API call to get all pending appointments.
 *
 * @example GET '/vaos/v2/appointments'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockGetPendingAppointmentsApi({
  response: data,
  backendServiceFailures = false,
  responseCode = 200,
  version = 2,
}) {
  const end = moment()
    .add(1, 'day')
    .format('YYYY-MM-DD');
  const start = moment()
    .subtract(120, 'days')
    .format('YYYY-MM-DD');
  const statuses = ['proposed', 'cancelled'];

  return mockAppointmentsApi({
    end,
    start,
    statuses,
    response: data,
    backendServiceFailures,
    responseCode,
    version,
  });
}

/**
 * Function to mock the 'GET' clinics endpoint. This function is used get all
 * clinics associated with the given facility/location.
 *
 * @example GET '/vaos/v2/locations/:locationId/clinics'
 *
 * @export
 * @param {Object} arguments - Function arguments.
 * @param {String} arguments.locationId - Location id.
 * @param {Object} [arguments.response] - The response to return from the mock api call.
 * @param {number} [arguments.responseCode=200] - The response code to return from the mock api call.
 * @param {number} [arguments.version=2] - Api version number.
 */
export function mockClinicsApi({
  clinicId,
  locationId,
  response: data,
  responseCode = 200,
  version = 2,
}) {
  let baseUrl = '';

  if (version === 2) {
    baseUrl = `${
      environment.API_URL
    }/vaos/v2/locations/${locationId}/clinics?clinic_ids%5B%5D=${clinicId}`;

    if (responseCode === 200) {
      setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
        data,
      });
    } else {
      setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
    }
  }

  return baseUrl;
}
