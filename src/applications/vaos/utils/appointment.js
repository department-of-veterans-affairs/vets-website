import moment from './moment-tz';
import guid from 'simple-guid';
import environment from 'platform/utilities/environment';
import {
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
  CANCELLED_APPOINTMENT_SET,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  PAST_APPOINTMENTS_HIDDEN_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
} from './constants';

import {
  getTimezoneBySystemId,
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
  stripDST,
} from './timezone';

export function getRealFacilityId(facilityId) {
  if (!environment.isProduction() && facilityId) {
    return facilityId.replace('983', '442').replace('984', '552');
  }

  return facilityId;
}

export function getAppointmentType(appt) {
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

function isCommunityCare(appt) {
  const apptType = getAppointmentType(appt);
  return (
    apptType === APPOINTMENT_TYPES.ccRequest ||
    apptType === APPOINTMENT_TYPES.ccAppointment
  );
}

function isGFEVideoVisit(appt) {
  return appt.vvsAppointments?.[0]?.appointmentKind === 'MOBILE_GFE';
}

function isVideoVisit(appt) {
  return !!appt.vvsAppointments?.length || isGFEVideoVisit(appt);
}

export function getVideoVisitLink(appt) {
  return appt.vvsAppointments?.[0]?.patients?.[0]?.virtualMeetingRoom?.url;
}

/**
 * Date and time
 */

export function getMomentConfirmedDate(appt) {
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

export function getMomentRequestOptionDate(optionDate) {
  return moment(optionDate, 'MM/DD/YYYY');
}

export function getAppointmentTimezoneAbbreviation(timezone, facilityId) {
  if (facilityId) {
    return getTimezoneAbbrBySystemId(facilityId);
  }

  const tzAbbr = timezone?.split(' ')?.[1] || timezone;
  return stripDST(tzAbbr);
}

export function getAppointmentTimezoneDescription(timezone, facilityId) {
  const abbr = getAppointmentTimezoneAbbreviation(timezone, facilityId);

  return getTimezoneDescFromAbbr(abbr);
}

function getRequestDateOptions(appt) {
  return [
    {
      date: getMomentRequestOptionDate(appt.optionDate1),
      optionTime: appt.optionTime1,
    },
    {
      date: getMomentRequestOptionDate(appt.optionDate2),
      optionTime: appt.optionTime2,
    },
    {
      date: getMomentRequestOptionDate(appt.optionDate3),
      optionTime: appt.optionTime3,
    },
  ]
    .filter(o => o.date.isValid())
    .sort((a, b) => {
      if (a.date.isSame(b.date)) {
        return a.optionTime === 'AM' ? -1 : 1;
      }

      return a.date.isBefore(b.date) ? -1 : 1;
    });
}

export function getPastAppointmentDateRangeOptions(today = moment()) {
  // Past 3 months
  const options = [
    {
      value: 0,
      label: 'Past 3 months',
      startDate: today
        .clone()
        .subtract(3, 'months')
        .format(),
      endDate: today.format(),
    },
  ];

  // 3 month ranges going back ~1 year
  let index = 1;
  let monthsToSubtract = 3;

  while (index < 4) {
    const start = today
      .clone()
      .subtract(index === 1 ? 5 : monthsToSubtract + 2, 'months')
      .startOf('month');
    const end = today
      .clone()
      .subtract(index === 1 ? 3 : monthsToSubtract, 'months')
      .endOf('month');

    options.push({
      value: index,
      label: `${start.format('MMM YYYY')} – ${end.format('MMM YYYY')}`,
      startDate: start.format(),
      endDate: end.format(),
    });

    monthsToSubtract += 3;
    index += 1;
  }

  // All of current year
  options.push({
    value: 4,
    label: `All of ${today.format('YYYY')}`,
    startDate: today
      .clone()
      .startOf('year')
      .format(),
    endDate: today.format(),
  });

  // All of last year
  const lastYear = today.clone().subtract(1, 'years');

  options.push({
    value: 5,
    label: `All of ${lastYear.format('YYYY')}`,
    startDate: lastYear.startOf('year').format(),
    endDate: lastYear
      .clone()
      .endOf('year')
      .format(),
  });

  return options;
}

/**
 * Filter and sort methods
 */

export function filterFutureConfirmedAppointments(appt, today) {
  // return appointments where current time is less than appointment time
  // +60 min or +240 min in the case of video
  const isVideo = !!appt.vaos.videoType;
  const threshold = isVideo ? 240 : 60;
  const apptDateTime = moment(appt.start);

  return (
    !FUTURE_APPOINTMENTS_HIDDEN_SET.has(appt.description) &&
    apptDateTime.isValid() &&
    apptDateTime.add(threshold, 'minutes').isAfter(today)
  );
}

export function filterPastAppointments(appt, startDate, endDate) {
  const apptDateTime = moment(appt.start);

  return (
    !PAST_APPOINTMENTS_HIDDEN_SET.has(appt.description) &&
    apptDateTime.isValid() &&
    apptDateTime.isAfter(startDate) &&
    apptDateTime.isBefore(endDate)
  );
}

export function filterRequests(request, today) {
  const status = request?.status;
  const optionDate1 = moment(request.optionDate1, 'MM/DD/YYYY');
  const optionDate2 = moment(request.optionDate2, 'MM/DD/YYYY');
  const optionDate3 = moment(request.optionDate3, 'MM/DD/YYYY');

  const hasValidDateAfterToday =
    (optionDate1.isValid() && optionDate1.isAfter(today)) ||
    (optionDate2.isValid() && optionDate2.isAfter(today)) ||
    (optionDate3.isValid() && optionDate3.isAfter(today));

  return (
    status === 'Submitted' || (status === 'Cancelled' && hasValidDateAfterToday)
  );
}

export function sortFutureConfirmedAppointments(a, b) {
  return moment(a.start).isBefore(moment(b.start)) ? -1 : 1;
}

export function sortPastAppointments(a, b) {
  return a.appointmentDate.isAfter(b.appointmentDate) ? -1 : 1;
}

export function sortFutureRequests(a, b) {
  // If appointmentType is the same, return the one with the sooner date
  if (a.typeOfCare === b.typeOfCare) {
    return a.dateOptions[0].date.isBefore(b.dateOptions[0].date) ? -1 : 1;
  }

  // Otherwise, return sorted alphabetically by appointmentType
  return a.typeOfCare.toLowerCase() < b.typeOfCare.toLowerCase() ? -1 : 1;
}

export function sortMessages(a, b) {
  return moment(a.attributes.date).isBefore(b.attributes.date) ? -1 : 1;
}

function getPurposeOfVisit(appt) {
  switch (getAppointmentType(appt)) {
    case APPOINTMENT_TYPES.ccRequest:
      return PURPOSE_TEXT.find(purpose => purpose.id === appt.purposeOfVisit)
        ?.short;
    case APPOINTMENT_TYPES.request:
      return PURPOSE_TEXT.find(
        purpose => purpose.serviceName === appt.purposeOfVisit,
      )?.short;
    default:
      return appt.purposeOfVisit;
  }
}

/**
 * Function to get the appointment duration in minutes. The default is 60 minutes.
 *
 * @param {*} appt
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
 * Function to generate ICS.
 *
 * @param {*} summary - summary or subject of invite
 * @param {*} description - additional detials
 * @param {*} location - address / location
 * @param {*} startDateTime - start datetime in js date format
 * @param {*} endDateTime - end datetime in js date format
 */

export function generateICS(
  summary,
  description,
  location,
  startDateTime,
  endDateTime,
) {
  const startDate = moment(startDateTime).format('YYYYMMDDTHHmmss');
  const endDate = moment(endDateTime).format('YYYYMMDDTHHmmss');
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:VA
BEGIN:VEVENT
UID:${guid()}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
DTSTAMP:${startDate}
DTSTART:${startDate}
DTEND:${endDate}
END:VEVENT
END:VCALENDAR`;
}

export function getCernerPortalLink() {
  if (environment.isProduction()) {
    return 'http://patientportal.myhealth.va.gov/';
  }

  return 'http://ehrm-va-test.patientportal.us.healtheintent.com/';
}

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
      const currentStatus = isVideoVisit(appointment)
        ? appointment.vvsAppointments?.[0]?.status?.code
        : appointment.vdsAppointments?.[0]?.currentStatus;

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

export function getAppointmentTypes(appointment) {
  return {
    appointmentType: getAppointmentType(appointment),
    videoType: getVideoType(appointment),
    isCommunityCare: isCommunityCare(appointment),
  };
}

export function transformAppointment(appointment) {
  const appointmentTypes = getAppointmentTypes(appointment);

  const appointmentData = {
    ...appointmentTypes,
    apiData: appointment,
    isPastAppointment: false,
    instructions:
      appointment.instructionsToVeteran ||
      appointment.vdsAppointments?.[0]?.bookingNote,
    duration: getAppointmentDuration(appointment),
    appointmentDate: getMomentConfirmedDate(appointment),
    status: getAppointmentStatus(appointment),
    clinicId: appointment.clinicId,
    facilityId: appointment.facilityId,
    videoLink: getVideoVisitLink(appointment),
    id: appointment.id,
    clinicName:
      appointment.clinicFriendlyName ||
      appointment.vdsAppointments?.[0]?.clinic?.name,
  };

  if (appointmentTypes.appointmentType === APPOINTMENT_TYPES.ccAppointment) {
    return {
      ...appointmentData,
      timeZone: appointment.timeZone,
      address: appointment.address,
      providerPractice: appointment.providerPractice,
      providerName: appointment.name,
      providerPhone: appointment.providerPhone,
    };
  }

  return appointmentData;
}

export function transformPastAppointment(appointment) {
  return {
    ...transformAppointment(appointment),
    status: getAppointmentStatus(appointment, true),
    isPastAppointment: true,
  };
}

export function transformRequest(appointment) {
  const appointmentTypes = getAppointmentTypes(appointment);

  const requestData = {
    ...appointmentTypes,
    apiData: appointment,
    id: appointment.id,
    isPastAppointment: false,
    duration: 60,
    dateOptions: getRequestDateOptions(appointment),
    status: getAppointmentStatus(appointment),
    typeOfCare: appointment.appointmentType,
    purposeOfVisit: getPurposeOfVisit(appointment),
    facility: appointment.facility,
    facilityName:
      appointment.friendlyLocationName || appointment.facility?.name,
    email: appointment.email,
    phoneNumber: appointment.phoneNumber,
    bestTimetoCall: appointment.bestTimetoCall,
  };

  if (appointmentTypes.appointmentType === APPOINTMENT_TYPES.ccRequest) {
    return {
      ...requestData,
      preferredProviders: appointment.ccAppointmentRequest.preferredProviders,
    };
  }

  return requestData;
}
