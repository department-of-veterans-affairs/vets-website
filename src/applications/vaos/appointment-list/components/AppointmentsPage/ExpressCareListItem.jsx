import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function ExpressCareListItem({ appointment, cancelled }) {
  const appointmentDate = moment.parseZone(appointment.start);
  const isExpressCare = appointment.vaos.isExpressCare;

  // eslint-disable-next-line no-console
  console.log({ appointment });

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vads-u-display--flex vads-u-align-items--center"
    >
      <div className="vads-u-flex--1">
        {cancelled && (
          <span className="vads-u-font-size--base vads-u-font-weight--bold vads-u-color--secondary-dark vads-u-margin-x--0 vads-u-margin-y--0">
            CANCELLED
          </span>
        )}
        <h4 className="vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-y--0">
          {appointmentDate.format('dddd, MMMM D')}
        </h4>{' '}
        <span>A VA health care provider will follow up with you today.</span>
        <br />
        {isExpressCare && (
          <>
            <i className="fas fa-phone vads-u-margin-right--1" />
            Express Care request
          </>
        )}
      </div>
      <div>
        <Link
          to={`va/${appointment.id}`}
          className="vads-u-display--none medium-screen:vads-u-display--inline"
          aria-label={`Details for appointment on ${appointmentDate.format(
            'dddd, MMMM D h:mm a',
          )}`}
        >
          Details
        </Link>
        <Link
          aria-hidden="true"
          to={`va/${appointment.id}`}
          className="vaos-appts__card-link"
        >
          <i className="fas fa-chevron-right vads-u-margin-left--1" />
        </Link>
      </div>
    </li>
  );
}
