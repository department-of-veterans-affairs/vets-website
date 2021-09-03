import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import InfoAlert from '../../../components/InfoAlert';
import {
  APPOINTMENT_STATUS,
  CANCELLATION_REASONS,
  GA_PREFIX,
} from '../../../utils/constants';

export default function StatusAlert({ appointment, facility }) {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;
  const canceler =
    appointment.cancellationReason === CANCELLATION_REASONS.pat
      ? 'You'
      : facility?.name || 'Facility';

  if (canceled) {
    return (
      <InfoAlert status="error" backgroundOnly>
        {`${canceler} canceled this appointment.`}
      </InfoAlert>
    );
  } else if (isPastAppointment) {
    return (
      <InfoAlert status="warning" backgroundOnly>
        This appointment occurred in the past.
      </InfoAlert>
    );
  } else if (showConfirmMsg) {
    return (
      <InfoAlert backgroundOnly status="success">
        <strong>Your appointment has been scheduled and is confirmed.</strong>
        <br />
        <div className="vads-u-margin-y--1">
          <Link
            to="/"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
              });
            }}
          >
            View your appointments
          </Link>
        </div>
        <div>
          <Link to="/new-appointment">New appointment</Link>
        </div>
      </InfoAlert>
    );
  }

  return null;
}
