import React from 'react';
import moment from './moment-tz';
import environment from 'platform/utilities/environment';
import { APPOINTMENT_TYPES, TIME_TEXT } from './constants';
import {
  getTimezoneBySystemId,
  getTimezoneAbbrBySystemId,
  stripDST,
} from './timezone';

export function getAppointmentType(appt) {
  if (appt.optionDate1 && appt.ccAppointmentRequest?.preferredProviders) {
    return APPOINTMENT_TYPES.ccRequest;
  } else if (appt.optionDate1) {
    return APPOINTMENT_TYPES.request;
  } else if (appt.appointmentRequestId) {
    return APPOINTMENT_TYPES.ccAppointment;
  } else if (appt.startDate) {
    return APPOINTMENT_TYPES.vaAppointment;
  }

  return null;
}

export function getAppointmentId(appt) {
  if (appt.appointmentRequestId) {
    return appt.appointmentRequestId;
  } else if (appt.vvsAppointments?.length) {
    return appt.vvsAppointments[0].id;
  }

  return `va-${appt.facilityId}-${appt.clinicId}-${appt.startDate}`;
}

export function isCommunityCare(appt) {
  return !!appt.appointmentRequestId;
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

export function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  return facilityId;
}

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

export function getAppointmentLocation(appt) {
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

  const facilityId =
    type === APPOINTMENT_TYPES.request || type === APPOINTMENT_TYPES.ccRequest
      ? appt.facility.facilityCode
      : appt.facilityId;

  return (
    <a
      href={`/find-locations/facility/vha_${getStagingId(facilityId)}`}
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
    return moment(appt.appointmentTime, 'MM/DD/YYYY HH:mm:ss');
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
    case APPOINTMENT_TYPES.ccAppointment:
      return stripDST(appt?.timeZone?.split(' ')?.[1]);
    case APPOINTMENT_TYPES.ccRequest:
    case APPOINTMENT_TYPES.request:
      return getTimezoneAbbrBySystemId(appt?.facility?.facilityCode);
    case APPOINTMENT_TYPES.vaAppointment:
      return getTimezoneAbbrBySystemId(appt?.facilityId);
    default:
      return '';
  }
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
        {parsedDate.format('a')} {getAppointmentTimezoneAbbreviation(appt)}
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
      <li key={`${appt.uniqueId}-option-${index}`}>
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

/**
 * Filter and sort methods
 */

export function filterFutureConfirmedAppointments(appt, today) {
  const date = getMomentConfirmedDate(appt);
  return date.isValid() && date.isAfter(today);
}

export function filterFutureRequests(request, today) {
  const optionDate1 = moment(request.optionDate1, 'MM/DD/YYYY');
  const optionDate2 = moment(request.optionDate2, 'MM/DD/YYYY');
  const optionDate3 = moment(request.optionDate3, 'MM/DD/YYYY');

  return (
    ['Submitted', 'Cancelled'].includes(request.status) &&
    ((optionDate1.isValid() && optionDate1.isAfter(today)) ||
      (optionDate2.isValid() && optionDate2.isAfter(today)) ||
      (optionDate3.isValid() && optionDate3.isAfter(today)))
  );
}

export function sortFutureList(a, b) {
  const aIsRequest =
    getAppointmentType(a) === APPOINTMENT_TYPES.request ||
    getAppointmentType(a) === APPOINTMENT_TYPES.ccRequest;
  const bIsRequest =
    getAppointmentType(b) === APPOINTMENT_TYPES.request ||
    getAppointmentType(b) === APPOINTMENT_TYPES.ccRequest;

  const aDate = aIsRequest
    ? getMomentRequestOptionDate(a.optionDate1)
    : getMomentConfirmedDate(a);

  const bDate = bIsRequest
    ? getMomentRequestOptionDate(b.optionDate1)
    : getMomentConfirmedDate(b);

  if (aDate.isSame(bDate)) {
    // If same date, requests should show after confirmed
    if (aIsRequest && !bIsRequest) {
      return 1;
    } else if (bIsRequest && !aIsRequest) {
      return -1;
    }

    return 0;
  }

  return aDate.isBefore(bDate) ? -1 : 1;
}
