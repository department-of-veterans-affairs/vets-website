import moment from 'moment';
import { getConfirmedAppointments } from '../../api';
import { transformConfirmedAppointments } from './transformers';
import { mapToFHIRErrors } from '../../utils/fhir';
import { APPOINTMENT_TYPES } from '../../utils/constants';

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

/**
 * Gets legacy var facility id from HealthcareService reference
 *
 * @param {Object} appointment VAR Appointment in FHIR schema
 * @returns {String} Legacy VAR facility id
 */
export function getVARFacilityId(appointment) {
  if (appointment.vaos?.appointmentType === APPOINTMENT_TYPES.vaAppointment) {
    if (appointment.vaos.videoType) {
      return appointment.legacyVAR.apiData.facilityId;
    }

    const id = appointment.participant?.[0]?.actor?.reference
      ?.split('/')?.[1]
      ?.split('_')?.[0];

    if (id) {
      return id;
    }

    return null;
  }

  return null;
}

/**
 * Gets legacy var clinic id from HealthcareService reference
 *
 * @param {Object} appointment VAR Appointment in FHIR schema
 * @returns {String} Legacy VAR clinic id
 */
export function getVARClinicId(appointment) {
  if (appointment.vaos?.appointmentType === APPOINTMENT_TYPES.vaAppointment) {
    const id = appointment.participant?.[0]?.actor?.reference
      ?.split('/')?.[1]
      ?.split('_')?.[1];

    return id ? `var${id}` : null;
  }

  return null;
}
