import moment from '../../utils/moment-tz';

import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  CANCELLED_APPOINTMENT_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
} from '../../utils/constants';
import { getTimezoneBySystemId } from '../../utils/timezone';

/**
 * Determines what type of appointment a VAR appointment object is depending on
 * the existence of certain fields
 *
 * @param {Object} appt VAR appointment object
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
 *  Returns an appointment status
 *
 * @param {Object} appointment A VAR appointment object
 * @param {Boolean} isPastAppointment Whether or not appointment's date is before now
 */
function getAppointmentStatus(appointment, isPastAppointment) {
  switch (getAppointmentType(appointment)) {
    case APPOINTMENT_TYPES.ccAppointment:
      return APPOINTMENT_STATUS.booked;
    case APPOINTMENT_TYPES.ccRequest:
    case APPOINTMENT_TYPES.request: {
      return appointment.status === 'Cancelled'
        ? APPOINTMENT_STATUS.cancelled
        : APPOINTMENT_STATUS.pending;
    }
    case APPOINTMENT_TYPES.vaAppointment: {
      const currentStatus = appointment.vdsAppointments?.[0]?.currentStatus;
      if (
        (isPastAppointment &&
          PAST_APPOINTMENTS_HIDE_STATUS_SET.has(currentStatus)) ||
        (!isPastAppointment &&
          FUTURE_APPOINTMENTS_HIDE_STATUS_SET.has(currentStatus))
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

  if (timezone) {
    return moment(date).tz(timezone);
  }

  return moment(date);
}

/**
 * Returns url for user to join video conference
 *
 * @param {Object} appt VAR appointment object
 */
function getVideoVisitLink(appt) {
  return appt.vvsAppointments?.[0]?.patients?.[0]?.virtualMeetingRoom?.url;
}

/**
 * Returns appointment duration in minutes. The default is 60 minutes.
 *
 * @param {Object} appt VAR appointment object
 * @returns
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
 * Builds participant arraw for FHIR Appointment object which usually contains
 * Location (Facility) and HealthcareService (Clinic)
 *
 * @param {Object} appt  VAR appointment object
 */
function buildParticipant(appt) {
  const participant = [
    {
      actor: {
        reference: `Location/var${appt.facilityId}`,
      },
    },
  ];

  if (!isVideoVisit(appt)) {
    participant.push({
      actor: {
        reference: `HealthcareService/var${appt.clinicId}`,
        display:
          appt.clinicFriendlyName || appt.vdsAppointments?.[0]?.clinic?.name,
        telecom: isVideoVisit(appt)
          ? [
              {
                system: 'url',
                value: getVideoVisitLink(appt),
              },
            ]
          : null,
      },
    });
  }

  return participant;
}

export function transformConfirmedAppointments(appointments) {
  return appointments.map(appt => {
    const minutesDuration = getAppointmentDuration(appt);
    const start = getMomentConfirmedDate(appt).format();
    const end = getMomentConfirmedDate(appt)
      .add(minutesDuration, 'minutes')
      .format();
    const isPastAppointment = getMomentConfirmedDate(appt).isBefore(moment());

    const transformed = {
      resourceType: 'Appointment',
      status: getAppointmentStatus(appt, isPastAppointment),
      start,
      end,
      minutesDuration,
      participant: buildParticipant(appt),
      comment:
        appt.instructionsToVeteran ||
        appt.vdsAppointments?.[0]?.bookingNote ||
        appt.vvsAppointments?.[0]?.bookingNotes,
    };

    if (isVideoVisit(appt)) {
      transformed.contained = [
        {
          resourceType: 'HealthcareService',
          id: `HealthcareService/var${appt.vvsAppointments[0].id}`,
          type: [
            {
              text: 'Patient Virtual Meeting Room',
            },
          ],
          telecom: [
            {
              system: 'url',
              value: getVideoVisitLink(appt),
              period: {
                start,
                end,
              },
            },
          ],
        },
      ];
    }

    return transformed;
  });
}
