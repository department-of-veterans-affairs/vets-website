import React from 'react';
import { APPOINTMENT_STATUS } from '../utils/constants';

export default function AppointmentStatus({
  status,
  index,
  isPastAppointment,
}) {
  let iconClass = null;
  let content = null;

  switch (status) {
    case null:
      return null;
    case APPOINTMENT_STATUS.pending: {
      iconClass = 'fa-exclamation-triangle';
      content = (
        <>
          <strong id={`card-${index}-status`}>Pending</strong>{' '}
          <div className="vads-u-font-weight--normal">
            The time and date of this appointment are still to be determined.
          </div>
        </>
      );
      break;
    }
    case APPOINTMENT_STATUS.booked: {
      iconClass = 'fa-check-circle';
      content = (
        <span id={`card-${index}-status`}>
          {isPastAppointment ? 'Completed' : 'Confirmed'}
        </span>
      );
      break;
    }
    case APPOINTMENT_STATUS.cancelled: {
      iconClass = 'fa-exclamation-circle';
      content = <span id={`card-${index}-status`}>Canceled</span>;
      break;
    }
    default: {
      iconClass = '';
      content = null;
      break;
    }
  }

  return (
    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-y--2">
      <div className="vads-u-margin-right--1">
        <i aria-hidden="true" className={`fas ${iconClass}`} />
      </div>
      <span className="vads-u-font-weight--bold vads-u-flex--1">
        <div className="vaos-appts__status-text vads-u-font-size--base vads-u-font-family--sans">
          {content}
        </div>
      </span>
    </div>
  );
}
