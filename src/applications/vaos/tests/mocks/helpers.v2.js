/** @module testing/mocks/helpers/vaos */
import environment from 'platform/utilities/environment';
import {
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

/**
 * Mocks the api call that submits an appointment or request to the VAOS service
 *
 * @export
 * @param {VAOSAppointment} data The appointment data to return from the mock
 */
export function mockAppointmentSubmit(data) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
    { data },
  );
}

/**
 * Mocks the fetch request made when retrieving a single VAOS appointment request
 * for the details page
 *
 * @export
 * @param {Object} params
 * @param {VAOSRequest} params.request Request to be returned from the mock
 * @param {boolean} [params.error=null] Whether or not to return an error from the mock
 * }
 */
export function mockSingleVAOSRequestFetch({ request, error = null }) {
  const baseUrl = `${environment.API_URL}/vaos/v2/appointments/${request.id}`;

  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: request });
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
 * @param {boolean} [params.error=null] Whether or not to return an error from the mock
 * }
 */
export function mockVAOSAppointmentsFetch({
  start,
  end,
  statuses = [],
  requests,
  error = null,
}) {
  const baseUrl = `${
    environment.API_URL
  }/vaos/v2/appointments?start=${start}&end=${end}&${statuses
    .map(status => `statuses[]=${status}`)
    .join('&')}`;

  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: requests });
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
 * Mocks the api call made to cancel an appointment.
 *
 * @export
 * @param {Object} params
 * @param {VAOSAppointment} params.appointment Request object from the vaos service that will be returned back
 *    from the mock with the status set to Cancelled
 * @param {boolean} params.error Return an error response
 */
export function mockAppointmentCancelFetch({ appointment, error = false }) {
  const baseUrl = `${environment.API_URL}/vaos/v2/appointments/${
    appointment.id
  }`;
  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), {
      data: {
        ...appointment,
        attributes: {
          ...appointment.attributes,
          status: 'cancelled',
        },
      },
    });
  }
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
      `${environment.API_URL}/vaos/v0/community_care/eligibility/${careType}`,
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
