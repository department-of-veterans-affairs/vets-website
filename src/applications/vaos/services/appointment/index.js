/* eslint-disable camelcase */
/**
 * Functions related to fetching Apppointment data and pulling information from that data
 * @module services/Appointment
 */
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { isAfter, isBefore, parseISO, startOfDay, subYears } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getProviderName } from '../../utils/appointment';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  GA_PREFIX,
} from '../../utils/constants';
import { captureError } from '../../utils/error';
import { resetDataLayer } from '../../utils/events';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneAbbrFromApi,
  getTimezoneNameFromAbbr,
  getUserTimezoneAbbr,
  stripDST,
} from '../../utils/timezone';
import { formatFacilityAddress, getFacilityPhone } from '../location';
import { mapToFHIRErrors } from '../utils';
import {
  getAppointment,
  getAppointments,
  postAppointment,
  putAppointment,
} from '../vaos';
import {
  getAppointmentType,
  transformVAOSAppointment,
  transformVAOSAppointments,
} from './transformers';

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

// Sort the requested appointments, latest appointments appear at the top of the list.
function apptRequestSort(a, b) {
  return new Date(b.created).getTime() - new Date(a.created).getTime();
}

/**
 * Fetch the logged in user's confirmed appointments that fall between a startDate and endDate
 *
 * @export
 * @async
 * @param {Object} params
 * @param {Date} params.startDate Date in YYYY-MM-DD format
 * @param {Date} params.endDate Date in YYYY-MM-DD format
 * @param {Boolean} params.fetchClaimStatus Boolean to fetch travel claim data
 * @param {Boolean} params.includeEPS Boolean to include EPS appointments
 * @param {boolean?} params.featureUseBrowserTimezone Feature flag. Default = false.
 * @returns {Promise <Object>[]} A FHIR searchset of booked Appointment resources
 */
