import moment from './moment-tz';
import guid from 'simple-guid';
import environment from 'platform/utilities/environment';
import {
  APPOINTMENT_TYPES,
  PURPOSE_TEXT,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
  CANCELLED_APPOINTMENT_SET,
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

export function isCommunityCare(appt) {
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
  return appt.vvsAppointments[0]?.patients?.[0]?.virtualMeetingRoom?.url;
}

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sentenceCase(str) {
  return str
    .split(' ')
    .map((word, index) => {
      if (/^[^a-z]*$/.test(word)) {
        return word;
      }

      if (index === 0) {
        return `${word.charAt(0).toUpperCase()}${word
          .substr(1, word.length - 1)
          .toLowerCase()}`;
      }

      return word.toLowerCase();
    })
    .join(' ');
}

export function lowerCase(str = '') {
  return str
    .split(' ')
    .map(word => {
      if (/^[^a-z]*$/.test(word)) {
        return word;
      }

      return word.toLowerCase();
    })
    .join(' ');
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

export function getAppointmentTimezoneAbbreviation(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
    case APPOINTMENT_TYPES.ccAppointment: {
      const tzAbbr = appt?.timeZone?.split(' ')?.[1] || appt?.timeZone;
      return stripDST(tzAbbr);
    }
    case APPOINTMENT_TYPES.ccRequest:
    case APPOINTMENT_TYPES.request:
      return getTimezoneAbbrBySystemId(appt?.facility?.facilityCode);
    case APPOINTMENT_TYPES.vaAppointment:
      return getTimezoneAbbrBySystemId(appt?.facilityId);
    default:
      return '';
  }
}

export function getAppointmentTimezoneDescription(appt) {
  const abbr = getAppointmentTimezoneAbbreviation(appt);

  return getTimezoneDescFromAbbr(abbr);
}

export function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

function getRequestDateOptions(appt) {
  const options = [
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

  return options;
}

export function getRequestTimeToCall(appt) {
  const times = appt.bestTimetoCall.map(t => t.toLowerCase());
  if (times.length === 1) {
    return `Call ${times[0]}`;
  } else if (times.length === 2) {
    return `Call ${times[0]} or ${times[1]}`;
  } else if (times.length === 3) {
    return `Call ${times[0]}, ${times[1]}, or ${times[2]}`;
  }

  return null;
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
    label: `Show all of ${today.format('YYYY')}`,
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
    label: `Show all of ${lastYear.format('YYYY')}`,
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
  const threshold = isVideoVisit(appt) ? 240 : 60;
  const apptDateTime = getMomentConfirmedDate(appt);
  return (
    apptDateTime.isValid() &&
    apptDateTime.add(threshold, 'minutes').isAfter(today)
  );
}

export function sortFutureConfirmedAppointments(a, b) {
  return getMomentConfirmedDate(a).isBefore(getMomentConfirmedDate(b)) ? -1 : 1;
}

export function filterPastAppointments(appt, startDate, endDate) {
  const apptDateTime = getMomentConfirmedDate(appt);
  return (
    apptDateTime.isValid() &&
    apptDateTime.isAfter(startDate) &&
    apptDateTime.isBefore(endDate)
  );
}

export function sortPastAppointments(a, b) {
  return getMomentConfirmedDate(a).isAfter(getMomentConfirmedDate(b)) ? -1 : 1;
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

export function sortFutureRequests(a, b) {
  const aDate = getMomentRequestOptionDate(a.optionDate1);
  const bDate = getMomentRequestOptionDate(b.optionDate1);

  // If appointmentType is the same, return the one with the sooner date
  if (a.appointmentType === b.appointmentType) {
    return aDate.isBefore(bDate) ? -1 : 1;
  }

  // Otherwise, return sorted alphabetically by appointmentType
  return a.appointmentType < b.appointmentType ? -1 : 1;
}

export function sortMessages(a, b) {
  return moment(a.attributes.date).isBefore(b.attributes.date) ? -1 : 1;
}

function getPurposeOfVisit(appt) {
  switch (appt.appointmentType) {
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
  if (appt.appointmentType === APPOINTMENT_TYPES.vaAppointment) {
    const appointmentLength = parseInt(
      appt.vdsAppointments[0]?.appointmentLength,
      10,
    );
    return isNaN(appointmentLength) ? 60 : appointmentLength;
  }
  return 60;
}
/**
 * Returns formatted address from facility details object
 *
 * @param {*} facility - facility details object
 */
export function getFacilityAddress(facility) {
  return `${facility.address.physical.address1} ${
    facility.address.physical.city
  }, ${facility.address.physical.state} ${facility.address.physical.zip}`;
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
  if (appt.vvsAppointments?.[0]?.appointmentKind === 'MOBILE_GFE') {
    return VIDEO_TYPES.gfe;
  } else if (appt.vvsAppointments?.length) {
    return VIDEO_TYPES.videoConnect;
  }

  return null;
}

function hasInstructions(appt) {
  const bookingNotes =
    appt.vdsAppointments?.[0]?.bookingNote ||
    appt.vvsAppointments?.[0]?.bookingNotes;

  return (
    !!bookingNotes &&
    PURPOSE_TEXT.some(purpose => bookingNotes.startsWith(purpose.short))
  );
}

function getAppointmentInstructions(appt) {
  if (hasInstructions(appt)) {
    const bookingNotes =
      appt.vdsAppointments?.[0]?.bookingNote ||
      appt.vvsAppointments?.[0]?.bookingNotes;

    const instructions = bookingNotes?.split(': ', 2);

    if (instructions && instructions.length > 1) {
      return instructions[1];
    }
  }

  return null;
}

function getAppointmentInstructionsHeader(appt) {
  if (hasInstructions(appt)) {
    const bookingNotes =
      appt.vdsAppointments?.[0]?.bookingNote ||
      appt.vvsAppointments?.[0]?.bookingNotes;

    const instructions = bookingNotes?.split(': ', 2);

    return instructions ? instructions[0] : '';
  }

  return null;
}

function getInstructions(appointment) {
  if (appointment.instructionsToVeteran) {
    return {
      header: 'Special instructions',
      body: appointment.instructionsToVeteran,
    };
  }

  if (hasInstructions(appointment)) {
    return {
      header: getAppointmentInstructionsHeader(appointment),
      body: getAppointmentInstructions(appointment),
    };
  }

  return null;
}

function getAppointmentStatus(appointment) {
  switch (appointment.appointmentType) {
    case APPOINTMENT_TYPES.ccAppointment:
      return APPOINTMENT_STATUS.booked;
    case APPOINTMENT_TYPES.ccRequest:
    case APPOINTMENT_TYPES.request: {
      return appointment.status === 'Cancelled'
        ? APPOINTMENT_STATUS.cancelled
        : APPOINTMENT_STATUS.pending;
    }
    case APPOINTMENT_TYPES.vaAppointment: {
      const cancelled = CANCELLED_APPOINTMENT_SET.has(
        appointment.vdsAppointments?.[0]?.currentStatus,
      );

      return cancelled
        ? APPOINTMENT_TYPES.cancelled
        : APPOINTMENT_STATUS.booked;
    }
    default:
      return APPOINTMENT_STATUS.booked;
  }
}

export function transformAppointment(appointment) {
  const appointmentWithTypes = {
    ...appointment,
    isPastAppointment: false,
    appointmentType: getAppointmentType(appointment),
    videoType: getVideoType(appointment),
    isCommunityCare: isCommunityCare(appointment),
  };

  const isRequest =
    appointmentWithTypes.appointmentType === APPOINTMENT_TYPES.ccRequest ||
    appointmentWithTypes.appointmentType === APPOINTMENT_TYPES.vaRequest;

  return {
    ...appointmentWithTypes,
    apiData: appointment,
    instructions: getInstructions(appointmentWithTypes),
    duration: getAppointmentDuration(appointmentWithTypes),
    appointmentDate: isRequest
      ? null
      : getMomentConfirmedDate(appointmentWithTypes),
    dateOptions: isRequest ? getRequestDateOptions(appointmentWithTypes) : null,
    status: getAppointmentStatus(appointmentWithTypes),
    typeOfCare: appointment.appointmentType,
    purposeOfVisit: getPurposeOfVisit(appointmentWithTypes),
  };
}

export function transformPastAppointment(appointment) {
  return {
    ...transformAppointment(appointment),
    isPastAppointment: true,
  };
}
