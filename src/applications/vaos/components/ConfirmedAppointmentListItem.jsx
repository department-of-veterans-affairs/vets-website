import React from 'react';
import classNames from 'classnames';
import {
  getLocationHeader,
  getAppointmentLocation,
  getAppointmentDate,
  getAppointmentDateTime,
  getAppointmentInstructions,
  getAppointmentInstructionsHeader,
  getAppointmentTypeHeader,
  hasInstructions,
  isVideoVisit,
} from '../utils/appointment';
import {
  CANCELLED_APPOINTMENT_SET,
  APPOINTMENT_TYPES,
} from '../utils/constants';
import VideoVisitSection from './VideoVisitSection';
import AddToCalendar from './AddToCalendar';

export default function ConfirmedAppointmentListItem({
  appointment,
  type,
  index,
  cancelAppointment,
  showCancelButton,
  facility,
}) {
  let canceled = false;
  if (type === APPOINTMENT_TYPES.vaAppointment) {
    canceled = CANCELLED_APPOINTMENT_SET.has(
      appointment.vdsAppointments?.[0]?.currentStatus,
    );
  }

  const allowCancel =
    showCancelButton &&
    !canceled &&
    type !== APPOINTMENT_TYPES.ccAppointment &&
    !isVideoVisit(appointment);

  const itemClasses = classNames(
    'vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': true,
      'vads-u-border-color--green': !canceled,
      'vads-u-border-color--secondary-dark': canceled,
    },
  );

  return (
    <li aria-labelledby={`card-${index}`} className={itemClasses}>
      <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
        {getAppointmentTypeHeader(appointment)}
      </div>
      <h2 className="vaos-appts__date-time vads-u-font-size--lg vads-u-margin-x--0">
        {getAppointmentDateTime(appointment)}
      </h2>
      <div className="vads-u-margin-top--2">
        {canceled ? (
          <i className="fas fa-exclamation-circle" />
        ) : (
          <i className="fas fa-check-circle" />
        )}
        <span
          id={`card-${index}`}
          className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block"
        >
          {canceled ? 'Canceled' : 'Confirmed'}
          <span className="sr-only"> appointment</span>
        </span>
      </div>

      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-top--2">
          {isVideoVisit(appointment) ? (
            <VideoVisitSection appointment={appointment} />
          ) : (
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {getLocationHeader(appointment)}
              </dt>
              <dd>{getAppointmentLocation(appointment, facility)}</dd>
            </dl>
          )}
        </div>
        {hasInstructions(appointment) && (
          <div className="vads-u-flex--1 vads-u-margin-top--2">
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {getAppointmentInstructionsHeader(appointment)}
              </dt>
              <dd>{getAppointmentInstructions(appointment)}</dd>
            </dl>
          </div>
        )}
      </div>

      {!allowCancel &&
        !canceled && (
          <div className="vads-u-margin-top--2">
            <AddToCalendar appointment={appointment} facility={facility} />
          </div>
        )}

      {allowCancel && (
        <div className="vads-u-margin-top--2">
          <AddToCalendar appointment={appointment} facility={facility} />
          <button
            onClick={() => cancelAppointment(appointment)}
            aria-label="Cancel appointment"
            className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
          >
            Cancel appointment
            <span className="sr-only">
              {' '}
              on {getAppointmentDate(appointment)}
            </span>
          </button>
        </div>
      )}
    </li>
  );
}
