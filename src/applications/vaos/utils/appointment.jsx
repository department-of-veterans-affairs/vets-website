import React from 'react';
import moment from './moment-tz';
import guid from 'simple-guid';
import environment from 'platform/utilities/environment';
import { APPOINTMENT_TYPES, TIME_TEXT, PURPOSE_TEXT } from './constants';
import FacilityAddress from '../components/FacilityAddress';
import FacilityDirectionsLink from '../components/FacilityDirectionsLink';

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

export function isGFEVideoVisit(appt) {
  return appt.vvsAppointments?.[0]?.appointmentKind === 'MOBILE_GFE';
}

export function isVideoVisit(appt) {
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

export function getLocationHeader(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
    case APPOINTMENT_TYPES.ccAppointment:
      return appt.providerPractice;
    case APPOINTMENT_TYPES.ccRequest:
      return 'Preferred provider';
    case APPOINTMENT_TYPES.request:
      return appt.friendlyLocationName || appt.facility.name;
    default:
      return appt.clinicFriendlyName || appt.vdsAppointments[0]?.clinic?.name;
  }
}

export function getAppointmentTitle(appt) {
  if (isCommunityCare(appt)) {
    return `Community Care appointment`;
  } else if (isVideoVisit(appt)) {
    return `VA Video Connect`;
  }

  return 'VA visit';
}

export function getAppointmentLocation(appt, facility) {
  if (isVideoVisit(appt)) {
    return 'Video conference';
  }

  const type = getAppointmentType(appt);

  if (type === APPOINTMENT_TYPES.ccAppointment) {
    return (
      <>
        {appt.address.street}
        <br />
        {appt.address.city}, {appt.address.state} {appt.address.zipCode}
        <br />
        <FacilityDirectionsLink location={appt} />
      </>
    );
  }

  if (type === APPOINTMENT_TYPES.ccRequest) {
    if (!appt.ccAppointmentRequest?.preferredProviders?.[0]) {
      return 'Not specified';
    }

    return (
      <ul className="usa-unstyled-list">
        {appt.ccAppointmentRequest.preferredProviders.map(provider => (
          <li key={`${provider.firstName} ${provider.lastName}`}>
            {provider.practiceName}
            <br />
            {provider.firstName} {provider.lastName}
          </li>
        ))}
      </ul>
    );
  }

  if (facility) {
    return (
      <>
        {type !== APPOINTMENT_TYPES.request && (
          <>
            {facility.name}
            <br />
          </>
        )}
        <FacilityAddress facility={facility} showDirectionsLink />
      </>
    );
  }

  if (type === APPOINTMENT_TYPES.vaAppointment) {
    return (
      <a href="/find-locations" rel="noopener noreferrer" target="_blank">
        Find facility information
      </a>
    );
  }

  const facilityId =
    type === APPOINTMENT_TYPES.request || type === APPOINTMENT_TYPES.ccRequest
      ? appt.facility.facilityCode
      : appt.facilityId;

  return (
    <a
      href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      View facility information
    </a>
  );
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

export function getAppointmentDate(appt) {
  const parsedDate = getMomentConfirmedDate(appt);

  if (!parsedDate.isValid()) {
    return null;
  }

  return parsedDate.format('MMMM D, YYYY');
}

export function getAppointmentDateTime(appt) {
  const parsedDate = getMomentConfirmedDate(appt);
  if (!parsedDate.isValid()) {
    return null;
  }

  return (
    <>
      {parsedDate.format('dddd, MMMM D, YYYY')} at {parsedDate.format('h:mm')}
      <span aria-hidden="true">
        {' '}
        {parsedDate.format('a')} {getAppointmentTimezoneAbbreviation(appt)}
      </span>
      <span className="sr-only">
        {parsedDate.format('a')} {getAppointmentTimezoneDescription(appt)}
      </span>
    </>
  );
}

export function getRequestDateOptions(appt) {
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

  return options.reduce((formatted, option, index) => {
    formatted.push(
      <li key={`${appt.id}-option-${index}`}>
        {option.date.format('ddd, MMMM D, YYYY')} {TIME_TEXT[option.optionTime]}
      </li>,
    );
    return formatted;
  }, []);
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

export function getAppointmentInstructions(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
    case APPOINTMENT_TYPES.ccAppointment:
      return appt.instructionsToVeteran;
    case APPOINTMENT_TYPES.vaAppointment: {
      const bookingNotes =
        appt.vdsAppointments?.[0]?.bookingNote ||
        appt.vvsAppointments?.[0]?.bookingNotes;

      const instructions = bookingNotes?.split(': ', 2);

      if (instructions && instructions.length > 1) {
        return instructions[1];
      }

      return '';
    }
    default:
      return '';
  }
}

export function getAppointmentInstructionsHeader(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
    case APPOINTMENT_TYPES.ccAppointment:
      return 'Special instructions';
    case APPOINTMENT_TYPES.vaAppointment: {
      const bookingNotes =
        appt.vdsAppointments?.[0]?.bookingNote ||
        appt.vvsAppointments?.[0]?.bookingNotes;

      const instructions = bookingNotes?.split(': ', 2);

      return instructions ? instructions[0] : '';
    }
    default:
      return '';
  }
}

export function hasInstructions(appt) {
  if (appt.instructionsToVeteran) {
    return true;
  }

  const bookingNotes =
    appt.vdsAppointments?.[0]?.bookingNote ||
    appt.vvsAppointments?.[0]?.bookingNotes;

  return (
    !!bookingNotes &&
    PURPOSE_TEXT.some(purpose => bookingNotes.startsWith(purpose.short))
  );
}

export function getPurposeOfVisit(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
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

export function getAppointmentTypeHeader(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
    case APPOINTMENT_TYPES.ccAppointment:
    case APPOINTMENT_TYPES.ccRequest:
      return 'Community Care';
    case APPOINTMENT_TYPES.request: {
      if (appt.visitType === 'Video Conference') {
        return 'VA Video Connect';
      }

      return 'VA Appointment';
    }
    case APPOINTMENT_TYPES.vaAppointment: {
      if (isVideoVisit(appt)) {
        return 'VA Video Connect';
      }

      return 'VA Appointment';
    }
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
export function getAppointmentDuration(appt) {
  const type = getAppointmentType(appt);

  if (type === APPOINTMENT_TYPES.vaAppointment) {
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
 * Function to get the appointment address.
 *
 * @param {*} appt
 * @param {*} facility
 * @returns 'undefined' if there is no address
 */
export function getAppointmentAddress(appt, facility) {
  if (isVideoVisit(appt)) {
    return 'Video conference';
  }

  const type = getAppointmentType(appt);

  if (type === APPOINTMENT_TYPES.ccAppointment) {
    return `${appt.address.street} ${appt.address.city}, ${
      appt.address.state
    } ${appt.address.zipCode}`;
  }

  if (facility) {
    return getFacilityAddress(facility);
  }

  return undefined;
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
