import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

function isCommunityCare(appt) {
  return !!appt.appointmentRequestId;
}

function isVideoVisit(appt) {
  return !!appt.vvsAppointments;
}

function getStagingId(facilityId) {
  if (__BUILDTYPE__ !== 'vagovprod' && facilityId.startsWith('983')) {
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

function getTitle(appt) {
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

function getLocation(appt) {
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

function getDateTime(appt) {
  let parsedDate;
  if (isCommunityCare(appt)) {
    parsedDate = moment(appt.appointmentTime, 'MM/DD/YYYY HH:mm:ss');
  } else if (isVideoVisit(appt)) {
    parsedDate = moment(appt.vvsAppointments[0].dateTime);
  } else {
    parsedDate = moment(appt.vdsAppointments[0].appointmentTime);
  }

  if (!parsedDate.isValid()) {
    return {
      date: '',
      time: '',
    };
  }

  return {
    date: parsedDate.format('MMMM D, YYYY'),
    time: parsedDate.format('hh:mm a'),
  };
}

export default function ConfirmedAppointment({ appointment }) {
  const { date, time } = getDateTime(appointment);
  return (
    <li className="vads-u-border-left--5px vads-u-border-color--green vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        {getTitle(appointment)}
      </h2>

      <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
          <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
            {' '}
            When{' '}
          </h3>
          <ul className="usa-unstyled-list">
            <li className="vads-u-margin-bottom--1">{date}</li>
            <li className="vads-u-margin-bottom--1">{time}</li>
          </ul>
        </div>
        <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
          <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
            {' '}
            Where{' '}
          </h3>
          {getLocation(appointment)}
        </div>
      </div>
      <Link
        className="vads-u-font-weight--bold vads-u-text-decoration--none"
        to={`appointments/pending/${appointment.appointmentRequestId}`}
      >
        View details <i className="fas fa-angle-right" />
      </Link>
    </li>
  );
}
