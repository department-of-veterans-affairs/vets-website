/**
 * @module services/Appointment/transformers
 */
import moment from '../../lib/moment-tz';

import { APPOINTMENT_STATUS, APPOINTMENT_TYPES } from '../../utils/constants';
import { getTimezoneByFacilityId } from '../../utils/timezone';
import {
  transformATLASLocation,
  transformCommunityProvider,
} from '../location/transformers';

import {
  CANCELLED_APPOINTMENT_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
} from '../../utils/appointment';

/**
 * Determines what type of appointment a VAR appointment object is depending on
 * the existence of certain fields
 *
 * @param {Object} appt VAR appointment object
 * @returns {String} Appointment type
 */
function getAppointmentType(appt) {
  if (appt.typeOfCareId?.startsWith('CC')) {
    return APPOINTMENT_TYPES.ccRequest;
  }
  if (appt.typeOfCareId) {
    return APPOINTMENT_TYPES.request;
  }
  if (appt.vvsAppointments?.length || (appt.clinicId && !appt.communityCare)) {
    return APPOINTMENT_TYPES.vaAppointment;
  }
  if (appt.appointmentTime || appt.communityCare === true) {
    return APPOINTMENT_TYPES.ccAppointment;
  }

  return null;
}

/**
 * Returns whether or not an appointment or request is a community care
 *
 * @param {Object} appt VAR appointment object
 * @returns {Boolean}
 */
function isCommunityCare(appt) {
  const apptType = getAppointmentType(appt);
  return (
    apptType === APPOINTMENT_TYPES.ccRequest ||
    apptType === APPOINTMENT_TYPES.ccAppointment
  );
}

/**
 * Returns whether or not a confirmed VA appointment is a video visit
 *
 * @param {Object} appt VAR appointment object
 */
function isVideoVisit(appt) {
  return !!appt.vvsAppointments?.length;
}

/**
 * Returns status for a vista appointment
 *
 * @param {Object} appointment Vista appointment object
 * @returns {String} Status
 */
function getVistaStatus(appointment) {
  if (
    appointment.vdsAppointments?.length ||
    appointment.vvsAppointments?.length
  ) {
    return isVideoVisit(appointment)
      ? appointment.vvsAppointments?.[0]?.status?.code
      : appointment.vdsAppointments?.[0]?.currentStatus;
  }

  return null;
}

/**
 *  Maps FHIR appointment statuses to statuses from var-resources requests
 *
 * @param {Object} appointment A MAS or CC appointment object
 * @param {Boolean} isPast Whether or not the appointment is prior to today's date
 * @returns {String} Appointment status
 */
function getConfirmedStatus(appointment, isPast) {
  const currentStatus = getVistaStatus(appointment);

  if (
    (isPast && PAST_APPOINTMENTS_HIDE_STATUS_SET.has(currentStatus)) ||
    (!isPast && FUTURE_APPOINTMENTS_HIDE_STATUS_SET.has(currentStatus))
  ) {
    return null;
  }

  const cancelled = CANCELLED_APPOINTMENT_SET.has(currentStatus);

  return cancelled ? APPOINTMENT_STATUS.cancelled : APPOINTMENT_STATUS.booked;
}
/**
 * Finds the datetime of the appointment depending on the appointment type
 * and returns it as a moment object
 *
 * @param {Object} appt VAR appointment object
 * @returns {Object} Returns appointment datetime as moment object
 */
function getMomentConfirmedDate(appt) {
  if (isCommunityCare(appt) && appt.timeZone) {
    const zoneSplit = appt.timeZone.split(' ');
    const offset = zoneSplit.length > 1 ? zoneSplit[0] : '+0:00';
    return moment
      .utc(appt.appointmentTime, 'MM/DD/YYYY HH:mm:ss')
      .utcOffset(offset);
  }

  const timezone = getTimezoneByFacilityId(appt.sta6aid || appt.facilityId);

  return timezone
    ? moment(appt.startDate).tz(timezone)
    : moment(appt.startDate);
}

/**
 *  Determines whether current time is less than appointment time
 *  +60 min or +240 min in the case of video
 * @param {*} appt VAR appointment object
 */
export function isPastAppointment(appt) {
  const isVideo = isVideoVisit(appt);
  const threshold = isVideo ? 240 : 60;
  const apptDateTime = moment(getMomentConfirmedDate(appt));
  return apptDateTime.add(threshold, 'minutes').isBefore(moment());
}

/**
 * Returns url for user to join video conference
 *
 * @param {Object} appt VAR appointment object
 * @returns {String} URL of video visit
 */
function getVideoVisitLink(appt) {
  return appt.vvsAppointments?.[0]?.patients?.[0]?.virtualMeetingRoom?.url;
}

/**
 * Returns appointment duration in minutes. The default is 60 minutes.
 *
 * @param {Object} appt VAR appointment object
 * @returns {Number} appointment duration in minutes
 */
function getAppointmentDuration(appt) {
  const appointmentLength = parseInt(
    appt.vdsAppointments?.[0]?.appointmentLength ||
      appt.vvsAppointments?.[0]?.duration,
    10,
  );
  return Number.isNaN(appointmentLength) ? 60 : appointmentLength;
}

