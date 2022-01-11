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

  const canceler = new Map([
    [CANCELLATION_REASONS.patient, 'You'],
    [CANCELLATION_REASONS.provider, `${facility?.name || 'Facility'}`],
  ]);

  if (canceled) {
    const who = canceler.get(appointment.cancelationReason);
    return (
      <InfoAlert status="error" backgroundOnly>
        {`${who || 'Facility'} canceled this appointment.`}
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
        <strong>We’ve scheduled and confirmed your appointment.</strong>
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
            Review your appointments
          </Link>
        </div>
        <div>
          <Link to="/new-appointment">Schedule a new appointment</Link>
        </div>
      </InfoAlert>
    );
  }

  return null;
}
