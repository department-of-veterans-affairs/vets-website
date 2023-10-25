import React from 'react';
import { parseISO, startOfDay } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
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
 * @property {Date} checkInWindowStart,
 * @property {Date} checkInWindowEnd,
 * @property {string} checkedInTime,
 * @property {string} appointmentId,
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
 * Check if any appointment was canceled but not every.
 *
 * @param {Array<Appointment>} appointments
 *
 * @returns {boolean}
 */
const appointmentWasCanceled = appointments => {
  const statusIsCanceled = appointment =>
    appointment.status?.startsWith('CANCELLED');

  return (
    Array.isArray(appointments) &&
    appointments.length > 0 &&
    appointments.some(statusIsCanceled) &&
    !appointments.every(statusIsCanceled)
  );
};

/**
 * Check if every appointment was canceled.
 *
 * @param {Array<Appointment>} appointments
 *
 * @returns {boolean}
 */
const allAppointmentsCanceled = appointments => {
  const statusIsCanceled = appointment =>
    appointment.status?.startsWith('CANCELLED');

  return (
    Array.isArray(appointments) &&
    appointments.length > 0 &&
    appointments.every(statusIsCanceled)
  );
};

/**
 * Return the first cancelled appointment.
 *
 * @param {Array<Appointment>} appointments
 *
 */
const getFirstCanceledAppointment = appointments => {
  const statusIsCanceled = appointment =>
    appointment.status?.startsWith('CANCELLED');

  return appointments.find(statusIsCanceled);
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
 * Determine whether the physical location should be displayed for the given appointment.
 *
 * @param {Appointment} appointment
 * @returns {boolean}
 */
const locationShouldBeDisplayed = appointment => {
  const notEmpty = location => {
    return typeof location === 'string' && location.length > 0;
  };

  return appointment.kind === 'clinic' && notEmpty(appointment.clinicLocation);
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

/**
 * @param {Array<Appointment>} appointments
 */

function organizeAppointmentsByYearMonthDay(appointments) {
  const organizedData = [];

  // First sort the appointments by start time then organize them by yearmonth and day
  const sortedAppointments = sortAppointmentsByStartTime(appointments);

  for (const appointment of sortedAppointments) {
    const dateObj = new Date(appointment.startTime);
    const monthYearKey = `${dateObj.getFullYear()}-${Number(
      dateObj.getMonth(),
    ) + 1}`;
    const dayKey = `${dateObj.getDay()}-${dateObj.getDate()}`;

    let monthObj = organizedData.find(
      item => item.monthYearKey === monthYearKey,
    );

    if (!monthObj) {
      monthObj = {
        monthYearKey,
        days: [],
        firstAppointmentStartTime: appointment.startTime,
      };
      organizedData.push(monthObj);
    }

    let dayObj = monthObj.days.find(item => item.dayKey === dayKey);

    if (!dayObj) {
      dayObj = {
        dayKey,
        appointments: [],
        firstAppointmentStartTime: appointment.startTime,
      };
      monthObj.days.push(dayObj);
    }

    dayObj.appointments.push(appointment);
  }

  return organizedData;
}

const removeTimeZone = payload => {
  // Grabbing the appointment payload and stripping out timezone here.
  // Chip should be handling this but currently isn't, this code may be refactored out.
  const updatedPayload = { ...payload };
  // These fields have a potential to include a time stamp.
  const timeFields = ['checkedInTime', 'startTime'];

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

const hasPhoneAppointments = appointments => {
  return Object.values(appointments).some(appt => {
    return appt?.kind === 'phone';
  });
};

/**
 * Render the appointment type icon
 *
 * @param {Appointment} appointment
 * @returns {Node}
 */

const appointmentIcon = appointment => {
  let iconName;
  switch (appointment?.kind) {
    case 'clinic':
    case 'cvt':
      iconName = 'location_city';
      break;
    case 'vvc':
      iconName = 'videocam';
      break;
    default:
      iconName = 'phone';
      break;
  }

  return <va-icon icon={iconName} size={3} data-testid="appointment-icon" />;
};

/**
 * Return the name to use for appointment clinic.
 *
 * @param {Appointment} appointment
 * @returns {string}
 */

const clinicName = appointment => {
  return appointment.clinicFriendlyName
    ? appointment.clinicFriendlyName
    : appointment.clinicName;
};

/**
 * Return a unique ID of ien and station.
 *
 * @param {Appointment} appointment
 * @returns {string}
 */

const getAppointmentId = appointment => {
  return `${appointment.appointmentIen}-${appointment.stationNo}`;
};

/**
 * Find appointment by ID.
 *
 * @param {appointmentId} appointmentId
 * @param {Array<Appointment>} appointments
 * @returns {object}
 */

const findAppointment = (appointmentId, appointments) => {
  const appointmentIdParts = appointmentId.split('-');
  return appointments.find(
    appointmentItem =>
      String(appointmentItem.appointmentIen) ===
        String(appointmentIdParts[0]) &&
      String(appointmentItem.stationNo) === String(appointmentIdParts[1]),
  );
};

/**
 * Return adjusted ISO timestring
 * @param {string} time
 * @param {string} timezone
 * @param {string} isoFormat
 * @returns {string}
 */

const utcToFacilityTimeZone = (
  time,
  timezone,
  isoFormat = "yyyy-LL-dd'T'HH:mm:ss.SSSxxx",
) => {
  return format(utcToZonedTime(time, timezone), isoFormat, {
    timeZone: timezone,
  });
};

/**
 * Return label for appointment
 * @param {object} appointment
 * @returns {string}
 */

const getApptLabel = appointment => {
  const time = utcToFacilityTimeZone(
    appointment.startTime,
    appointment.timezone,
    'h:mm aaaa',
  );
  const label = appointment.clinicFriendlyName
    ? appointment.clinicFriendlyName
    : appointment.clinicStopCodeName;
  return `${time}${label ? ` ${label}` : ''}`;
};

/**
 * Determine if there are multiple checkinable appointments.
 *
 * @param {appointments} appointments
 * @returns {boolean}
 */

const getCheckinableAppointments = appointments => {
  return appointments.filter(a => a.eligibility === ELIGIBILITY.ELIGIBLE);
};

export {
  appointmentStartTimePast15,
  appointmentWasCanceled,
  allAppointmentsCanceled,
  getFirstCanceledAppointment,
  hasMoreAppointmentsToCheckInto,
  intervalUntilNextAppointmentIneligibleForCheckin,
  locationShouldBeDisplayed,
  sortAppointmentsByStartTime,
  organizeAppointmentsByYearMonthDay,
  preCheckinAlreadyCompleted,
  removeTimeZone,
  preCheckinExpired,
  hasPhoneAppointments,
  appointmentIcon,
  clinicName,
  getAppointmentId,
  findAppointment,
  utcToFacilityTimeZone,
  getApptLabel,
  getCheckinableAppointments,
};
