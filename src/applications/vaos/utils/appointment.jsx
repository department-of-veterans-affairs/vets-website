import React from 'react';
import moment from 'moment';
import environment from 'platform/utilities/environment';

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

export function isVideoVisit(appt) {
  return !!appt.vvsAppointments;
}

function getStagingId(facilityId) {
  if (!environment.isProduction() && facilityId.startsWith('983')) {
    return facilityId.replace('983', '442');
  }

  return facilityId;
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getAppointmentTitle(appt) {
  if (isCommunityCare(appt)) {
    return `Community Care visit - ${appt.providerPractice}`;
  } else if (isVideoVisit(appt)) {
    const providers = appt.vvsAppointments[0]?.providers?.provider
      .map(provider =>
        titleCase(`${provider.name.firstName} ${provider.name.lastName}`),
      )
      .join(', ');
    return `Video visit - ${providers}`;
  }

  return `VA visit - ${appt.clinicFriendlyName ||
    appt.vdsAppointments[0]?.clinic?.name}`;
}

export function getAppointmentLocation(appt) {
  if (isCommunityCare(appt)) {
    return (
      <>
        {appt.providerPractice}
        <br />
        {appt.address.street}
        <br />
        {appt.address.city}, {appt.address.state} {appt.address.zipCode}
      </>
    );
  } else if (isVideoVisit(appt)) {
    return 'Video conference';
  }

  return (
    <a
      href={`/find-locations/facility/vha_${getStagingId(appt.facilityId)}`}
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

  return (
    <ul className="usa-unstyled-list">
      <li className="vads-u-margin-bottom--1">
        {parsedDate.format('MMMM D, YYYY')}
      </li>
      <li className="vads-u-margin-bottom--1">
        {parsedDate.format('hh:mm a')}
      </li>
    </ul>
  );
}
