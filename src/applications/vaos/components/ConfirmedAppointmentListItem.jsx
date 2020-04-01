import React from 'react';
import classNames from 'classnames';
import {
  getAppointmentAddress,
  getAppointmentDate,
  getAppointmentDateTime,
  getAppointmentDuration,
  getAppointmentInstructions,
  getAppointmentInstructionsHeader,
  getAppointmentLocation,
  getAppointmentTypeHeader,
  getLocationHeader,
  getMomentConfirmedDate,
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
  isPastAppointment,
}) {
  let canceled = false;
  if (type === APPOINTMENT_TYPES.vaAppointment) {
    canceled = CANCELLED_APPOINTMENT_SET.has(
      appointment.vdsAppointments?.[0]?.currentStatus,
    );
  }

  const itemClasses = classNames(
    'vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': !isPastAppointment,
      'vads-u-border-color--green': !canceled && !isPastAppointment,
      'vads-u-border-color--secondary-dark': canceled && !isPastAppointment,
    },
  );

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-state`}
      className={itemClasses}
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        {getAppointmentTypeHeader(appointment)}
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        {getAppointmentDateTime(appointment)}
      </h3>
      {(!isPastAppointment || canceled) && (
        <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
          {canceled ? (
            <i aria-hidden="true" className="fas fa-exclamation-circle" />
          ) : (
            <i aria-hidden="true" className="fas fa-check-circle" />
          )}
          <span
            id={`card-${index}-state`}
            className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block"
          >
            {canceled ? 'Canceled' : 'Confirmed'}
          </span>
        </div>
      )}

      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          {isVideoVisit(appointment) && !isPastAppointment ? (
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
        {hasInstructions(appointment) &&
          !isPastAppointment && (
            <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
              <dl className="vads-u-margin--0">
                <dt className="vads-u-font-weight--bold">
                  {getAppointmentInstructionsHeader(appointment)}
                </dt>
                <dd>{getAppointmentInstructions(appointment)}</dd>
              </dl>
            </div>
          )}
      </div>

      {!canceled &&
        !isPastAppointment && (
          <div className="vads-u-margin-top--2">
            <AddToCalendar
              summary={getAppointmentTypeHeader(appointment)}
              description={
                hasInstructions(appointment)
                  ? `${getAppointmentInstructionsHeader(
                      appointment,
                    )}. ${getAppointmentInstructions(appointment)}`
                  : ''
              }
              location={getAppointmentAddress(appointment, facility)}
              duration={getAppointmentDuration(appointment)}
              startDateTime={getMomentConfirmedDate(appointment).toDate()}
              endDateTime={getMomentConfirmedDate(appointment)}
            />
            {showCancelButton && (
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
            )}
          </div>
        )}
    </li>
  );
}
