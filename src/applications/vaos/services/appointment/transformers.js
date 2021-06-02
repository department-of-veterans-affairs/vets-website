/**
 * @module services/Appointment/transformers
 */
import moment from '../../lib/moment-tz';

import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  EXPRESS_CARE,
  UNABLE_TO_REACH_VETERAN_DETCODE,
} from '../../utils/constants';
import { getTimezoneBySystemId } from '../../utils/timezone';
import { transformATLASLocation } from '../location/transformers';

import {
  CANCELLED_APPOINTMENT_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
} from './index';

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
  } else if (appt.typeOfCareId) {
    return APPOINTMENT_TYPES.request;
  } else if (
    appt.vvsAppointments?.length ||
    (appt.clinicId && !appt.communityCare)
  ) {
    return APPOINTMENT_TYPES.vaAppointment;
  } else if (appt.appointmentTime || appt.communityCare === true) {
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
 * @param {Object} appointment A VAR request object
 * @param {Boolean} isExpressCare Whether or not the request is for express care
 * @returns {String} Appointment status
 */
function getRequestStatus(request, isExpressCare) {
  if (isExpressCare) {
    if (request.status === 'Submitted') {
      return APPOINTMENT_STATUS.proposed;
    } else if (request.status === 'Cancelled') {
      return APPOINTMENT_STATUS.cancelled;
    } else if (request.status.startsWith('Escalated')) {
      return APPOINTMENT_STATUS.pending;
    }

    return APPOINTMENT_STATUS.fulfilled;
  }

  if (request.status === 'Booked' || request.status === 'Resolved') {
    return APPOINTMENT_STATUS.booked;
  } else if (request.status === 'Cancelled') {
    return APPOINTMENT_STATUS.cancelled;
  }

  return APPOINTMENT_STATUS.proposed;
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

  const timezone = getTimezoneBySystemId(appt.facilityId)?.timezone;
  const date = isVideoVisit(appt)
    ? appt.vvsAppointments[0].dateTime
    : appt.startDate;
  return timezone ? moment(date).tz(timezone) : moment(date);
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
  return isNaN(appointmentLength) ? 60 : appointmentLength;
}

/**
 * Gets a purpose of visit that matches our array of purpose constant
 *
 * @param {Object} appt VAR appointment object
 * @returns {String} purpose of visit string
 */
function getPurposeOfVisit(appt) {
  switch (getAppointmentType(appt)) {
    case APPOINTMENT_TYPES.ccRequest:
      return PURPOSE_TEXT.find(purpose => purpose.id === appt.purposeOfVisit)
        ?.short;
    case APPOINTMENT_TYPES.request:
      if (appt.typeOfCareId === EXPRESS_CARE) {
        return appt.reasonForVisit;
      }

      return PURPOSE_TEXT.find(
        purpose => purpose.serviceName === appt.purposeOfVisit,
      )?.short;
    default:
      return appt.purposeOfVisit;
  }
}

/**
 * Returns sorted user requested periods. For now we don't know how VSP will handle the
 * AM/PM periods, so using 00:00:00.000Z to symbolize AM and 12:00:00.000Z to symbolize
 * PM for now.
 *
 * @param {Object} appt VAR appointment object
 * @returns {Array} returns formatted date options
 */
function getRequestedPeriods(appt) {
  const requestedPeriods = [];
  const format = 'MM/DD/YYYY';

  for (let x = 1; x <= 3; x += 1) {
    const optionTime = appt[`optionTime${x}`];

    // Since 'No Date Selected' and 'No Time Selected' are possible values but
    // invalid dates and times, don't add the start and end attributes.
    //
    // NOTE: FHIR Spec says...
    // If the start element is missing, the start of the period is not known.
    // If the end element is missing, it means that the period is ongoing,
    // or the start may be in the past, and the end date in the future,
    // which means that period is expected / planned to end at the specified time.
    if (moment(appt[`optionDate${x}`]).isValid() && optionTime) {
      const momentDate = moment(appt[`optionDate${x}`], format).format(
        'YYYY-MM-DD',
      );
      const isAM = optionTime === 'AM';
      requestedPeriods.push({
        start: `${momentDate}T${isAM ? '00:00:00.000' : `12:00:00.000`}`,
        end: `${momentDate}T${isAM ? '11:59:59.999' : `23:59:59.999`}`,
      });
    }
  }

  return requestedPeriods.sort((a, b) => (a.start < b.start ? -1 : 1));
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
    status: videoData.status.code,
  };
}

