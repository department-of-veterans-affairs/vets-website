import React from 'react';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { APPOINTMENT_STATUS } from '../../../utils/constants';
import { focusElement } from 'platform/utilities/ui';

export default function ExpressCareListItem({ appointment }) {
  const history = useHistory();
  const appointmentDate = moment.parseZone(appointment.start);
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const link = `express-care/${appointment.id}`;
  const idClickable = `id-${appointment.id}`;

  return (
    <li
      id={idClickable}
      data-request-id={appointment.id}
      className="vaos-appts__card--clickable vads-u-margin-bottom--3"
      data-cy="appointment-list-item"
    >
      <div
        className="vads-u-padding--2 vads-u-display--flex vads-u-align-items--left vads-u-flex-direction--column medium-screen:vads-u-padding--3 medium-screen:vads-u-flex-direction--row medium-screen:vads-u-align-items--center"
        onClick={() => {
          if (!window.getSelection().toString()) {
            focusElement(`#${idClickable}`);
            history.push(link);
          }
        }}
      >
        <div className="vads-u-flex--1 vads-u-margin-y--neg0p5 ">
          {canceled && (
            <div className="vads-u-margin-bottom--1">
              <span className="usa-label">Canceled</span>
            </div>
          )}
          <h4 className="vads-u-margin-y--0 vads-u-margin-bottom--0p25">
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
        <div className="vads-u-flex--auto vads-u-padding-top--0p5 medium-screen:vads-u-padding-top--0">
          <Link
            className="vaos-appts__focus--hide-outline"
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }Express Care request on ${appointmentDate.format(
              'dddd, MMMM D YYYY',
            )}`}
            to={link}
            onClick={e => e.preventDefault()}
          >
            Details
          </Link>
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </div>
      </div>
    </li>
  );
}
