import moment from '../../utils/moment-tz';

import titleCase from 'platform/utilities/data/titleCase';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  CANCELLED_APPOINTMENT_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  PURPOSE_TEXT,
  VIDEO_TYPES,
  EXPRESS_CARE,
} from '../../utils/constants';
import { getTimezoneBySystemId } from '../../utils/timezone';

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
  } else if (appt.optionDate1) {
    return APPOINTMENT_TYPES.request;
  } else if (appt.clinicId || appt.vvsAppointments) {
    return APPOINTMENT_TYPES.vaAppointment;
  } else if (appt.appointmentTime) {
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
 * Returns whether or not an appointment is a GFE video visit
 *
 * @param {Object} appt VAR appointment object
 */
function isGFEVideoVisit(appt) {
  return appt.vvsAppointments?.[0]?.appointmentKind === 'MOBILE_GFE';
}

/**
 * Returns whether or not a confirmed VA appointment is a video visit
 *
 * @param {Object} appt VAR appointment object
 */
function isVideoVisit(appt) {
  return !!appt.vvsAppointments?.length || isGFEVideoVisit(appt);
}

/**
 * If an appointment is a video appointment, returns whether it is a GFE video visit
 * or a regular video visit.  Return null if not a video appointment.
 *
 * @param {Object} appt VAR appointment object
 * @returns {String} Returns video appointment type or null
 */
function getVideoType(appt) {
  if (isGFEVideoVisit(appt)) {
    return VIDEO_TYPES.gfe;
  } else if (
    appt.vvsAppointments?.length ||
    appt.visitType === 'Video Conference'
  ) {
    return VIDEO_TYPES.videoConnect;
  }

  return null;
}

/**
 * Returns status for a vista appointment
 *
 * @param {Object} appointment Vista appointment object
 * @returns {String} Status
 */
function getVistaStatus(appointment) {
  if (getAppointmentType(appointment) === APPOINTMENT_TYPES.vaAppointment) {
    return isVideoVisit(appointment)
      ? appointment.vvsAppointments?.[0]?.status?.code
      : appointment.vdsAppointments?.[0]?.currentStatus;
  }

  return null;
}

/**
 *  Returns an appointment status
 *
 * @param {Object} appointment A VAR appointment object
 * @param {Boolean} isPastAppointment Whether or not appointment's date is before now
 * @returns {String} Appointment status
 */
function getStatus(appointment, isPast) {
  switch (getAppointmentType(appointment)) {
    case APPOINTMENT_TYPES.ccAppointment:
      return APPOINTMENT_STATUS.booked;
    case APPOINTMENT_TYPES.ccRequest:
    case APPOINTMENT_TYPES.request: {
      if (
        appointment.status === 'Booked' ||
        appointment.status === 'Resolved'
      ) {
        return APPOINTMENT_STATUS.booked;
      } else if (appointment.status === 'Cancelled') {
        return APPOINTMENT_STATUS.cancelled;
      } else {
        return APPOINTMENT_STATUS.pending;
      }
    }
    case APPOINTMENT_TYPES.vaAppointment: {
      const currentStatus = getVistaStatus(appointment);

      if (
        (isPast && PAST_APPOINTMENTS_HIDE_STATUS_SET.has(currentStatus)) ||
        (!isPast && FUTURE_APPOINTMENTS_HIDE_STATUS_SET.has(currentStatus))
      ) {
        return null;
      }

      const cancelled = CANCELLED_APPOINTMENT_SET.has(currentStatus);

      return cancelled
        ? APPOINTMENT_STATUS.cancelled
        : APPOINTMENT_STATUS.booked;
    }
    default:
      return APPOINTMENT_STATUS.booked;
  }
}
/**
 * Finds the datetime of the appointment depending on the appointment type
 * and returns it as a moment object
 *
 * @param {Object} appt VAR appointment object
 * @returns {Object} Returns appointment datetime as moment object
 */
function getMomentConfirmedDate(appt) {
  if (isCommunityCare(appt)) {
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
export function isPastAppointment(appt, videoType) {
  const threshold = videoType ? 240 : 60;
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

/**
 * Builds participant and contained arrays for FHIR Appointment object which usually
 * contain Location (Facility) and HealthcareService (Clinic) or video conference info
 *
 * @param {Object} appt  VAR appointment object
 * @returns {Array} Array of participants of FHIR appointment
 */
function setParticipant(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
    case APPOINTMENT_TYPES.vaAppointment: {
      if (!isVideoVisit(appt)) {
        const participant = [];
        participant.push({
          actor: {
            reference: `HealthcareService/var${appt.facilityId}_${
              appt.clinicId
            }`,
            display:
              appt.clinicFriendlyName ||
              appt.vdsAppointments?.[0]?.clinic?.name,
          },
        });

        if (appt.sta6aid) {
          participant.push({
            actor: {
              reference: `Location/var${appt.sta6aid}`,
            },
          });
        }

        return participant;
      }
      return null;
    }
    case APPOINTMENT_TYPES.ccAppointment: {
      if (!!appt.name?.firstName && !!appt.name?.lastName) {
        return [
          {
            actor: {
              reference: 'Practitioner/PRACTITIONER_ID',
              display: `${appt.name.firstName} ${appt.name.lastName}`,
            },
          },
        ];
      }
      return null;
    }
    case APPOINTMENT_TYPES.ccRequest:
    case APPOINTMENT_TYPES.request: {
      const hasName =
        appt.patient?.displayName ||
        (!!appt.patient?.firstName && !!appt.patient?.lastName);

      const participant = [
        {
          actor: {
            reference: 'Patient/PATIENT_ID',
            display: hasName
              ? appt.patient?.displayName ||
                `${appt.patient?.firstName} ${appt.patient?.lastName}`
              : null,
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
          },
        },
      ];

      if (appt.facility) {
        participant.push({
          actor: {
            reference: `Location/var${appt.facility.facilityCode}`,
            display: appt.friendlyLocationName || appt.facility?.name,
          },
        });
      }

      return participant;
    }
    default:
      return null;
  }
}

/**
 * Builds contained array and populates with video conference info and facility info if available
 *
 * @param {Object} appt  VAR appointment object
 * @returns {Array} Array of contained objects of FHIR appointment containing video conference info
 */
function setContained(appt) {
  switch (getAppointmentType(appt)) {
    case APPOINTMENT_TYPES.vaAppointment: {
      if (isVideoVisit(appt)) {
        return [
          {
            resourceType: 'HealthcareService',
            id: `HealthcareService/var${appt.vvsAppointments[0].id}`,
            type: [
              {
                text: 'Patient Virtual Meeting Room',
              },
            ],
            location: {
              reference: `Location/var${appt.facilityId}`,
            },
            comment: getVideoType(appt),
            telecom: [
              {
                system: 'url',
                value: getVideoVisitLink(appt),
                period: {
                  start: getMomentConfirmedDate(appt).format(),
                },
              },
            ],
          },
        ];
      }

      return null;
    }
    case APPOINTMENT_TYPES.ccRequest: {
      return appt.ccAppointmentRequest.preferredProviders.map(provider => {
        const participant = {
          actor: {
            name: provider.practiceName,
            // TODO: Map to participant.actor.Practitioner field.
            firstName: provider.firstName,
            lastName: provider.lastName,
          },
        };

        if (provider.address) {
          const address = {
            line: [provider.address?.street],
            city: provider.address?.city,
            state: provider.address?.state,
            postalCode: provider.address?.zipCode,
          };
          participant.actor.address = address;
        }

        return participant;
      });
    }
    case APPOINTMENT_TYPES.ccAppointment: {
      const address = appt.address;

      return [
        {
          actor: {
            name: appt.providerPractice,
            address: {
              line: [address?.street],
              city: address?.city,
              state: address?.state,
              postalCode: address?.zipCode,
            },
            telecom: [
              {
                system: 'phone',
                value: appt.providerPhone,
              },
            ],
          },
        },
      ];
    }
    default:
      return null;
  }
}

/**
 * Returns an object containing data we may need from legacy var
 *
 * @param {Object} appt  VAR appointment object
 * @returns {Object}
 */
function setLegacyVAR(appt) {
  return {
    apiData: appt,
    bestTimeToCall: appt.bestTimetoCall,
  };
}

/**
 * Transforms VAR appointment to FHIR appointment resource
 *
 * @export
 * @param {Array} appointments An array of appointments from the VA facilities api
 * @returns {Array} An array of FHIR Appointment resource
 */
export function transformConfirmedAppointments(appointments) {
  return appointments.map(appt => {
    const minutesDuration = getAppointmentDuration(appt);
    const start = getMomentConfirmedDate(appt).format();
    const videoType = getVideoType(appt);
    const isPast = isPastAppointment(appt, videoType);
    const isCC = isCommunityCare(appt);

    return {
      resourceType: 'Appointment',
      id: `var${appt.id}`,
      status: getStatus(appt, isPast),
      description: getVistaStatus(appt),
      start,
      minutesDuration,
      comment:
        appt.instructionsToVeteran ||
        appt.vdsAppointments?.[0]?.bookingNote ||
        appt.vvsAppointments?.[0]?.instructionsTitle,
      participant: setParticipant(appt),
      contained: setContained(appt),
      legacyVAR: setLegacyVAR(appt),
      vaos: {
        isPastAppointment: isPast,
        appointmentType: getAppointmentType(appt),
        videoType,
        isCommunityCare: isCC,
        timeZone: isCC ? appt.timeZone : null,
      },
    };
  });
}

/**
 * Transforms VAR appointment request to FHIR appointment resource
 *
 * @export
 * @param {Array} appointments An array of appointments from the VA facilities api
 * @returns {Array} An array of FHIR Appointment resource
 */
export function transformPendingAppointments(requests) {
  return requests.map(appt => {
    const isCC = isCommunityCare(appt);
    const requestedPeriod = getRequestedPeriods(appt);

    return {
      resourceType: 'Appointment',
      id: `var${appt.id}`,
      status: getStatus(appt, isCC),
      requestedPeriod,
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
      participant: setParticipant(appt),
      contained: setContained(appt),
      legacyVAR: setLegacyVAR(appt),
      vaos: {
        appointmentType: getAppointmentType(appt),
        isCommunityCare: isCC,
        isExpressCare: appt.typeOfCareId === EXPRESS_CARE,
        videoType: getVideoType(appt),
      },
    };
  });
}