function getCommunityCareData(appt) {
  if (!isCommunityCare(appt)) {
    return {};
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
    preferredCommunityCareProviders: appt.ccAppointmentRequest?.preferredProviders?.map(
      provider => {
        return {
          providerName: `${provider.firstName || ''} ${provider.lastName ||
            ''}`,
          firstName: provider.firstName,
          lastName: provider.lastName,
          practiceName: provider.practiceName,
          address: provider.address
            ? {
                line: [provider.address.street],
                city: provider.address.city,
                state: provider.address.state,
                postalCode: provider.address.zipCode,
              }
            : null,
        };
      },
    ),
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

  switch (type) {
    case APPOINTMENT_TYPES.vaAppointment: {
      return {
        vistaId: appt.facilityId,
        clinicId: appt.clinicId,
        stationId: appt.sta6aid,
        clinicName:
          appt.clinicFriendlyName || appt.vdsAppointments?.[0]?.clinic?.name,
      };
    }
    case APPOINTMENT_TYPES.request: {
      return {
        vistaId: appt.facility?.facilityCode?.substring(0, 3),
        stationId: appt.facility?.facilityCode,
      };
    }
    default:
      return {};
  }
}

/**
 * Returns contact information from a VAR request
 *
 * @param {VARRequest} appt  VAR appointment object
 * @returns {PatientContact} An object containing the phone email the patient used in the request
 */
function setContact(appt) {
  const type = getAppointmentType(appt);
  if (
    type !== APPOINTMENT_TYPES.request &&
    type !== APPOINTMENT_TYPES.ccRequest
  ) {
    return null;
  }

  return {
    telecom: [
      {
        system: 'phone',
        value: appt.phoneNumber,
      },
      {
        system: 'email',
        value: appt.email,
      },
    ],
  };
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
  return {
    resourceType: 'Appointment',
    id: appt.id,
    status: getConfirmedStatus(appt, isPast),
    description: getVistaStatus(appt),
    start,
    minutesDuration,
    comment:
      appt.instructionsToVeteran ||
      (!appt.communityCare && appt.vdsAppointments?.[0]?.bookingNote) ||
      appt.vvsAppointments?.[0]?.instructionsTitle,
    location: setLocation(appt),
    videoData,
    ...getCommunityCareData(appt),
    vaos: {
      isVideo: videoData.isVideo,
      isPastAppointment: isPast,
      appointmentType: getAppointmentType(appt),
      isCommunityCare: isCC,
      timeZone: isCC ? appt.timeZone : null,
      isPhoneAppointment: appt.phoneOnly,
      // CDQC is the standard COVID vaccine char4 code
      isCOVIDVaccine: appt.char4 === 'CDQC',
      apiData: appt,
    },
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

/**
 * Transforms a VAR appointment request to FHIR appointment resource
 *
 * @export
 * @param {Object} appointment An appointment request from var-resources
 * @returns {Appointment} A FHIR Appointment resource
 */
export function transformPendingAppointment(appt) {
  const isCC = isCommunityCare(appt);
  const isExpressCare = appt.typeOfCareId === EXPRESS_CARE;
  const requestedPeriod = getRequestedPeriods(appt);
  const unableToReachVeteran = appt.appointmentRequestDetailCode?.some(
    detail => detail.detailCode?.code === UNABLE_TO_REACH_VETERAN_DETCODE,
  );
  const created = moment.parseZone(appt.date).format('YYYY-MM-DD');
  const isVideo = appt.visitType === 'Video Conference';

  return {
    resourceType: 'Appointment',
    id: appt.id,
    status: getRequestStatus(appt, isExpressCare),
    created,
    cancelationReason: unableToReachVeteran
      ? UNABLE_TO_REACH_VETERAN_DETCODE
      : null,
    requestedPeriod,
    start: isExpressCare ? created : undefined,
    minutesDuration: 60,
    type: {
      coding: [
        {
          code: appt.typeOfCareId,
          display: appt.appointmentType,
        },
      ],
    },
    reason: getPurposeOfVisit(appt),
    location: setLocation(appt),
    contact: setContact(appt),
    preferredTimesForPhoneCall: appt.bestTimetoCall,
    comment: appt.additionalInformation,
    videoData: {
      isVideo,
    },
    ...getCommunityCareData(appt),
    vaos: {
      isVideo,
      appointmentType: getAppointmentType(appt),
      isCommunityCare: isCC,
      isExpressCare,
      apiData: appt,
    },
  };
}

/**
 * Transforms an array of VAR appointment requests to FHIR appointment resources
 *
 * @export
 * @param {Array<Object>} appointments An array of appointment requests from var-resources
 * @returns {Array<Appointment>} An array of FHIR Appointment resource
 */
export function transformPendingAppointments(requests) {
  return requests.map(appt => transformPendingAppointment(appt));
}
