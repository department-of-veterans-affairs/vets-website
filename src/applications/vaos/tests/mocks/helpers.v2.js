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
