import React from 'react';
import { titleCase } from '../utils/appointment';

export default function AppointmentRequestListItem({ appointment }) {
  const canceled = appointment.status === 'Cancelled';

  return (
    <li className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <div className="vads-u-display--flex vads-u-justify-content--space-between">
        {canceled ? (
          <div>
            <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />
            <span className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block">
              Canceled
            </span>
          </div>
        ) : (
          <div>
            <i className="fas fa-exclamation-triangle vads-u-color--warning-message" />
            <span className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block">
              Pending
            </span>{' '}
            Date and time to be determined
          </div>
        )}
        {canceled ? null : (
          <button className="usa-button-secondary vads-u-margin--0">
            Cancel
          </button>
        )}
      </div>
      <div className="vads-u-flex--1 vads-u-margin-y--1p5">
        <span className="vads-u-font-weight--bold">
          {titleCase(appointment.appointmentType)} appointment
        </span>
      </div>
      <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
        <span className="vads-u-font-weight--bold">
          {appointment.friendlyLocationName || appointment.facility.name}
        </span>
        <br />
        {appointment.facility.city}, {appointment.facility.state}
      </div>
    </li>
  );
}
