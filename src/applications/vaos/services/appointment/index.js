/**
 * Functions related to fetching Apppointment data and pulling information from that data
 * @module services/Appointment
 */
import moment from 'moment';
import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import {
  getCancelReasons,
  getConfirmedAppointment,
  getConfirmedAppointments,
  getPendingAppointment,
  getPendingAppointments,
  updateAppointment,
  updateRequest,
} from '../var';
import {
  getAppointment,
  getAppointments,
  postAppointment,
  putAppointment,
  getPreferredCCProvider,
} from '../vaos';
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
  GA_PREFIX,
} from '../../utils/constants';
import { formatFacilityAddress, getFacilityPhone } from '../location';
import {
  transformVAOSAppointment,
  transformVAOSAppointments,
  transformPreferredProviderV2,
} from './transformers.v2';
import { captureError, has400LevelError } from '../../utils/error';
import { resetDataLayer } from '../../utils/events';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneByFacilityId,
  getTimezoneNameFromAbbr,
  getUserTimezone,
  getUserTimezoneAbbr,
  stripDST,
} from '../../utils/timezone';

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
const DEFAULT_VIDEO_STATUS = 'FUTURE';

const PAST_APPOINTMENTS_HIDDEN_SET = new Set([
  'FUTURE',
  'DELETED',
  null,
  '<null>',
  'Deleted',
]);

// We want to throw an error for any partial results errors from MAS,
// but some sites in staging always errors. So, keep those in a list to
// ignore errors from
const BAD_STAGING_SITES = new Set(['556', '612']);
function hasPartialResults(response) {
  return (
    response.errors?.length > 0 &&
    (environment.isProduction() ||
      response.errors.some(err => !BAD_STAGING_SITES.has(err.source)))
  );
}

// Sort the requested appointments, latest appointments appear at the top of the list.
function apptRequestSort(a, b) {
  return new Date(b.created).getTime() - new Date(a.created).getTime();
}

/**
 * Fetch the logged in user's confirmed appointments that fall between a startDate and endDate
 *
 * @export
 * @async
 * @param {String} startDate Date in YYYY-MM-DD format
 * @param {String} endDate Date in YYYY-MM-DD format
 * @param {Boolean} useV2VA Toggle fetching VA appointments via VAOS api services version 2
 * @param {Boolean} useV2CC Toggle fetching CC appointments via VAOS api services version 2
 * @returns {Appointment[]} A FHIR searchset of booked Appointment resources
 */
