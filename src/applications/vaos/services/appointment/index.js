/**
 * Functions related to fetching Apppointment data and pulling information from that data
 * @module services/Appointment
 */
import moment from 'moment';
import {
  getConfirmedAppointment,
  getConfirmedAppointments,
  getPendingAppointment,
  getPendingAppointments,
} from '../var';
import {
  transformConfirmedAppointment,
  transformConfirmedAppointments,
  transformPendingAppointment,
  transformPendingAppointments,
} from './transformers';
import { mapToFHIRErrors } from '../utils';
import {
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  VIDEO_TYPES,
} from '../../utils/constants';

export const CANCELLED_APPOINTMENT_SET = new Set([
  'CANCELLED BY CLINIC & AUTO RE-BOOK',
  'CANCELLED BY CLINIC',
  'CANCELLED BY PATIENT & AUTO-REBOOK',
  'CANCELLED BY PATIENT',
]);

// Appointments in these "HIDE_STATUS_SET"s should show in list, but their status should be hidden
export const FUTURE_APPOINTMENTS_HIDE_STATUS_SET = new Set([
  'ACT REQ/CHECKED IN',
  'ACT REQ/CHECKED OUT',
]);

export const PAST_APPOINTMENTS_HIDE_STATUS_SET = new Set([
  'ACTION REQUIRED',
  'INPATIENT APPOINTMENT',
  'INPATIENT/ACT REQ',
  'INPATIENT/CHECKED IN',
  'INPATIENT/CHECKED OUT',
  'INPATIENT/FUTURE',
  'INPATIENT/NO ACT TAKN',
  'NO ACTION TAKEN',
  'NO-SHOW & AUTO RE-BOOK',
  'NO-SHOW',
  'NON-COUNT',
]);

const CONFIRMED_APPOINTMENT_TYPES = new Set([
  APPOINTMENT_TYPES.ccAppointment,
  APPOINTMENT_TYPES.vaAppointment,
]);

// Appointments in these "HIDDEN_SET"s should not be shown in appointment lists at all
export const FUTURE_APPOINTMENTS_HIDDEN_SET = new Set(['NO-SHOW', 'DELETED']);

const PAST_APPOINTMENTS_HIDDEN_SET = new Set([
  'FUTURE',
  'DELETED',
  null,
  '<null>',
  'Deleted',
]);

/**
 * Fetch the logged in user's confirmed appointments that fall between a startDate and endDate
 *
 * @export
 * @async
 * @param {String} startDate Date in YYYY-MM-DD format
 * @param {String} endDate Date in YYYY-MM-DD format
 * @returns {Appointment[]} A FHIR searchset of booked Appointment resources
 */
