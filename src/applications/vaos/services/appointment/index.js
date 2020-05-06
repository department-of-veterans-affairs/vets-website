import { getConfirmedAppointments } from '../../api';
import { transformConfirmedAppointments } from './transformers';
import { mapToFHIRErrors } from '../../utils/fhir';

/**
 * Fetch the logged in user's confirmed appointments that fall between a startDate and endDate
 *
 * @export
 * @param {String} startDate A list of three digit site ids
 * @returns {Object} A FHIR searchset of Organization resources
 */
export async function getBookedAppointments({ startDate, endDate }) {
  try {
    const appointments = await getConfirmedAppointments(
      'va',
      startDate,
      endDate,
    );

    return transformConfirmedAppointments(appointments);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
