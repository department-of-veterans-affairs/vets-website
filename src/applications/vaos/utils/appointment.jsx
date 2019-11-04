import React from 'react';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import { APPOINTMENT_TYPES, TIME_TEXT } from './constants';

const today = moment();

export function getAppointmentType(appt) {
  if (appt.optionDate1) {
    return APPOINTMENT_TYPES.request;
  } else if (appt.appointmentRequestId) {
    return APPOINTMENT_TYPES.ccAppointment;
  } else if (appt.startDate) {
    return APPOINTMENT_TYPES.vaAppointment;
  }

  return null;
}

export function parseVAorCCDate(item) {
  // This means it's a CC appt, which has a different date format
  if (item.appointmentTime) {
    return moment(item.appointmentTime, 'MM/DD/YYYY HH:mm:ss');
  }

  return moment(item.startDate);
}

export function parseRequestDate(optionDate) {
  return moment(optionDate, 'MM/DD/YYYY');
}

export function filterFutureConfirmedAppointments(appt) {
  const date = parseVAorCCDate(appt);
  return date.isValid() && date.isAfter(today);
}

export function filterFutureRequests(request) {
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

export function getAppointmentId(appt) {
  if (appt.appointmentRequestId) {
    return appt.appointmentRequestId;
  } else if (appt.vvsAppointments) {
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
  return !!appt.vvsAppointments || isGFEVideoVisit(appt);
}

export function getVideoVisitLink(appt) {
  return appt.vvsAppointments?.[0]?.patients?.patient[0]?.virtualMeetingRoom
    ?.url;
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

export function getClinicName(appt) {
  const type = getAppointmentType(appt);

  switch (type) {
    case APPOINTMENT_TYPES.ccAppointment:
      return appt.providerPractice;
    case APPOINTMENT_TYPES.request:
      return appt.friendlyLocationName || appt.facility.name;
    default:
      return appt.clinicFriendlyName || appt.vdsAppointments?.[0].clinic?.name;
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

  const facilityId =
    type === APPOINTMENT_TYPES.request
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

export function getAppointmentDateTime(appt) {
  let parsedDate;
  if (isCommunityCare(appt)) {
    parsedDate = moment(appt.appointmentTime, 'MM/DD/YYYY HH:mm:ss');
  } else if (isVideoVisit(appt)) {
    parsedDate = moment(appt.vvsAppointments[0].dateTime);
  } else {
    parsedDate = moment(appt.startDate);
  }

  if (!parsedDate.isValid()) {
    return null;
  }

  return `${parsedDate.format('MMMM D, YYYY')} at ${parsedDate.format(
    'h:mm a zz',
  )}`;
}

export function getRequestDateOptions(appt) {
  const options = [
    { date: parseRequestDate(appt.optionDate1), optionTime: appt.optionTime1 },
    { date: parseRequestDate(appt.optionDate2), optionTime: appt.optionTime2 },
    { date: parseRequestDate(appt.optionDate3), optionTime: appt.optionTime3 },
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
        {option.date.format('MMMM D, YYYY')} {TIME_TEXT[option.optionTime]}
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
