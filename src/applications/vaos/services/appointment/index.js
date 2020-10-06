import moment from 'moment';
import { getConfirmedAppointments, getPendingAppointments } from '../var';
import {
  transformConfirmedAppointments,
  transformPendingAppointments,
} from './transformers';
import { mapToFHIRErrors } from '../utils';
import {
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  PAST_APPOINTMENTS_HIDDEN_SET,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  VIDEO_TYPES,
  CONFIRMED_APPOINTMENT_TYPES,
} from '../../utils/constants';

/**
 * Fetch the logged in user's confirmed appointments that fall between a startDate and endDate
 *
 * @export
 * @param {String} startDate Date in YYYY-MM-DD format
 * @param {String} endDate Date in YYYY-MM-DD format
 * @returns {Object} A FHIR searchset of booked Appointment resources
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
 * Fetch the logged in user's pending appointments that fall between a startDate and endDate
 *
 * @export
 * @param {String} startDate Date in YYYY-MM-DD format
 * @param {String} endDate Date in YYYY-MM-DD format
 * @returns {Object} A FHIR searchset of pending Appointment resources
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
 * Returns whether or not the appointment/request is video
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @returns {Boolean} Whether or not the appointment/request is video
 */
export function isVideoAppointment(appointment) {
  return (
    appointment.contained
      ?.find(contained => contained.resourceType === 'HealthcareService')
      ?.characteristic?.some(c =>
        c.coding?.some(code => code.system === 'VVS'),
      ) || false
  );
}

/**
 * Returns the VVS appointment kind
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @returns {String} The VVS appointment kind
 */
export function getVideoKind(appointment) {
  const characteristic = appointment.contained
    ?.find(contained => contained.resourceType === 'HealthcareService')
    ?.characteristic?.find(c => c.coding?.find(code => code.system === 'VVS'));

  return characteristic?.coding[0].code;
}

/**
 * Returns whether or not the appointment/request is a GFE video appointment
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @returns {Boolean} Whether or not the appointment is a GFE video appointment
 */
export function isVideoGFE(appointment) {
  return (
    appointment.contained
      ?.find(contained => contained.resourceType === 'HealthcareService')
      ?.characteristic?.some(c =>
        c.coding.some(code => code.code === VIDEO_TYPES.gfe),
      ) || false
  );
}

/**
 * Gets legacy VAR facility id from HealthcareService reference
 *
 * @param {Object} appointment VAR Appointment in FHIR schema
 * @returns {String} Legacy VAR facility id
 */
export function getVARFacilityId(appointment) {
  if (appointment.vaos?.appointmentType === APPOINTMENT_TYPES.vaAppointment) {
    if (isVideoAppointment(appointment)) {
      return appointment.legacyVAR.apiData.facilityId;
    }

    const id = appointment.participant?.[0]?.actor?.reference
      ?.split('/')?.[1]
      ?.split('_')?.[0];

    if (id) {
      return id.replace('var', '');
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

    return id || null;
  }

  return null;
}

/**
 * Returns the location of a video appointment
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @returns {String} The location id where the video appointment is located
 */
export function getVideoAppointmentLocation(appointment) {
  const locationReference =
    appointment.contained?.[0]?.location?.reference ||
    appointment.contained?.[0]?.providedBy?.reference;

  if (locationReference) {
    return locationReference.split('/')[1];
  }

  return null;
}

/**
 * Returns the location ID of a VA appointment
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @returns The location id where the VA appointment is located
 */
export function getVAAppointmentLocationId(appointment) {
  const locationReference = appointment.participant?.find(p =>
    p.actor.reference?.startsWith('Location'),
  )?.actor?.reference;

  if (locationReference) {
    return locationReference.split('/')[1];
  }

  return null;
}

/**
 * Returns the location name of a VA appointment
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @returns The location name where the VA appointment is located
 */
export function getVAAppointmentLocationName(appointment) {
  return appointment.participant?.find(p =>
    p.actor.reference?.startsWith('Location'),
  )?.actor?.display;
}

/**
 * Returns the patient telecom info in a VA appointment
 *
 * @export
 * @param {Object} appointment A FHIR appointment resource
 * @param {String} system A FHIR telecom system id
 * @returns The patient telecome value
 */
export function getPatientTelecom(appointment, system) {
  return appointment?.contained
    .find(res => res.resourceType === 'Patient')
    ?.telecom?.find(t => t.system === system)?.value;
}

/**
 * Checks to see if a past appointment has a valid status
 *
 * @param {Object} appt A FHIR appointment resource
 * @returns Whether or not the appt should be shown
 */
export function isValidPastAppointment(appt) {
  return (
    appt.vaos.appointmentType !== APPOINTMENT_TYPES.vaAppointment ||
    !PAST_APPOINTMENTS_HIDDEN_SET.has(appt.description)
  );
}

/**
 * Returns true if the given Appointment is a confirmed appointment
 * or a request that still needs processing
 *
 * @export
 * @param {Object} appt The FHIR Appointment to check
 * @returns {Boolean} Whether or not the appointment is a valid upcoming
 *  appointment or request
 */
export function isUpcomingAppointmentOrRequest(appt) {
  if (CONFIRMED_APPOINTMENT_TYPES.has(appt.vaos.appointmentType)) {
    const apptDateTime = moment(appt.start);

    return (
      !appt.vaos.isPastAppointment &&
      !FUTURE_APPOINTMENTS_HIDDEN_SET.has(appt.description) &&
      apptDateTime.isValid() &&
      apptDateTime.isBefore(moment().add(13, 'months'))
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
 * Sort method for past appointments
 * @param {Object} a A FHIR appointment resource
 * @param {Object} b A FHIR appointment resource
 */
export function sortByDateDescending(a, b) {
  return moment(a.start).isAfter(moment(b.start)) ? -1 : 1;
}

/**
 * Sort method for future appointment requests
 * @param {Object} a A FHIR appointment resource
 * @param {Object} b A FHIR appointment resource
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
 * @param {Object} a A FHIR appointment resource
 * @param {Object} b A FHIR appointment resource
 */
export function sortMessages(a, b) {
  return moment(a.attributes.date).isBefore(b.attributes.date) ? -1 : 1;
}

/**
 * Method to check for ATLAS appointment
 * @param {*} appointment  A FHIR appointment resource
 * @return (Boolean} Returns whether or not the appointment is an ATLAS appointment.
 */
export function isAtlasLocation(appointment) {
  return appointment.legacyVAR.apiData.vvsAppointments?.some(
    element => element.tasInfo,
  );
}

/**
 * Method to check for home video appointment
 * @param {*} appointment A FHIR appointment resource
 * @return (Boolean} Returns whether or not the appointment is a home video appointment.
 */
export function isVideoHome(appointment) {
  const videoKind = getVideoKind(appointment);
  const isAtlas = isAtlasLocation(appointment);
  return (
    !isAtlas &&
    (videoKind === VIDEO_TYPES.mobile || videoKind === VIDEO_TYPES.adhoc)
  );
}

/**
 * Method to check for VA facility video appointment
 * @param {} appointment A FHIR appointment resource
 * @return (Boolean} Returns whether or not the appointment is a VA facility video appointment.
 */
export function isVideoVAFacility(appointment) {
  return VIDEO_TYPES.clinic === getVideoKind(appointment);
}

/**
 * Method to check for store forward video appointment
 * @param {*} appointment A FHIR appointment resource
 * @return (Boolean} Returns whether or not the appointment is a store forward video appointment.
 */
export function isVideoStoreForward(appointment) {
  return VIDEO_TYPES.storeForward === getVideoKind(appointment);
}