function setVideoData(appt) {
  if (
    getAppointmentType(appt) !== APPOINTMENT_TYPES.vaAppointment ||
    !isVideoVisit(appt)
  ) {
    return { isVideo: false };
  }

  const videoData = appt.vvsAppointments[0];
  return {
    isVideo: true,
    facilityId: appt.sta6aid || appt.facilityId,
    providers: (videoData.providers || [])
      .filter(provider => !!provider.name)
      .map(provider => ({
        name: provider.name,
        display: `${provider.name.firstName} ${provider.name.lastName}`,
      })),
    kind: videoData.appointmentKind,
    url: getVideoVisitLink(appt),
    isAtlas: !!videoData.tasInfo,
    atlasLocation: videoData.tasInfo
      ? transformATLASLocation(videoData.tasInfo)
      : null,
    atlasConfirmationCode: videoData.tasInfo?.confirmationCode,
    duration: videoData.duration,
  };
}

function getCommunityCareData(appt) {
  if (!isCommunityCare(appt)) {
    return {
      communityCareProvider: null,
    };
  }

  const apptType = getAppointmentType(appt);
  return {
    communityCareProvider:
      apptType === APPOINTMENT_TYPES.ccAppointment
        ? {
            firstName: appt.name?.firstName,
            lastName: appt.name?.lastName,
            providerName: appt.name?.lastName
              ? `${appt.name.firstName || ''} ${appt.name.lastName || ''}`
              : null,
            practiceName: appt.providerPractice,
            address: appt.address
              ? {
                  line: [appt.address.street],
                  city: appt.address.city,
                  state: appt.address.state,
                  postalCode: appt.address.zipCode,
                }
              : null,
            telecom: appt.providerPhone
              ? [
                  {
                    system: 'phone',
                    value: appt.providerPhone,
                  },
                ]
              : null,
          }
        : null,
    preferredCommunityCareProviders:
      appt.ccAppointmentRequest?.preferredProviders?.map(provider =>
        transformCommunityProvider(provider),
      ) || null,
  };
}

/**
 * Builds the location object which usually contain Location (Facility)
 * and HealthcareService (Clinic) or video conference info
 *
 * @param {VARAppointment} appt  VAR appointment object
 * @returns {LocationIdentifiers} An object containing location identifiers for the appointment
 */
function setLocation(appt) {
  const type = getAppointmentType(appt);
  const location = {
    vistaId: null,
    stationId: null,
    clinicId: null,
    clinicName: null,
  };

  if (type === APPOINTMENT_TYPES.vaAppointment) {
    location.vistaId = appt.facilityId;
    location.clinicId = appt.clinicId;
    location.stationId = appt.sta6aid;
    location.clinicName =
      appt.clinicFriendlyName ||
      appt.vdsAppointments?.[0]?.clinic?.name ||
      appt.vvsAppointments?.[0]?.patients?.[0]?.location?.clinic?.name ||
      null;
  } else if (type === APPOINTMENT_TYPES.request) {
    location.vistaId = appt.facility?.facilityCode?.substring(0, 3);
    location.stationId = appt.facility?.facilityCode;
  }

  return location;
}

/**
 * Transforms VAR appointment to FHIR appointment resource
 *
 * @export
 * @param {Object} appt An appointment from MAS or the VAR community care api
 * @returns {Appointment} An Appointment resource
 */
export function transformConfirmedAppointment(appt) {
  const minutesDuration = getAppointmentDuration(appt);
  const start = getMomentConfirmedDate(appt).format();
  const isPast = isPastAppointment(appt);
  const isCC = isCommunityCare(appt);
  const videoData = setVideoData(appt);

  const CANCELLATION_REASON_MAP = new Map([
    ['CANCELLED BY PATIENT', 'pat'],
    ['CANCELLED BY CLINIC', 'prov'],
    [null, null],
  ]);

  return {
    resourceType: 'Appointment',
    // Temporary fix until https://issues.mobilehealth.va.gov/browse/VAOSR-2058 is complete
    id: appt.id || appt.vvsAppointments[0].id || null,
    status: getConfirmedStatus(appt, isPast),
    description: getVistaStatus(appt),
    start,
    minutesDuration,
    comment:
      appt.instructionsToVeteran ||
      (!appt.communityCare && appt.vdsAppointments?.[0]?.bookingNote) ||
      appt.vvsAppointments?.[0]?.instructionsTitle ||
      null,
    cancelationReason:
      CANCELLATION_REASON_MAP.get(getVistaStatus(appt)) || null,
    location: setLocation(appt),
    videoData,
    ...getCommunityCareData(appt),
    vaos: {
      isVideo: videoData.isVideo,
      isPastAppointment: isPast,
      appointmentType: getAppointmentType(appt),
      isCommunityCare: isCC,
      isExpressCare: false,
      timeZone: isCC ? appt.timeZone : null,
      isPhoneAppointment: appt.phoneOnly || false,
      // CDQC is the standard COVID vaccine char4 code
      isCOVIDVaccine: appt.char4 === 'CDQC',
      apiData: appt,
    },
    version: 1,
  };
}

/**
 * Transforms MAS appointment to FHIR appointment resource
 *
 * @export
 * @param {Array<Object>} appointments An array of appointments from MAS
 *   or the VAR community care api
 * @returns {Array<Appointment>} An array of FHIR Appointment resource
 */
export function transformConfirmedAppointments(appointments) {
  return appointments.map(appt => transformConfirmedAppointment(appt));
}
