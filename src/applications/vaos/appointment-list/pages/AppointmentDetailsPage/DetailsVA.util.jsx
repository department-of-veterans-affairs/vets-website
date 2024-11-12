import { APPOINTMENT_STATUS } from '../../../utils/constants';

/**
 * Returns appointment type header.
 *
 * @param {object} appointment appoinment object
 * @returns {string} returns string
 */
export function formatHeader(appointment) {
  const { isPastAppointment, isCompAndPenAppointment } = appointment.vaos;
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  if (appointment.vaos.isCOVIDVaccine) {
    return 'COVID-19 vaccine';
  }
  if (appointment.vaos.isPhoneAppointment) {
    return 'VA appointment over the phone';
  }
  if (
    (isPastAppointment && isCompAndPenAppointment) ||
    (isCompAndPenAppointment && cancelled)
  ) {
    return 'Claim exam';
  }
  return 'VA appointment';
}
