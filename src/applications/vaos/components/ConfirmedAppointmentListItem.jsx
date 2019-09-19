import React from 'react';
import { Link } from 'react-router';
import {
  getAppointmentId,
  getAppointmentTitle,
  getAppointmentLocation,
  getAppointmentDateTime,
} from '../utils/appointment';

export default function ConfirmedAppointmentListItem({ appointment }) {
  return (
    <li className="vads-u-border-left--5px vads-u-border-color--green vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        {getAppointmentTitle(appointment)}
      </h2>

      <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
          <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
            {' '}
            When{' '}
          </h3>
          {getAppointmentDateTime(appointment)}
        </div>
        <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
          <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
            {' '}
            Where{' '}
          </h3>
          {getAppointmentLocation(appointment)}
        </div>
      </div>
      <Link
        className="vads-u-font-weight--bold vads-u-text-decoration--none"
        to={`appointments/confirmed/${getAppointmentId(appointment)}`}
      >
        View details <i className="fas fa-angle-right" />
      </Link>
    </li>
  );
}
