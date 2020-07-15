import React from 'react';
import classNames from 'classnames';

import { sentenceCase } from '../utils/formatters';
import { getPatientPhone, getPatientEmail } from '../services/appointment';
import { APPOINTMENT_STATUS } from '../utils/constants';
import ExpressCareStatus from './ExpressCareStatus';

export default function ExpressCareListItem({
  appointment,
  index,
  cancelAppointment,
  showCancelButton,
}) {
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;

  const itemClasses = classNames(
    'vaos-appts__list-item vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': true,
      'vads-u-border-color--warning-message':
        appointment.status === APPOINTMENT_STATUS.proposed ||
        appointment.status === APPOINTMENT_STATUS.pending,
      'vads-u-border-color--secondary-dark': cancelled,
      'vads-u-border-color--green':
        appointment.status === APPOINTMENT_STATUS.fulfilled,
    },
  );

  return (
    <li
      aria-labelledby={`card-${index} card-${index}-status`}
      data-request-id={appointment.id}
      className={itemClasses}
      data-is-cancelable={appointment.status === APPOINTMENT_STATUS.proposed}
    >
      <h3
        id={`card-${index}`}
        className="vads-u-font-size--h3 vads-u-margin-y--0"
      >
        {sentenceCase(appointment.reason)}
      </h3>
      <ExpressCareStatus appointment={appointment} index={index} />
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
          <dl className="vads-u-margin--0">
            <dt className="vads-u-font-weight--bold vads-u-display--block">
              Your contact details
            </dt>
            <dd>
              {getPatientPhone(appointment)}
              <br />
              {getPatientEmail(appointment)}
            </dd>
          </dl>
        </div>
        {!!appointment.comment && (
          <div className="vads-u-flex--1 vaos-u-word-break--break-word vads-u-margin-top--2 small-screen:vads-u-margin-top--0">
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                You shared these details about your concern
              </dt>
              <dd>{appointment.comment}</dd>
            </dl>
          </div>
        )}
      </div>
      {showCancelButton &&
        appointment.status === APPOINTMENT_STATUS.proposed && (
          <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-flex-wrap--wrap">
            <button
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
              onClick={() => cancelAppointment(appointment)}
              aria-label="Cancel appointment"
            >
              Cancel appointment
            </button>
          </div>
        )}
    </li>
  );
}
