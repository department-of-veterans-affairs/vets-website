import React from 'react';
import {
  getClinicName,
  getAppointmentTitle,
  getAppointmentLocation,
  getAppointmentDate,
  getAppointmentDateTime,
  isVideoVisit,
  isCommunityCare,
} from '../utils/appointment';
import {
  CANCELLED_APPOINTMENT_SET,
  APPOINTMENT_TYPES,
} from '../utils/constants';
import VideoVisitLink from './VideoVisitLink';

export default function ConfirmedAppointmentListItem({
  appointment,
  type,
  index,
  cancelAppointment,
}) {
  let canceled = false;
  if (type === APPOINTMENT_TYPES.vaAppointment) {
    canceled = CANCELLED_APPOINTMENT_SET.has(
      appointment.vdsAppointments?.[0]?.currentStatus,
    );
  }

  const allowCancel =
    !canceled &&
    type !== APPOINTMENT_TYPES.ccAppointment &&
    !isVideoVisit(appointment);

  return (
    <li
      aria-labelledby={`card-${index}`}
      className="vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3"
    >
      <div className="vads-u-display--flex vads-u-justify-content--space-between">
        <div className="vaos-appts__status vads-u-flex--1">
          {canceled ? (
            <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />
          ) : (
            <i className="fas fa-check-circle vads-u-color--green" />
          )}
          <span
            id={`card-${index}`}
            className="vads-u-font-weight--bold vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-display--inline-block"
          >
            {canceled ? 'Canceled' : 'Confirmed'}
            <span className="sr-only"> appointment</span>
          </span>
        </div>

        {allowCancel && (
          <button
            onClick={() => cancelAppointment(appointment)}
            aria-label="Cancel appointment"
            className="usa-button-secondary vads-u-margin--0 vads-u-flex--0"
          >
            Cancel
            <span className="sr-only">
              {' '}
              appointment on {getAppointmentDate(appointment)}
            </span>
          </button>
        )}
      </div>
      <h2 className="vaos-appts__date-time vads-u-font-size--lg">
        {getAppointmentDateTime(appointment)}
      </h2>

      {isCommunityCare(appointment) || isVideoVisit(appointment) ? (
        <div className="vads-u-font-weight--bold vads-u-margin-bottom--1">
          <dl>
            <dt>{getAppointmentTitle(appointment)}</dt>
            <dd />
          </dl>
        </div>
      ) : null}

      <div className="vaos-appts__split-section">
        <div className="vads-u-flex--1">
          {isVideoVisit(appointment) ? (
            <VideoVisitLink appointment={appointment} />
          ) : (
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {getClinicName(appointment)}
              </dt>
              <dd>{getAppointmentLocation(appointment)}</dd>
            </dl>
          )}
        </div>
        <div className="vads-u-flex--1">&nbsp;</div>
      </div>
    </li>
  );
}
