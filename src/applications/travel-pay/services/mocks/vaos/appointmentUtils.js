import { APPOINTMENT_MAP, DEFAULT_APPOINTMENT_TYPE } from './appointmentData';

/**
 * Returns a fully formed appointment response for a given ID
 */
export function getAppointmentById({
  id,
  appointment,
  generateAppointmentDates,
  overrideAppointment,
}) {
  const entry = APPOINTMENT_MAP[id];

  if (!entry) {
    return appointment[DEFAULT_APPOINTMENT_TYPE];
  }

  const { type, days } = entry;

  return overrideAppointment(
    appointment[type],
    id,
    generateAppointmentDates(days),
  );
}
