import React from 'react';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function ExpressCareListItem({ appointment }) {
  const history = useHistory();
  const appointmentDate = moment.parseZone(appointment.start);
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const link = `express-care/${appointment.id}`;

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vaos-appts__card--clickable"
    >
      <div
        className="vaos-appts__card--clickable-content vads-u-display--flex vads-u-align-items--center"
        onClick={() => {
          if (!window.getSelection().toString()) history.push(link);
        }}
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
          <i
            aria-hidden="true"
            className="fas fa-phone vads-u-margin-right--1"
          />
          Express Care request
        </div>
        {/* visible to medium screen and larger */}
        <div className="vads-u-display--none medium-screen:vads-u-display--inline">
          <Link
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }Express Care request on ${appointmentDate.format(
              'dddd, MMMM D YYYY',
            )}`}
            to={link}
          >
            Details
          </Link>
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </div>
        {/* visible to small screen breakpoint */}
        <div className="medium-screen:vads-u-display--none">
          <Link
            to={link}
            className="vaos-appts__card-link"
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }Express Care request on ${appointmentDate.format(
              'dddd, MMMM D YYYY',
            )}`}
          >
            <i
              aria-hidden="true"
              className="fas fa-chevron-right vads-u-margin-left--1"
            />
          </Link>
        </div>
      </div>
    </li>
  );
}
