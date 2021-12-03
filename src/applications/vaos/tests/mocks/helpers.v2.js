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
export function mockAppointmentSubmitV2(data) {
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
  const baseUrl = `${environment.API_URL}/vaos/v2/appointments/${
    request.id
  }?_include=facilities,clinics`;

  if (error) {
    setFetchJSONFailure(global.fetch.withArgs(baseUrl), { errors: [] });
  } else {
    setFetchJSONResponse(global.fetch.withArgs(baseUrl), { data: request });
  }
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
  }/vaos/v2/appointments?_include=facilities,clinics&start=${start}&end=${end}&${statuses
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
 *    from the mock with the status set to Cancelled and cancelation reason set to patient
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
          cancelationReason: { coding: [{ code: 'pat' }] },
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

/**
 * Mocks the api call that gets direct and request scheduling settings from VATS
 *
 * @export
 * @param {Array<string>} ids The facility ids to pull settings for
 * @param {Array<SchedulingConfiguration>} data The list of facilities with their settings to return from the mock
 */
export function mockSchedulingConfigurations(configs) {
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v2/scheduling/configurations?${configs
        .map(config => `facility_ids[]=${config.id}`)
        .join('&')}`,
    ),
    { data: configs },
  );
}

/**
 * Mocks the api call that fetches a list of appointment slots for direct scheduling
 *
 * @export
 * @param {Object} params
 * @param {string} siteId The VistA site id where slots are from
 * @param {string} typeOfCareId The type of care id of the slots being requested
 * @param {string} preferredDate The preferred date chosen by the user, which determines the date range fetched,
 *    if startDate and endDate are not provided
 * @param {MomentDate} startDate The start date for the appointment slots
 * @param {MomentDate} endDate The end date for the appointment slots
 * @param {string} [length=20] The length of the appointment slots
 * @param {string} clinicId The VistA clinic id the slots are in
 * @param {Array<VARSlot>} slots The list of slots to return from the mock
 */
export function mockAppointmentSlotFetch({
  facilityId,
  preferredDate,
  startDate,
  endDate,
  clinicId,
}) {
  const start = startDate || preferredDate.clone().startOf('month');
  const end =
    endDate ||
    preferredDate
      .clone()
      .add(1, 'month')
      .endOf('month');

  setFetchJSONResponse(
    global.fetch.withArgs(
      `${
        environment.API_URL
      }/vaos/v2/locations/${facilityId}/clinics/${clinicId}/slots?` +
        `&start_date=${start.format()}` +
        `&end_date=${end.format()}`,
    ),
    {
      data: [
        {
          id: clinicId,
          type: 'slots',
          attributes: {
            startDate,
            endDate,
          },
        },
      ],
    },
  );
}