export async function fetchAppointments({
  startDate,
  endDate,
  avs = false,
  fetchClaimStatus = false,
  includeEPS = false,
  featureUseBrowserTimezone = false,
}) {
  try {
    const appointments = [];
    const allAppointments = await getAppointments({
      startDate,
      endDate,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      avs,
      fetchClaimStatus,
      includeEPS,
    });

    const filteredAppointments = allAppointments.data.filter(appt => {
      // Filter out appointments that are not VA or CC appointments
      return (
        getAppointmentType(appt) === APPOINTMENT_TYPES.vaAppointment ||
        getAppointmentType(appt) === APPOINTMENT_TYPES.ccAppointment
      );
    });

    appointments.push(
      ...transformVAOSAppointments(
        filteredAppointments,
        featureUseBrowserTimezone,
      ),
      {
        meta: allAppointments.backendSystemFailures,
      },
    );

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
 * @param {Object} params
 * @param {Date} params.startDate Date in YYYY-MM-DD format
 * @param {Date} params.endDate Date in YYYY-MM-DD format
 * @param {Boolean} params.includeEPS Boolean to include EPS appointments
 * @param {boolean?} params.featureUseBrowserTimezone Feature flag. Default = false.
 * @returns {Promise Appointment[]} A FHIR searchset of pending Appointment resources
 */
export async function getAppointmentRequests({
  startDate,
  endDate,
  includeEPS = false,
  featureUseBrowserTimezone,
}) {
  try {
    const appointments = await getAppointments({
      startDate,
      endDate,
      statuses: ['proposed', 'cancelled'],
      includeEPS,
      featureUseBrowserTimezone,
    });

    const requestsWithoutAppointments = appointments.data.filter(appt => {
      // Filter out appointments that are not requests
      return appt.pending;
    });

    requestsWithoutAppointments.sort(apptRequestSort);

    const transformRequests = transformVAOSAppointments(
      requestsWithoutAppointments,
      featureUseBrowserTimezone,
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
 * @param {Object} params
 * @param {string} params.id Appointment request id
 * @param {boolean?} params.featureUseBrowserTimezone Feature flag. Default = false.
 * @returns {Promise<Object>} An Appointment object for the given request id
 */
export async function fetchRequestById({
  id,
  featureUseBrowserTimezone = false,
}) {
  try {
    const appointment = await getAppointment(id);

    return transformVAOSAppointment(appointment, featureUseBrowserTimezone);
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
 * @param {Object} params
 * @param {string} params.id MAS or community care booked appointment id
 * @param {boolean} params.avs to fetch avs data
 * @param {boolean} params.fetchClaimStatus Boolean to fetch travel claim data
 * @returns {Promise<Object>} A transformed appointment with the given id
 */
export async function fetchBookedAppointment({
  id,
  avs = true,
  fetchClaimStatus = true,
  featureUseBrowserTimezone = false,
}) {
  try {
    const appointment = await getAppointment(id, avs, fetchClaimStatus);
    return transformVAOSAppointment(appointment, featureUseBrowserTimezone);
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
  return appointment?.vaos.isVideoAtVA;
}

/**
 * Returns true if the appointment is a video appointment
 * at an ATLAS location
 *
 * @export
 * @param {Appointment} appointment
 * @returns {boolean} True if appointment is a video appointment at ATLAS location
 */
export function isAtlasVideoAppointment(appointment) {
  return appointment?.vaos?.isAtlas;
}

/**
 * Method to check for home video appointment
 * @param {Appointment} appointment A FHIR appointment resource
 * @return {boolean} Returns whether or not the appointment is a home video appointment.
 */
export function isVideoAtHome(appointment) {
  return appointment?.vaos?.isVideoAtHome;
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
    !isClinicVideoAppointment(appointment) &&
    appointment.location.vistaId === '612'
  ) {
    // 612 doesn't exist in the facilities api, but it's a valid VistA site
    // So, we want to show the facility information for the actual parent location
    // in that system, which is 612A4. This is really only visible for at home
    // video appointments, as the facility we direct users to in order to cancel
    return '612A4';
  }

  return appointment?.location?.stationId;
}
/**
 * Returns the patient telecom info in a VA appointment
 *
 * @export
 * @param {Appointment} appointment A FHIR appointment resource
 * @param {string} type A FHIR telecom type id
 * @returns {string} The patient telecom value
 */
export function getPatientTelecom(appointment, type) {
  return appointment?.contact?.telecom.find(t => t.type === type)?.value;
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
 * Checks if an appointment should be shown in the past appointment list
 * - Show appointments that don't have vista statuses in the exclude list
 * - Show video appointments that have the default FUTURE status
 * - Show CC appointments that have a null description status,
 *    because these appointments are not from VistA, but we want to show them
 *
 * @param {Appointment} appt A FHIR appointment resource
 * @returns {boolean} Whether or not the appt should be shown
 */
export function isValidPastAppointment(appt) {
  const isConfirmedAppointment = CONFIRMED_APPOINTMENT_TYPES.has(
    appt.vaos.appointmentType,
  );
  const isNotInHiddenList = !PAST_APPOINTMENTS_HIDDEN_SET.has(appt.description);
  const isVideoWithDefaultStatus =
    appt.videoData?.isVideo && appt.description === DEFAULT_VIDEO_STATUS;
  const isCommunityCareWithNullDescription =
    appt.vaos.appointmentType === APPOINTMENT_TYPES.ccAppointment &&
    !appt.description;

  return (
    isConfirmedAppointment &&
    (isNotInHiddenList ||
      isVideoWithDefaultStatus ||
      isCommunityCareWithNullDescription)
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
    return (
      !FUTURE_APPOINTMENTS_HIDDEN_SET.has(appt.description) &&
      appt.vaos.isUpcomingAppointment
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
  return isAfter(a.start, b.start) ? -1 : 1;
}

/**
 * Sort method for upcoming appointments
 * @param {Appointment} a A FHIR appointment resource
 * @param {Appointment} b A FHIR appointment resource
 */
export function sortByDateAscending(a, b) {
  return isBefore(a.start, b.start) ? -1 : 1;
}

/**
 * Sort method for appointments requests
 * @param {Appointment} a A FHIR appointment resource
 * @param {Appointment} b A FHIR appointment resource
 */
export function sortByCreatedDateDescending(a, b) {
  return isAfter(parseISO(a.created), parseISO(b.created)) ? -1 : 1;
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
    const key = formatInTimeZone(current.start, current.timezone, 'yyyy-MM');
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
 * @param {boolean?} params.featureUseBrowserTimezone Feature flag. Default = false.
 * @returns {Promise<Object>} The created appointment
 */
export async function createAppointment({
  appointment,
  featureUseBrowserTimezone = false,
}) {
  const result = await postAppointment(appointment);

  return transformVAOSAppointment(result, featureUseBrowserTimezone);
}

const eventPrefix = `${GA_PREFIX}-cancel-appointment-submission`;

/**
 * Cancels an appointment or request
 *
 * @export
 * @param {Object} params
 * @param {Appointment} params.appointment The appointment to cancel
 * @param {boolean?} params.featureUseBrowserTimezone Feature flag. Default = false.
 * @returns {Promise<Object>} Returns either null or the updated appointment data
 */
export async function cancelAppointment({
  appointment,
  featureUseBrowserTimezone = false,
}) {
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

    return transformVAOSAppointment(
      updatedAppointment,
      featureUseBrowserTimezone,
    );
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

export function isInPersonVisit(appointment) {
  return appointment?.vaos?.isInPersonVisit;
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
  const isAtlas = isAtlasVideoAppointment(appointment);
  const isHome = isVideoAtHome(appointment);
  const isVideo = appointment?.vaos.isVideo;
  const isCommunityCare = appointment?.vaos.isCommunityCare;
  const isPhone = isVAPhoneAppointment(appointment);
  const signinText =
    'Sign in to https://va.gov/my-health/appointments/ to get details about this appointment';

  if (isPhone) {
    data = {
      summary: 'Phone appointment',
      providerName: facility?.name,
      location: formatFacilityAddress(facility),
      text: `A provider will call you at ${formatInTimeZone(
        appointment.start,
        appointment.timezone,
        'h:mm aaaa',
      )}`,
      phone: getFacilityPhone(facility),
      additionalText: [signinText],
    };
  } else if (isInPersonVisit(appointment)) {
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
          : `Appointment at ${(providerName || [])[0] || practiceName}`;
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
export function getAppointmentTimezone(
  appointment,
  isUseBrowserTimezone = false,
) {
  // Appointments with timezone included in api
  if (appointment?.timezone) {
    const abbreviation = getTimezoneAbbrFromApi(appointment);

    return {
      identifier: appointment.timezone,
      abbreviation,
      description: getTimezoneNameFromAbbr(abbreviation),
    };
  }
  // Fallback to getting Timezone from facility Id and hardcoded timezone Json.
  if (appointment?.location?.vistaId) {
    const locationId =
      appointment?.location.stationId || appointment?.location.vistaId;
    const abbreviation = getTimezoneAbbrByFacilityId(
      locationId,
      isUseBrowserTimezone,
    );

    return {
      abbreviation,
      description: getTimezoneNameFromAbbr(abbreviation),
    };
  }

  // Everything else will use the local timezone
  const abbreviation = stripDST(getUserTimezoneAbbr());
  return {
    abbreviation,
    description: getTimezoneNameFromAbbr(abbreviation),
  };
}

export const getLongTermAppointmentHistoryV2 = ((chunks = 1) => {
  const batch = [];
  let promise = null;

  return (featureUseBrowserTimezone = false) => {
    if (!promise || navigator.userAgent === 'node.js') {
      // Creating an array of start and end dates for each chunk
      const ranges = Array.from(Array(chunks).keys()).map(i => {
        return {
          start: subYears(startOfDay(new Date()), i + 1),
          end: subYears(startOfDay(new Date()), i),
          featureUseBrowserTimezone,
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
          featureUseBrowserTimezone,
        });
        batch.push(p1);
        return Promise.resolve([...batch].flat());
      }, []);
    }

    return promise;
  };
})(3);

export function groupAppointmentByDay(appointments) {
  return appointments.reduce((previous, current) => {
    const key = formatInTimeZone(current.start, current.timezone, 'yyyy-MM-dd');
    // eslint-disable-next-line no-param-reassign
    previous[key] = previous[key] || [];
    previous[key].push(current);
    return previous;
  }, {});
}

export function getLink({ appointment }) {
  const { isPastAppointment } = appointment.vaos;
  const ccEps = appointment.modality === 'communityCareEps';

  return `${isPastAppointment && !ccEps ? 'past' : ''}/${appointment.id}${
    ccEps ? '?eps=true' : ''
  }`;
}

export function getPractitionerName(appointment) {
  const { practitioners } = appointment;

  if (!practitioners?.length) return null;

  const practitioner = practitioners[0];
  const { name } = practitioner;

  return `${name.given.toString().replaceAll(',', ' ')} ${name.family}`;
}

export function getVideoAppointmentLocationText(appointment) {
  const isAtlas = isAtlasVideoAppointment(appointment);
  let desc = 'Video appointment at home';

  if (isAtlas) {
    desc = 'Video appointment at an ATLAS location';
  } else if (isClinicVideoAppointment(appointment)) {
    desc = 'Video appointment at a VA location';
  }

  return desc;
}

// TODO: Verify if isCanceledConfirmed can be used
export function isCanceled(appointment) {
  return appointment.status === APPOINTMENT_STATUS.cancelled;
}
