/* eslint-disable camelcase */
/**
 * Functions related to fetching Apppointment data and pulling information from that data
 * @module services/Appointment
 */
import moment from 'moment-timezone';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  getAppointment,
  getAppointments,
  postAppointment,
  putAppointment,
} from '../vaos';
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
} from './transformers';
import { captureError } from '../../utils/error';
import { resetDataLayer } from '../../utils/events';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneByFacilityId,
  getTimezoneNameFromAbbr,
  getUserTimezone,
  getUserTimezoneAbbr,
  stripDST,
} from '../../utils/timezone';
import { getProviderName } from '../../utils/appointment';

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
// const BAD_STAGING_SITES = new Set(['556', '612']);
// function hasPartialResults(response) {
//   return (
//     response.errors?.length > 0 &&
//     (environment.isProduction() ||
//       response.errors.some(err => !BAD_STAGING_SITES.has(err.source)))
//   );
// }

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
export async function fetchAppointments({ startDate, endDate }) {
  try {
    const appointments = [];
    const allAppointments = await getAppointments(startDate, endDate, [
      'booked',
      'arrived',
      'fulfilled',
      'cancelled',
    ]);

    const filteredAppointments = allAppointments.data.filter(appt => {
      return !appt.requestedPeriods;
    });

    appointments.push(...transformVAOSAppointments(filteredAppointments), {
      meta: allAppointments.backendSystemFailures,
    });

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
export async function getAppointmentRequests({ startDate, endDate }) {
  try {
    const appointments = await getAppointments(startDate, endDate, [
      'proposed',
      'cancelled',
    ]);

    const requestsWithoutAppointments = appointments.data.filter(
      appt => !!appt.requestedPeriods,
    );

    requestsWithoutAppointments.sort(apptRequestSort);

    const transformRequests = transformVAOSAppointments(
      requestsWithoutAppointments,
    );

    transformRequests.push({
      meta: appointments.backendSystemFailures,
    });

    return transformRequests;
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
export async function fetchRequestById({ id }) {
  try {
    const appointment = await getAppointment(id);

    return transformVAOSAppointment(appointment);
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
 * @param {Boolean} useV2 Toggle fetching VA or CC appointment via VAOS api services version 2
 * @returns {Appointment} A transformed appointment with the given id
 */
export async function fetchBookedAppointment({ id }) {
  try {
    const appointment = await getAppointment(id);
    return transformVAOSAppointment(appointment);
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
  if (appointment === undefined) return null;

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
    !appt.vaos?.isExpressCare &&
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

  if (CONFIRMED_APPOINTMENT_TYPES.has(appt.vaos?.appointmentType)) {
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
 * Groups appointments by month into an array of objects with appointment start
 * date as the key.
 * Assumes appointments are already sorted
 *
 * @export
 * @param {Appointment[]} appointments List of FHIR appointments
 * @returns {Array} An array of objects grouped by month
 */
export function groupAppointmentsByMonth(appointments) {
  if (appointments.length === 0) {
    return [];
  }

  return appointments.reduce((previous, current) => {
    const key = moment(current.start).format('YYYY-MM');
    // eslint-disable-next-line no-param-reassign
    previous[key] = previous[key] || [];
    previous[key].push(current);
    return previous;
  }, {});
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

/**
 * Cancels an appointment or request
 *
 * @export
 * @param {Object} params
 * @param {Appointment} params.appointment The appointment to cancel
 * @returns {?Appointment} Returns either null or the updated appointment data
 */
export async function cancelAppointment({ appointment }) {
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

export function isInPersonVAAppointment(appointment) {
  const { isCommunityCare, isVideo } = appointment?.vaos || {};
  const isPhone = isVAPhoneAppointment(appointment);

  return !isVideo && !isCommunityCare && !isPhone;
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
  // const isInPersonVAAppointment = !isVideo && !isCommunityCare && !isPhone;
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
  } else if (isInPersonVAAppointment(appointment)) {
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

export const getLongTermAppointmentHistoryV2 = ((chunks = 1) => {
  const batch = [];
  let promise = null;

  return () => {
    if (!promise || navigator.userAgent === 'node.js') {
      // Creating an array of start and end dates for each chunk
      const ranges = Array.from(Array(chunks).keys()).map(i => {
        return {
          start: moment()
            .startOf('day')
            .subtract(i + 1, 'year')
            .utc()
            .format(),

          end: moment()
            .startOf('day')
            .subtract(i, 'year')
            .utc()
            .format(),
        };
      });

      // There are three chunks with date ranges from the array created above.
      // We're trying to run them serially, because we want to be careful about
      // overloading the upstream service, so Promise.all doesn't fit here.
      promise = ranges.reduce(async (prev, curr) => {
        // NOTE: This is the secret sauce to run the fetch requests sequentially.
        // Doing an 'await' on a non promise wraps it into a promise that is then awaited.
        // In this case, the initial value of previous is set to an empty array.
        //
        // NOTE: fetchAppointments will run concurrently without this await 1st!
        await prev;

        // Next, fetch the appointments which will be chained which the previous await
        const p1 = await fetchAppointments({
          startDate: curr.start,
          endDate: curr.end,
          useV2VA: true,
          useV2CC: true,
        });
        batch.push(p1);
        return Promise.resolve([...batch].flat());
      }, []);
    }

    return promise;
  };
})(3);

/**
 * Function to return appointment date. Date is return with conversion to locale
 * timezone.
 *
 * @export
 * @param {*} appointment
 * @returns Appointment date
 */
export function getAppointmentDate(appointment) {
  return moment.parseZone(appointment.start);
}

export function groupAppointmentByDay(appointments) {
  return appointments.reduce((previous, current) => {
    const key = moment(current.start).format('YYYY-MM-DD');
    // eslint-disable-next-line no-param-reassign
    previous[key] = previous[key] || [];
    previous[key].push(current);
    return previous;
  }, {});
}

export function getLink({ featureBreadcrumbUrlUpdate, appointment }) {
  const { isCommunityCare, isPastAppointment } = appointment.vaos;

  if (!featureBreadcrumbUrlUpdate) {
    return isCommunityCare
      ? `${isPastAppointment ? '/past' : ''}/cc/${appointment.id}`
      : `${isPastAppointment ? '/past' : ''}/va/${appointment.id}`;
  }
  return `${isPastAppointment ? 'past' : ''}/${appointment.id}`;
}

export function getPractitionerName(appointment) {
  const { practitioners } = appointment;

  if (!practitioners?.length) return null;

  const practitioner = practitioners[0];
  const { name } = practitioner;

  return `${name.given.toString().replaceAll(',', ' ')} ${name.family}`;
}

export function getVideoAppointmentLocationText(appointment) {
  const { isAtlas } = appointment.videoData;
  const videoKind = appointment.videoData.kind;
  let desc = 'Video appointment at home';

  if (isAtlas) {
    desc = 'Video appointment at an ATLAS location';
  } else if (isClinicVideoAppointment(appointment)) {
    desc = 'Video appointment at a VA location';
  } else if (videoKind === VIDEO_TYPES.gfe) {
    desc = 'Video with VA device';
  }

  return desc;
}

// TODO: Verify if isCanceledConfirmed can be used
export function isCanceled(appointment) {
  return appointment.status === APPOINTMENT_STATUS.cancelled;
}

export function getLabelText(appointment) {
  const appointmentDate = getAppointmentDate(appointment);

  return `Details for ${
    isCanceled(appointment) ? 'canceled ' : ''
  }appointment on ${appointmentDate.format('dddd, MMMM D h:mm a')}`;
}
