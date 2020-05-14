import moment from 'moment';
import { getConfirmedAppointments } from '../../api';
import { transformConfirmedAppointments } from './transformers';
import { mapToFHIRErrors } from '../../utils/fhir';

/**
 * Fetch the logged in user's confirmed appointments that fall between a startDate and endDate
 *
 * @export
 * @param {String} startDate Date in YYYY-MM-DD format
 * @param {String} endDate Date in YYYY-MM-DD format
 * @returns {Object} A FHIR searchset of Appointment resources
 */
export async function getBookedAppointments({ startDate, endDate }) {
  try {
    const appointments = await Promise.all([
      getConfirmedAppointments(
        'va',
        moment(startDate).toISOString(),
        moment(endDate).toISOString(),
      ),
      getConfirmedAppointments('cc', startDate, endDate),
    ]);

    return transformConfirmedAppointments([
      ...appointments[0],
      ...appointments[1],
    ]);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
