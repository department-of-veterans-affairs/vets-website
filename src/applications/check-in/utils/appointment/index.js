import { startOfDay } from 'date-fns';
import { ELIGIBILITY } from './eligibility';
import { VISTA_CHECK_IN_STATUS_IENS } from '../appConstants';

/**
 * @typedef {Object} Appointment
 * @property {string} facility
 * @property {string} clinicPhoneNumber
 * @property {string} clinicFriendlyName
 * @property {string} clinicName
 * @property {string} appointmentIen,
 * @property {Date} startTime,
 * @property {string} eligibility,
 * @property {string} facilityId,
 * @property {Date} checkInWindowStart,
 * @property {Date} checkInWindowEnd,
 * @property {string} checkedInTime,
 */

/**
 * @param {Array<Appointment>} appointments
 * @param {Appointment} currentAppointment
 */
const hasMoreAppointmentsToCheckInto = (appointments, currentAppointment) => {
  return (
    appointments
      .filter(f => f.appointmentIen !== currentAppointment?.appointmentIen)
      .filter(f => f.eligibility === ELIGIBILITY.ELIGIBLE).length > 0
  );
};

/**
 * Check if all appointments have completed pre-check-in.
 *
 * @param {Array<Appointment>} appointments
 */
const preCheckinAlreadyCompleted = appointments => {
  const isPreCheckinCompleteStep = checkInStep =>
    checkInStep.ien === VISTA_CHECK_IN_STATUS_IENS.PRE_CHECK_IN_COMPLETE;

  const preCheckinCompleted = appointment =>
    appointment.checkInSteps?.length &&
    appointment.checkInSteps.some(isPreCheckinCompleteStep);

  return (
    Array.isArray(appointments) &&
    appointments.length > 0 &&
    appointments.every(preCheckinCompleted)
  );
};

/**
 * @param {Array<Appointment>} appointments
 */
const sortAppointmentsByStartTime = appointments => {
  return appointments
    ? [
        ...appointments.sort((first, second) => {
          const f = new Date(first.startTime);
          const s = new Date(second.startTime);
          return new Date(f) - new Date(s);
        }),
      ]
    : [];
};

const removeTimeZone = payload => {
  // Grabbing the appointment payload and stripping out timezone here.
  // Chip should be handling this but currently isn't, this code may be refactored out.
  const updatedPayload = { ...payload };
  // These fields have a potential to include a time stamp.
  const timeFields = [
    'checkInWindowEnd',
    'checkInWindowStart',
    'checkedInTime',
    'startTime',
  ];

  const updatedAppointments = updatedPayload.appointments.map(appointment => {
    const updatedAppointment = { ...appointment };
    // If field exists in object we will replace the TZ part of the string.
    timeFields.forEach(field => {
      if (field in updatedAppointment) {
        updatedAppointment[field] = updatedAppointment[field].replace(
          /(?=\.).*/,
          '',
        );
      }
    });
    return updatedAppointment;
  });

  updatedPayload.appointments = updatedAppointments;

  return updatedPayload;
};

const preCheckinExpired = appointments => {
  return !Object.values(appointments).some(appt => {
    const today = new Date();
    const checkInExpiry = startOfDay(new Date(appt.startTime));
    return today.getTime() < checkInExpiry.getTime();
  });
};

export {
  hasMoreAppointmentsToCheckInto,
  sortAppointmentsByStartTime,
  preCheckinAlreadyCompleted,
  removeTimeZone,
  preCheckinExpired,
};
