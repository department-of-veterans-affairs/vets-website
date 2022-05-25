import { parseISO, startOfDay } from 'date-fns';
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
 *
 * @returns {boolean}
 */
const hasMoreAppointmentsToCheckInto = (appointments, currentAppointment) => {
  return (
    appointments
      .filter(f => f.appointmentIen !== currentAppointment?.appointmentIen)
      .filter(f => f.eligibility === ELIGIBILITY.ELIGIBLE).length > 0
  );
};

/**
 * Check if any appointment was canceled.
 *
 * @param {Array<Appointment>} appointments
 *
 * @returns {boolean}
 */
const appointmentWasCanceled = appointments => {
  const statusIsCanceled = appointment =>
    appointment.status?.startsWith('CANCELLED');

  return Array.isArray(appointments) && appointments.some(statusIsCanceled);
};

/**
 * Get the interval from now until the end of the next check-in window.
 *
 * @param {Array<Appointment>} appointments
 *
 * @returns {number} ms until the end of the next check-in window. (0 if no appointments are eligible for check-in)
 */
const intervalUntilNextAppointmentIneligibleForCheckin = appointments => {
  let interval = 0;

  const eligibleAppointments = appointments.filter(
    appointment => appointment.eligibility === ELIGIBILITY.ELIGIBLE,
  );

  let checkInWindowEnds = eligibleAppointments.map(
    appointment => appointment.checkInWindowEnd,
  );

  checkInWindowEnds = checkInWindowEnds.filter(
    checkInWindowEnd => parseISO(checkInWindowEnd) > Date.now(),
  );

  checkInWindowEnds.sort((a, b) => {
    return parseISO(a) > parseISO(b);
  });

  if (checkInWindowEnds[0]) {
    interval = Math.round(parseISO(checkInWindowEnds[0]) - Date.now());
  }

  return interval;
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
    const preCheckInExpiry = startOfDay(new Date(appt.startTime));
    return today.getTime() < preCheckInExpiry.getTime();
  });
};

const appointmentStartTimePast15 = appointments => {
  return !Object.values(appointments).some(appt => {
    const today = new Date();
    const deadline = appt.checkInWindowEnd;
    return today.getTime() < new Date(deadline).getTime();
  });
};

export {
  appointmentStartTimePast15,
  appointmentWasCanceled,
  hasMoreAppointmentsToCheckInto,
  intervalUntilNextAppointmentIneligibleForCheckin,
  sortAppointmentsByStartTime,
  preCheckinAlreadyCompleted,
  removeTimeZone,
  preCheckinExpired,
};
