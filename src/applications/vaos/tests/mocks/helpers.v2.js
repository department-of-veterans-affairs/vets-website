/** @module testing/mocks/helpers/vaos */
import environment from 'platform/utilities/environment';
import { setFetchJSONResponse } from 'platform/testing/unit/helpers';

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