export async function fetchAppointments({
  startDate,
  endDate,
  useV2VA = false,
  useV2CC = false,
}) {
  try {
    const appointments = [];
    if (useV2VA || useV2CC) {
      const allAppointments = await getAppointments(startDate, endDate, [
        'booked',
        'arrived',
        'fulfilled',
        'cancelled',
      ]);

      const filteredAppointments = allAppointments.filter(appt => {
        if (
          (!useV2VA && appt.kind !== 'cc') ||
          (!useV2CC && appt.kind === 'cc')
        ) {
          return false;
        }
        return !appt.requestedPeriods;
      });
      appointments.push(...transformVAOSAppointments(filteredAppointments));

      if (useV2VA && useV2CC) {
        return appointments;
      }
    }

    if (!useV2VA && !useV2CC) {
      const allAppointments = await Promise.all([
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
      if (hasPartialResults(allAppointments[0])) {
        throw mapToFHIRErrors(
          allAppointments[0].errors,
          'MAS returned partial results',
        );
      }

      appointments.push(
        ...transformConfirmedAppointments([
          ...allAppointments[0].data,
          ...allAppointments[1].data,
        ]),
      );

      return appointments;
    }
    if (!useV2VA) {
      const confirmedVAAppointments = await getConfirmedAppointments(
        'va',
        moment(startDate).toISOString(),
        moment(endDate).toISOString(),
      );
      // We might get partial results back from MAS, so throw an error if we do
      if (hasPartialResults(confirmedVAAppointments)) {
        throw mapToFHIRErrors(
          confirmedVAAppointments.errors,
          'MAS returned partial results',
        );
      }
      appointments.push(
        ...transformConfirmedAppointments(confirmedVAAppointments.data),
      );
    } else if (!useV2CC) {
      const confirmedCCAppointments = await getConfirmedAppointments(
        'cc',
        moment(startDate).toISOString(),
        moment(endDate).toISOString(),
      );
      appointments.push(
        ...transformConfirmedAppointments(confirmedCCAppointments.data),
      );
    }

    return appointments;
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
export async function getAppointmentRequests({
  startDate,
  endDate,
  useV2 = false,
}) {
  try {
    if (useV2) {
      const appointments = await getAppointments(startDate, endDate, [
        'proposed',
        'cancelled',
      ]);

      const requestsWithoutAppointments = appointments.filter(
        appt => !!appt.requestedPeriods,
      );

      requestsWithoutAppointments.sort(apptRequestSort);

      return transformVAOSAppointments(requestsWithoutAppointments);
    }

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
export async function fetchRequestById({ id, useV2 }) {
  try {
    if (useV2) {
      const appointment = await getAppointment(id);

      return transformVAOSAppointment(appointment);
    }

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
 * @param {Boolean} useV2 Toggle fetching VA or CC appointment via VAOS api services version 2
 * @returns {Appointment} A transformed appointment with the given id
 */
export async function fetchBookedAppointment({ id, type, useV2 = false }) {
  try {
    let appointment;

    if (useV2) {
      appointment = await getAppointment(id);
      return transformVAOSAppointment(appointment);
    }

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

      if (!appointment) {
        appointment = await getConfirmedAppointment(id, 'va');
      }
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
  return appointment?.vaos.isPhoneAppointment;
}

/**
 * Returns true if the appointment is a video appointment
 * where the Veteran needs to go to a clinic, rather than stay at home
 *
 * @export
 * @param {Appointment} appointment
 * @returns {boolean} True if appointment is a clinic or store forward appointment
 */
export function isClinicVideoAppointment(appointment) {
  return (
    appointment?.videoData.kind === VIDEO_TYPES.clinic ||
    appointment?.videoData.kind === VIDEO_TYPES.storeForward
  );
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
    appointment?.vaos.appointmentType === APPOINTMENT_TYPES.vaAppointment &&
    !isClinicVideoAppointment(appointment)
  ) {
    // 612 doesn't exist in the facilities api, but it's a valid VistA site
    // So, we want to show the facility information for the actual parent location
    // in that system, which is 612A4. This is really only visible for at home
    // video appointments, as the facility we direct users to in order to cancel
    if (appointment.location.vistaId === '612') {
      return '612A4';
    }

    return appointment?.location.vistaId;
  }

  return appointment?.location.stationId;
}

/**
 * Returns the NPI of a CC Provider
 *
 * @export
 * @param {Appointment} appointment A FHIR appointment resource
 * @returns {string} The NPI of the CC Provider
 */
export function getPreferredCCProviderNPI(appointment) {
  return appointment?.practitioners[0]?.identifier[0]?.value || null;
}

/**
 * Returns the patient telecom info in a VA appointment
 *
 * @export
 * @param {Appointment} appointment A FHIR appointment resource
 * @param {string} system A FHIR telecom system id
 * @returns {string} The patient telecom value
 */
export function getPatientTelecom(appointment, system) {
  return appointment?.contact?.telecom.find(t => t.system === system)?.value;
}

/**
 * Returns whether or not the facility has a COVID vaccine phone line
 *
 * @export
 * @param {Object} facility A facility resource
 * @returns {Boolean} Whether or not the facility has a COVID vaccine phone line
 */
export function hasValidCovidPhoneNumber(facility) {
  return !!facility?.telecom?.find(tele => tele.system === 'covid')?.value;
}

/**
 * Checks to see if an appointment should be shown in the past appointment
 * list
 *
 * @param {Appointment} appt A FHIR appointment resource
 * @returns {boolean} Whether or not the appt should be shown
 */
export function isValidPastAppointment(appt) {
  return (
    CONFIRMED_APPOINTMENT_TYPES.has(appt.vaos.appointmentType) &&
    appt.status !== APPOINTMENT_STATUS.cancelled &&
    // Show confirmed appointments that don't have vista statuses in the exclude
    // list
    (!PAST_APPOINTMENTS_HIDDEN_SET.has(appt.description) ||
      // Show video appointments that have the default FUTURE status,
      // since we can't infer anything about the video appt from that status
      (appt.videoData?.isVideo && appt.description === DEFAULT_VIDEO_STATUS) ||
      // Some CC appointments can have a null status because they're not from VistA
      // And we want to show those
      (appt.vaos.appointmentType === APPOINTMENT_TYPES.ccAppointment &&
        !appt.description))
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
    !appt.vaos.isExpressCare &&
    (appt.status === APPOINTMENT_STATUS.proposed ||
      appt.status === APPOINTMENT_STATUS.pending ||
      (appt.status === APPOINTMENT_STATUS.cancelled && hasValidDate))
  );
}
/**
 * Returns cancelled and pending requests, which should be visible to users
 *
 * @export
 * @param {Appointment} appt The appointment to check
 * @returns {Boolean} If the appointment should be shown or not
 */
export function isPendingOrCancelledRequest(appt) {
  return (
    !appt.vaos.isExpressCare &&
    (appt.status === APPOINTMENT_STATUS.proposed ||
      appt.status === APPOINTMENT_STATUS.pending ||
      appt.status === APPOINTMENT_STATUS.cancelled)
  );
}

/**
 * Returns true if the given Appointment is a confirmed appointment
 *
 * @export
 * @param {Appointment} appt The FHIR Appointment to check
 * @returns {boolean} Whether or not the appointment is a valid upcoming
 *  appointment
 */
export function isUpcomingAppointment(appt) {
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

  return false;
}

/**
 * Returns true if the given Appointment is a canceled confirmed appointment
 *
 * @export
 * @param {Appointment} appt The FHIR Appointment to check
 * @returns {boolean} Whether or not the appointment is a canceled
 *  appointment
 */
export function isCanceledConfirmed(appt) {
  const today = moment();

  if (CONFIRMED_APPOINTMENT_TYPES.has(appt.vaos.appointmentType)) {
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
  const { isAtlas, kind } = appointment?.videoData || {};
  return (
    !isAtlas && (kind === VIDEO_TYPES.mobile || kind === VIDEO_TYPES.adhoc)
  );
}

/**
 * Method to get patient video instruction
 * @param {Appointment} appointment A FHIR appointment resource
 * @return {string} Returns patient video instruction title and exclude remaining data
 */

export function getPatientInstruction(appointment) {
  if (appointment?.patientInstruction.includes('Medication Review')) {
    return 'Medication Review';
  }
  if (appointment?.patientInstruction.includes('Video Visit Preparation')) {
    return 'Video Visit Preparation';
  }
  return null;
}

/**
 * Get the name of the first preferred community care provider, or generic text
 *
 * @param {Appointment} appointment An appointment object
 * @return {String} Returns the community care provider name
 */
export function getPreferredCommunityCareProviderName(appointment) {
  const provider = appointment?.preferredCommunityCareProviders?.[0];

  if (provider) {
    return provider.practiceName || provider.providerName;
  }

  return 'Community care';
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

/**
 * Creates an appointment through the v2 api and transforms the result
 * back into our Appointment format
 *
 * @export
 * @param {Object} params
 * @param {VAOSAppointment} params.appointment The appointment to send
 * @returns {Appointment} The created appointment
 */
export async function createAppointment({ appointment }) {
  const result = await postAppointment(appointment);

  return transformVAOSAppointment(result);
}

const eventPrefix = `${GA_PREFIX}-cancel-appointment-submission`;
const CANCELLED_REQUEST = 'Cancelled';
async function cancelRequestedAppointment(request) {
  const additionalEventData = {
    appointmentType: 'pending',
    facilityType: request.vaos?.isCommunityCare ? 'cc' : 'va',
  };

  recordEvent({
    event: eventPrefix,
    ...additionalEventData,
  });

  try {
    const updatedRequest = await updateRequest({
      ...request.vaos.apiData,
      status: CANCELLED_REQUEST,
      appointmentRequestDetailCode: ['DETCODE8'],
    });

    recordEvent({
      event: `${eventPrefix}-successful`,
      ...additionalEventData,
    });
    resetDataLayer();

    return transformPendingAppointment(updatedRequest);
  } catch (e) {
    captureError(e, true);
    recordEvent({
      event: `${eventPrefix}-failed`,
      ...additionalEventData,
    });
    resetDataLayer();

    throw e;
  }
}

async function cancelV2Appointment(appointment) {
  const additionalEventData = {
    appointmentType:
      appointment.status === APPOINTMENT_STATUS.proposed
        ? 'pending'
        : 'confirmed',
    facilityType: appointment.vaos?.isCommunityCare ? 'cc' : 'va',
  };

  recordEvent({
    event: eventPrefix,
    ...additionalEventData,
  });

  try {
    const updatedAppointment = await putAppointment(appointment.id, {
      status: APPOINTMENT_STATUS.cancelled,
    });

    recordEvent({
      event: `${eventPrefix}-successful`,
      ...additionalEventData,
    });
    resetDataLayer();

    return transformVAOSAppointment(updatedAppointment);
  } catch (e) {
    captureError(e, true);
    recordEvent({
      event: `${eventPrefix}-failed`,
      ...additionalEventData,
    });
    resetDataLayer();

    throw e;
  }
}

const UNABLE_TO_KEEP_APPT = '5';
const VALID_CANCEL_CODES = new Set(['4', '5', '6']);
async function cancelBookedAppointment(appointment) {
  const additionalEventData = {
    appointmentType: 'confirmed',
    facilityType: 'va',
  };

  recordEvent({
    event: eventPrefix,
    ...additionalEventData,
  });
  let cancelReasons;
  let cancelReason;

  try {
    const cancelData = {
      appointmentTime: moment
        .parseZone(appointment.start)
        .format('MM/DD/YYYY HH:mm:ss'),
      clinicId: appointment.location.clinicId,
      facilityId: appointment.location.vistaId,
      remarks: '',
      // Grabbing this from the api data because it's not clear if
      // we have to send the real name or if the friendly name is ok
      clinicName: appointment.vaos.apiData.vdsAppointments[0].clinic.name,
      cancelCode: 'PC',
    };

    cancelReasons = await getCancelReasons(appointment.location.vistaId);

    if (cancelReasons.some(reason => reason.number === UNABLE_TO_KEEP_APPT)) {
      cancelReason = UNABLE_TO_KEEP_APPT;
      await updateAppointment({
        ...cancelData,
        cancelReason,
      });
    } else if (
      cancelReasons.some(reason => VALID_CANCEL_CODES.has(reason.number))
    ) {
      cancelReason = cancelReasons.find(reason =>
        VALID_CANCEL_CODES.has(reason.number),
      );
      await updateAppointment({
        ...cancelData,
        cancelReason: cancelReason.number,
      });
    } else {
      throw new Error('Unable to find valid cancel reason');
    }

    recordEvent({
      event: `${eventPrefix}-successful`,
      ...additionalEventData,
    });
    resetDataLayer();
  } catch (e) {
    const isVaos400Error = has400LevelError(e);
    if (isVaos400Error) {
      Sentry.withScope(scope => {
        scope.setExtra('error', e);
        scope.setExtra('cancelReasons', cancelReasons);
        scope.setExtra('cancelReason', cancelReason);
        Sentry.captureMessage('Cancel failed due to bad request');
      });
    } else {
      captureError(e, true);
    }

    recordEvent({
      event: `${eventPrefix}-failed`,
      ...additionalEventData,
    });
    resetDataLayer();

    throw e;
  }
}
/**
 * Cancels an appointment or request
 *
 * @export
 * @param {Object} params
 * @param {Appointment} params.appointment The appointment to cancel
 * @param {boolean} params.useV2 Use the vaos/v2 endpoint to cancel the appointment
 * @returns {?Appointment} Returns either null or the updated appointment data
 */
export async function cancelAppointment({ appointment, useV2 = false }) {
  const isConfirmedAppointment =
    appointment.vaos?.appointmentType === APPOINTMENT_TYPES.vaAppointment;

  if (useV2) {
    return cancelV2Appointment(appointment);
  }
  if (isConfirmedAppointment) {
    return cancelBookedAppointment(appointment);
  }
  return cancelRequestedAppointment(appointment);
}

/**
 * Get the provider name based on api version
 *
 *
 * @export
 * @param {Object} appointment an appointment object
 * @returns {String} Returns the provider first and last name
 */
export function getProviderName(appointment) {
  if (appointment.version === 1) {
    const { providerName } = appointment.communityCareProvider;
    return providerName;
  }

  if (appointment.practitioners !== undefined) {
    const providers = appointment.practitioners
      .filter(person => !!person.name)
      .map(person => `${person.name.given.join(' ')} ${person.name.family} `);
    if (providers.length > 0) {
      return providers;
    }
    return null;
  }
  return null;
}

/**
 * Get scheduled appointment information needed for generating
 * an .ics file.
 *
 * @export
 * @param {Appointment} Appointment object, facility object
 * @param {Facility} Facility object
 * @returns An object containing appointment information.
 */
export function getCalendarData({ appointment, facility }) {
  let data = {};
  const isAtlas = appointment?.videoData.isAtlas;
  const isHome = isVideoHome(appointment);
  const videoKind = appointment?.videoData.kind;
  const isVideo = appointment?.vaos.isVideo;
  const isCommunityCare = appointment?.vaos.isCommunityCare;
  const isPhone = isVAPhoneAppointment(appointment);
  const isInPersonVAAppointment = !isVideo && !isCommunityCare && !isPhone;
  const signinText =
    'Sign in to https://va.gov/health-care/schedule-view-va-appointments/appointments to get details about this appointment';

  if (isPhone) {
    data = {
      summary: 'Phone appointment',
      providerName: facility?.name,
      location: formatFacilityAddress(facility),
      text: `A provider will call you at ${moment
        .parseZone(appointment.start)
        .format('h:mm a')}`,
      phone: getFacilityPhone(facility),
      additionalText: [signinText],
    };
  } else if (isInPersonVAAppointment) {
    data = {
      summary: `Appointment at ${facility?.name || 'the VA'}`,
      location: formatFacilityAddress(facility),
      text: `You have a health care appointment at ${facility?.name ||
        'a VA location.'}`,
      phone: getFacilityPhone(facility),
      additionalText: [signinText],
    };
  } else if (isCommunityCare) {
    let { practiceName } = appointment.communityCareProvider || {};
    const providerName = getProviderName(appointment);
    let summary = 'Community care appointment';
    practiceName = practiceName?.trim().length ? practiceName : '';
    if (!!practiceName || !!providerName) {
      // order of the name appearing on the calendar title is important to match the display screen name
      summary =
        appointment.version === 1
          ? `Appointment at ${providerName || practiceName}`
          : `Appointment at ${providerName[0] || practiceName}`;
    }
    data = {
      summary,
      providerName:
        providerName !== undefined ? `${providerName || practiceName}` : null,
      location: formatFacilityAddress(appointment?.communityCareProvider),
      text:
        'You have a health care appointment with a community care provider. Please don’t go to your local VA health facility.',
      phone: getFacilityPhone(appointment?.communityCareProvider),
      additionalText: [signinText],
    };
  } else if (isVideo) {
    const providerName = appointment.videoData?.providers
      ? appointment.videoData.providers[0]?.display
      : '';
    const providerText = providerName
      ? `You'll be meeting with ${providerName}`
      : '';

    if (isHome) {
      data = {
        summary: 'VA Video Connect appointment',
        text:
          'You can join this meeting up to 30 minutes before the start time.',
        location: 'VA Video Connect at home',
        additionalText: [signinText],
      };
    } else if (isAtlas) {
      const { atlasLocation } = appointment.videoData;

      if (atlasLocation?.address) {
        data = {
          summary: `VA Video Connect appointment at an ATLAS facility`,
          location: formatFacilityAddress(atlasLocation),
          text: 'Join this video meeting from this ATLAS (non-VA) location:',
          additionalText: [
            `Your appointment code is ${
              appointment.videoData.atlasConfirmationCode
            }. Use this code to find your appointment on the computer at the ATLAS facility.`,
          ],
        };

        if (providerName)
          data.additionalText.push(`You'll be meeting with ${providerName}`);
      }
    } else if (isClinicVideoAppointment(appointment)) {
      data = {
        summary: `VA Video Connect appointment at ${facility?.name ||
          'a VA location'}`,
        providerName: facility?.name,
        location: formatFacilityAddress(facility),
        text: `You need to join this video meeting from${
          facility
            ? ':'
            : ' the VA location where you scheduled the appointment.'
        }`,
        phone: getFacilityPhone(facility),
      };

      if (providerName) data.additionalText = [providerText, signinText];
      else data.additionalText = [signinText];
    } else if (videoKind === VIDEO_TYPES.gfe) {
      data = {
        summary: 'VA Video Connect appointment using a VA device',
        location: '',
        text: 'Join this video meeting using a device provided by VA.',
      };

      if (providerName) data.additionalText = [providerText];
    }
  }

  return data;
}

/**
 * Returns an object with timezone identifiers for a given appointment
 *
 * @export
 * @param {Appointment} appointment The appointment to get a timezone for
 * @returns {Object} An object with:
 *   - identifier: The full timezone identifier (like America/New_York)
 *   - abbreviation: The timezone abbreviation (e.g. ET)
 *   - description: The written out description (e.g. Eastern time)
 */
export function getAppointmentTimezone(appointment) {
  // Most VA appointments will use this, since they're associated with a facility
  if (appointment.location.vistaId) {
    const locationId =
      appointment.location.stationId || appointment.location.vistaId;
    const abbreviation = getTimezoneAbbrByFacilityId(locationId);

    return {
      identifier: moment.tz
        .zone(getTimezoneByFacilityId(locationId))
        ?.abbr(appointment.start),
      abbreviation,
      description: getTimezoneNameFromAbbr(abbreviation),
    };
  }

  // Community Care appointments with timezone included
  if (appointment.vaos.timeZone) {
    const abbreviation = stripDST(
      appointment.vaos.timeZone?.split(' ')?.[1] || appointment.vaos.timeZone,
    );

    return {
      identifier: null,
      abbreviation,
      description: getTimezoneNameFromAbbr(abbreviation),
    };
  }

  // Everything else will use the local timezone
  const abbreviation = stripDST(getUserTimezoneAbbr());
  return {
    identifier: getUserTimezone(),
    abbreviation,
    description: getTimezoneNameFromAbbr(abbreviation),
  };
}

/**
 * Fetch provider information
 *
 * @export
 * @param {String} providerNpi An id for the provider to fetch info for
 * @returns {transformed Provider} transformed Provider info
 */
export async function fetchPreferredProvider(providerNpi) {
  const prov = await getPreferredCCProvider(providerNpi);
  return transformPreferredProviderV2(prov);
}
