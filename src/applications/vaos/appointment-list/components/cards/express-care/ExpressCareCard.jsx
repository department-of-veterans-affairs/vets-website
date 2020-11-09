import React from 'react';
import classNames from 'classnames';

import { sentenceCase, lowerCase } from '../../../../utils/formatters';
import { getPatientTelecom } from '../../../../services/appointment';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import ExpressCareStatus from './ExpressCareStatus';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

export default function ExpressCareCard({
  appointment,
  cancelAppointment,
  showCancelButton,
  headingLevel = '3',
}) {
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;

  const itemClasses = classNames(
    'vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
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
  const Heading = `h${headingLevel}`;
  return (
    <div
      data-request-id={appointment.id}
      className={itemClasses}
      data-is-cancelable={appointment.status === APPOINTMENT_STATUS.proposed}
    >
      <Heading
        id={`card-${appointment.id}`}
        className="vads-u-font-size--h3 vads-u-margin-y--0"
      >
        {sentenceCase(appointment.reason)}
      </Heading>
      <ExpressCareStatus appointment={appointment} />
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
          <dl className="vads-u-margin--0">
            <dt className="vads-u-font-weight--bold vads-u-display--block">
              Your contact details
            </dt>
            <dd>
              <Telephone contact={getPatientTelecom(appointment, 'phone')} />
              <br />
              {getPatientTelecom(appointment, 'email')}
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
              aria-label={`Cancel Express Care request for ${lowerCase(
                appointment.reason,
              )}`}
            >
              Cancel Express Care request
            </button>
          </div>
        )}
    </div>
  );
}
