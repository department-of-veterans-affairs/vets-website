import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function ExpressCareListItem({ appointment }) {
  const appointmentDate = moment.parseZone(appointment.start);
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vads-u-display--flex vads-u-align-items--center"
    >
      <div className="vads-u-flex--1">
        {canceled && (
          <span className="vaos-u-text-transform--uppercase vads-u-font-size--base vads-u-font-weight--bold vads-u-color--secondary-dark vads-u-margin-x--0 vads-u-margin-y--0">
            Canceled
          </span>
        )}
        <h4 className="vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-y--0">
          {appointmentDate.format('dddd, MMMM D')}
        </h4>{' '}
        {!canceled && (
          <>
            <span>
              A VA health care provider will follow up with you today.
            </span>
            <br />
          </>
        )}
        <i aria-hidden="true" className="fas fa-phone vads-u-margin-right--1" />
        Express Care request
      </div>
      <div>
        <Link
          aria-hidden="true"
          to={`express-care/${appointment.id}`}
          className="vads-u-display--none medium-screen:vads-u-display--inline"
        >
          Details
        </Link>
        <Link
          to={`express-care/${appointment.id}`}
          className="vaos-appts__card-link"
          aria-label={`Details for Express Care request on ${appointmentDate.format(
            'dddd, MMMM D YYYY',
          )}`}
        >
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </Link>
      </div>
    </li>
  );
}