export async function getBookedAppointments({ startDate, endDate }) {
  try {
    const appointments = await Promise.all([
      getConfirmedAppointments(
        'va',
        moment(startDate).toISOString(),
        moment(endDate).toISOString(),
      ),
      getConfirmedAppointments(
        'cc',
        moment(startDate).toISOString(),
        moment(endDate).toISOString(),
      ),
    ]);

    // We might get partial results back from MAS, so throw an error if we do
    if (appointments[0].errors?.length) {
      throw mapToFHIRErrors(
        appointments[0].errors,
        'MAS returned partial results',
      );
    }

    return transformConfirmedAppointments([
      ...appointments[0].data,
      ...appointments[1].data,
    ]);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Fetch the logged in user's pending appointments that fall between a startDate and endDate
 *
 * @export
 * @async
 * @param {String} startDate Date in YYYY-MM-DD format
 * @param {String} endDate Date in YYYY-MM-DD format
 * @returns {Appointment[]} A FHIR searchset of pending Appointment resources
 */
export async function getAppointmentRequests({ startDate, endDate }) {
  try {
    const appointments = await getPendingAppointments(startDate, endDate);

    return transformPendingAppointments(appointments);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Fetches a single appointment request and transforms it into our Appointment type
 *
 * @export
 * @async
 * @param {string} id Appointment request id
 * @returns {Appointment} An Appointment object for the given request id
 */
export async function fetchRequestById(id) {
  try {
    const appointment = await getPendingAppointment(id);

    return transformPendingAppointment(appointment);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
/**
 * Fetches a booked appointment based on the id and type provided
 *
 * @export
 * @async
 * @param {string} id MAS or community care booked appointment id
 * @param {'cc'|'va'} type Type of appointment that is being fetched
 * @returns {Appointment} A transformed appointment with the given id
 */
export async function fetchBookedAppointment(id, type) {
  try {
    let appointment;
    if (type === 'va') {
      appointment = await getConfirmedAppointment(id, type);
    } else if (type === 'cc') {
      // We don't have a fetch by id service for cc, so hopefully
      // the appointment is 13 months in either direction
      const { data } = await getConfirmedAppointments(
        type,
        moment()
          .add(-395, 'days')
          .startOf('day')
          .toISOString(),
        moment()
          .add(395, 'days')
          .startOf('day')
          .toISOString(),
      );
      appointment = data.find(appt => appt.id === id);
    }

    if (!appointment) {
      throw new Error(`Couldn't find ${type} appointment`);
    }

    return transformConfirmedAppointment(appointment);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Returns whether or not the appointment is VA phone appointment
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @returns {Boolean} Whether or not the appointment is by phone
 */
export function isVAPhoneAppointment(appointment) {
  return appointment.vaos.isPhoneAppointment;
}

/**
 * Gets legacy VAR facility id from HealthcareService reference
 *
 * @param {Appointment} appointment VAR Appointment in FHIR schema
 * @returns {string} Legacy VAR facility id
 */
export function getVARFacilityId(appointment) {
  if (appointment.vaos?.appointmentType === APPOINTMENT_TYPES.vaAppointment) {
    if (appointment.vaos?.isVideo) {
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
 * @param {Appointment} appointment VAR Appointment in FHIR schema
 * @returns {string} Legacy VAR clinic id
 */
export function getVARClinicId(appointment) {
  if (appointment.vaos?.appointmentType === APPOINTMENT_TYPES.vaAppointment) {
    const id = appointment.participant?.[0]?.actor?.reference
      ?.split('/')?.[1]
      ?.split('_')?.[1];

    return id || null;
  }

  return null;
}

/**
 * Returns the location ID of a VA appointment (in person or video)
 *
 * @export
 * @param {Appointment} appointment A FHIR appointment resource
 * @returns {string} The location id where the VA appointment is located
 */
export function getVAAppointmentLocationId(appointment) {
  if (
    appointment?.vaos.isVideo &&
    appointment?.vaos.appointmentType === APPOINTMENT_TYPES.vaAppointment
  ) {
    return appointment.videoData.facilityId;
  }

  const locationReference = appointment?.participant?.find(p =>
    p.actor.reference?.startsWith('Location'),
  )?.actor?.reference;

  if (locationReference) {
    return locationReference.split('/')[1];
  }

  return null;
}
/**
 * Returns the patient telecom info in a VA appointment
 *
 * @export
 * @param {Appointment} appointment A FHIR appointment resource
 * @param {string} system A FHIR telecom system id
 * @returns {string} The patient telecome value
 */
export function getPatientTelecom(appointment, system) {
  return appointment?.contained
    .find(res => res.resourceType === 'Patient')
    ?.telecom?.find(t => t.system === system)?.value;
}

/**
 * Checks to see if a past appointment has a valid status
 *
 * @param {Appointment} appt A FHIR appointment resource
 * @returns {boolean} Whether or not the appt should be shown
 */
export function isValidPastAppointment(appt) {
  return (
    appt.vaos.appointmentType !== APPOINTMENT_TYPES.vaAppointment ||
    !PAST_APPOINTMENTS_HIDDEN_SET.has(appt.description)
  );
}

/**
 * Checks to see if the appointment is either an appointment that does
 * not have one of the excluded statuses for past appointments or an
 * Express Care request that is either resolved or old enough to show
 *
 * @param {Appointment} appt A FHIR appointment resource
 * @returns {boolean} Whether or not the appt should be shown
 */
export function isValidPastAppointmentOrExpressCare(appt) {
  return (
    // Show any fulfilled EC request
    (appt.vaos.isExpressCare && appt.status === APPOINTMENT_STATUS.fulfilled) ||
    // Only show non-fulfilled EC requests if they're more than 2 days old
    (appt.vaos.isExpressCare &&
      appt.status !== APPOINTMENT_STATUS.fulfilled &&
      moment(appt.created).isBefore(moment().subtract(2, 'days'))) ||
    // Show any VA appointment that doesn't have a status in our hidden list
    (appt.vaos.appointmentType === APPOINTMENT_TYPES.vaAppointment &&
      !PAST_APPOINTMENTS_HIDDEN_SET.has(appt.description)) ||
    // Show any booked community care appointment
    appt.vaos.appointmentType === APPOINTMENT_TYPES.ccAppointment
  );
}

/**
 * Returns true if the given Appointment is a confirmed appointment
 * or a request that still needs processing
 *
 * @export
 * @param {Appointment} appt The FHIR Appointment to check
 * @returns {boolean} Whether or not the appointment is a valid upcoming
 *  appointment or request
 */
export function isUpcomingAppointmentOrRequest(appt) {
  if (CONFIRMED_APPOINTMENT_TYPES.has(appt.vaos.appointmentType)) {
    const apptDateTime = moment(appt.start);

    return (
      !appt.vaos.isPastAppointment &&
      !FUTURE_APPOINTMENTS_HIDDEN_SET.has(appt.description) &&
      apptDateTime.isValid() &&
      apptDateTime.isBefore(moment().add(395, 'days'))
    );
  }

  const today = moment().startOf('day');
  const hasValidDate = appt.requestedPeriod.some(period => {
    const momentStart = moment(period.start);
    const momentEnd = moment(period.end);
    return (
      momentStart.isValid() && momentStart.isAfter(today) && momentEnd.isValid()
    );
  });

  return (
    appt.status === APPOINTMENT_STATUS.proposed ||
    appt.status === APPOINTMENT_STATUS.pending ||
    (appt.status === APPOINTMENT_STATUS.cancelled &&
      (hasValidDate || appt.vaos.isExpressCare))
  );
}

/**
 * Returns true if the given Appointment is a confirmed appointment
 * or an Express Care request
 *
 * @export
 * @param {Appointment} appt The FHIR Appointment to check
 * @returns {boolean} Whether or not the appointment is a valid upcoming
 *  appointment or Express Care request
 */
export function isUpcomingAppointmentOrExpressCare(appt) {
  if (CONFIRMED_APPOINTMENT_TYPES.has(appt.vaos.appointmentType)) {
    const apptDateTime = moment(appt.start);

    return (
      !appt.vaos.isPastAppointment &&
      !FUTURE_APPOINTMENTS_HIDDEN_SET.has(appt.description) &&
      apptDateTime.isValid() &&
      apptDateTime.isAfter(moment().startOf('day')) &&
      apptDateTime.isBefore(
        moment()
          .endOf('day')
          .add(395, 'days'),
      )
    );
  }

  return (
    appt.vaos.isExpressCare &&
    appt.status !== APPOINTMENT_STATUS.fulfilled &&
    moment(appt.start).isAfter(
      // going one day back to account for late in the day EC requests
      moment()
        .startOf('day')
        .add(-1, 'day'),
    )
  );
}

/**
 * Returns true if the given Appointment is a canceled confirmed appointment
 * or a canceled Express Care request
 *
 * @export
 * @param {Appointment} appt The FHIR Appointment to check
 * @returns {boolean} Whether or not the appointment is a canceled
 *  appointment or Express Care request
 */
export function isCanceledConfirmedOrExpressCare(appt) {
  const today = moment();

  if (
    CONFIRMED_APPOINTMENT_TYPES.has(appt.vaos.appointmentType) ||
    appt.vaos.isExpressCare
  ) {
    const apptDateTime = moment(appt.start);

    return (
      appt.status === APPOINTMENT_STATUS.cancelled &&
      apptDateTime.isValid() &&
      apptDateTime.isAfter(
        today
          .clone()
          .startOf('day')
          .subtract(30, 'days'),
      ) &&
      apptDateTime.isBefore(
        today
          .clone()
          .endOf('day')
          .add(395, 'days'),
      )
    );
  }

  return false;
}

/**
 * Sort method for past appointments
 * @param {Appointment} a A FHIR appointment resource
 * @param {Appointment} b A FHIR appointment resource
 */
export function sortByDateDescending(a, b) {
  return moment(a.start).isAfter(moment(b.start)) ? -1 : 1;
}

/**
 * Sort method for upcoming appointments
 * @param {Appointment} a A FHIR appointment resource
 * @param {Appointment} b A FHIR appointment resource
 */
export function sortByDateAscending(a, b) {
  return moment(a.start).isBefore(moment(b.start)) ? -1 : 1;
}

/**
 * Sort method for appointments requests
 * @param {Appointment} a A FHIR appointment resource
 * @param {Appointment} b A FHIR appointment resource
 */
export function sortByCreatedDateDescending(a, b) {
  return moment(a.created).isAfter(moment(b.created)) ? -1 : 1;
}

/**
 * Sort method for future appointment requests
 * @param {Appointment} a A FHIR appointment resource
 * @param {Appointment} b A FHIR appointment resource
 */
export function sortUpcoming(a, b) {
  if (
    CONFIRMED_APPOINTMENT_TYPES.has(a.vaos.appointmentType) !==
    CONFIRMED_APPOINTMENT_TYPES.has(b.vaos.appointmentType)
  ) {
    return CONFIRMED_APPOINTMENT_TYPES.has(a.vaos.appointmentType) ? -1 : 1;
  }

  if (CONFIRMED_APPOINTMENT_TYPES.has(a.vaos.appointmentType)) {
    return moment(a.start).isBefore(moment(b.start)) ? -1 : 1;
  }

  const typeOfCareA = a.type?.coding?.[0]?.display;
  const typeOfCareB = b.type?.coding?.[0]?.display;

  // If type of care is the same, return the one with the sooner date
  if (typeOfCareA === typeOfCareB) {
    return moment(a.requestedPeriod[0].start).isBefore(
      moment(b.requestedPeriod[0].start),
    )
      ? -1
      : 1;
  }

  // Otherwise, return sorted alphabetically by appointmentType
  return typeOfCareA.toLowerCase() < typeOfCareB.toLowerCase() ? -1 : 1;
}

/**
 * Sort method for appointment messages
 * @param {Object} a Message object
 * @param {Object} b Message object
 */
export function sortMessages(a, b) {
  return moment(a.attributes.date).isBefore(b.attributes.date) ? -1 : 1;
}

/**
 * Method to check for home video appointment
 * @param {Appointment} appointment A FHIR appointment resource
 * @return {boolean} Returns whether or not the appointment is a home video appointment.
 */
export function isVideoHome(appointment) {
  const { isAtlas, kind } = appointment.videoData || {};
  return (
    !isAtlas && (kind === VIDEO_TYPES.mobile || kind === VIDEO_TYPES.adhoc)
  );
}

/**
 * Method to check for the existence of a practitioner
 * @param {Appointment} appointment An appointment resource
 * @return {boolean} Returns whether or not the appointment has a practitioner.
 */
export function hasPractitioner(appointment) {
  return !!appointment?.participant?.some(item =>
    item.actor?.reference?.includes('Practitioner'),
  );
}

/**
 * Method to parse out the appointment practitioner of participants array
 * @param {Array} participants An array of appointment participants
 * @return {string} Returns the appointment practitioner display value.
 */
export function getPractitionerDisplay(participants) {
  return participants?.find(p => p.actor.reference.includes('Practitioner'))
    .actor.display;
}

/**
 * Method to parse out the appointment practitioner location display in contained array
 * @param {Array} participants An array of appointment participants
 * @return {Object} Returns the appointment practitioner object.
 */
export function getPractitionerLocationDisplay(appointment) {
  return appointment.contained?.find(c =>
    c.resourceType.includes('Practitioner'),
  )?.practitionerRole?.[0]?.location?.[0]?.display;
}

/**
 * Groups appointments into an array of arrays by month
 * Assumes appointments are already sorted
 *
 * @export
 * @param {Appointment[]} appointments List of FHIR appointments
 * @returns {Array} An array of arrays by month
 */
export function groupAppointmentsByMonth(appointments) {
  if (appointments.length === 0) {
    return [];
  }

  const appointmentsByMonth = [[]];
  let currentIndex = 0;
  appointments.forEach(appt => {
    if (
      !appointmentsByMonth[currentIndex].length ||
      moment(appt.start).format('YYYY-MM') ===
        moment(appointmentsByMonth[currentIndex][0].start).format('YYYY-MM')
    ) {
      appointmentsByMonth[currentIndex].push(appt);
    } else {
      appointmentsByMonth.push([appt]);
      currentIndex++;
    }
  });

  return appointmentsByMonth;
}
