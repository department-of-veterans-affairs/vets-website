import React from 'react';
import { Link } from 'react-router';
import {
  getClinicName,
  getAppointmentTitle,
  getAppointmentLocation,
  getAppointmentDateTime,
  isVideoVisit,
  isCommunityCare,
} from '../utils/appointment';
import {
  CANCELLED_APPOINTMENT_SET,
  APPOINTMENT_TYPES,
} from '../utils/constants';
import VideoVisitLink from './VideoVisitLink';

export default function ConfirmedAppointmentListItem({ appointment, type }) {
  let canceled = false;
  if (type === APPOINTMENT_TYPES.vaAppointment) {
    canceled = CANCELLED_APPOINTMENT_SET.has(
      appointment.vdsAppointments?.[0].currentStatus,
    );
  }

  return (
    <li className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <div className="vads-u-display--flex vads-u-justify-content--space-between">
        {canceled ? (
          <div>
            <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />
            <span className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block">
              Canceled
            </span>
          </div>
        ) : (
          <div>
            <i className="fas fa-check-circle vads-u-color--green" />
            <span className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block">
              Confirmed
            </span>
          </div>
        )}
        {canceled ? null : (
          <button className="usa-button-secondary vads-u-margin--0">
            Cancel
          </button>
        )}
      </div>
      <h2
        className={`vads-u-margin--0 vads-u-margin-${
          canceled ? 'y' : 'bottom'
        }--2 vads-u-font-size--lg`}
      >
        {getAppointmentDateTime(appointment)}
      </h2>

      {isCommunityCare(appointment) || isVideoVisit(appointment) ? (
        <div className="vads-u-font-weight--bold vads-u-margin-bottom--1">
          {getAppointmentTitle(appointment)}
        </div>
      ) : null}

      <div>
        {isVideoVisit(appointment) ? (
          <VideoVisitLink appointment={appointment} />
        ) : (
          <>
            <div className="vads-u-font-weight--bold">
              {getClinicName(appointment)}
            </div>
            <div>{getAppointmentLocation(appointment)}</div>
          </>
        )}
      </div>
    </li>
  );
}
