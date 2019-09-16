import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

export function formatDate(date) {
  const parsedDate = moment(date, 'MM/DD/YYYY HH:mm:ss');

  if (!parsedDate.isValid()) {
    return '';
  }

  return parsedDate.format('MMMM D, YYYY');
}

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatTimeFromDate(date) {
  const parsedDate = moment(date, 'MM/DD/YYYY HH:mm:ss');

  if (!parsedDate.isValid()) {
    return '';
  }

  return parsedDate.format('hh:mm a');
}

export default function ConfirmedAppointment({ appointment }) {
  const isCommunityCare = !!appointment.ccAppointmentRequest;

  return (
    <li className="vads-u-border-left--5px vads-u-border-color--green vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        {titleCase(
          `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        )}
      </h2>

      <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
          <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
            When
          </h3>
          <ul id="foo" className="usa-unstyled-list">
            <li className="vads-u-margin-bottom--1">
              {formatDate(appointment.bookedApptDateTime)}
            </li>
            <li className="vads-u-margin-bottom--1">
              {formatTimeFromDate(appointment.bookedApptDateTime)}
            </li>
          </ul>
        </div>
        {!isCommunityCare && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
            <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
              Where
            </h3>
            {appointment.friendlyLocationName || appointment.facility.name}
            <br />
            {appointment.facility.city}, {appointment.facility.state}
          </div>
        )}
        {isCommunityCare && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
            <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
              Preferred location:
            </h3>
            {appointment.ccAppointmentRequest.preferredCity},{' '}
            {appointment.ccAppointmentRequest.preferredState}
          </div>
        )}
      </div>
      <Link
        className="vads-u-font-weight--bold vads-u-text-decoration--none"
        to={`appointments/confirmed/${appointment.appointmentRequestId}`}
      >
        View details <i className="fas fa-angle-right" />
      </Link>
    </li>
  );
}
