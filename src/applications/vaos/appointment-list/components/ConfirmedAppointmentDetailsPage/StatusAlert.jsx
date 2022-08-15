import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import InfoAlert from '../../../components/InfoAlert';
import {
  APPOINTMENT_STATUS,
  CANCELLATION_REASONS,
  GA_PREFIX,
} from '../../../utils/constants';

function handleClick() {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
    });
  };
}
export default function StatusAlert({ appointment, facility }) {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment } = appointment.vaos;

  const canceler = new Map([
    [CANCELLATION_REASONS.patient, 'You'],
    [CANCELLATION_REASONS.provider, `${facility?.name || 'Facility'}`],
  ]);

  if (canceled) {
    const who = canceler.get(appointment?.cancelationReason) || 'Facility';
    return (
      <>
        <InfoAlert status="error" backgroundOnly>
          <strong>{who} canceled your appointment. </strong>
          If you want to reschedule, call us or schedule a new appointment
          online.
        </InfoAlert>
      </>
    );
  }
  if (isPastAppointment) {
    return (
      <InfoAlert status="warning" backgroundOnly>
        This appointment occurred in the past.
      </InfoAlert>
    );
  }
  if (showConfirmMsg) {
    return (
      <InfoAlert backgroundOnly status="success">
        <strong>We’ve scheduled and confirmed your appointment.</strong>
        <br />
        <div className="vads-u-margin-y--1">
          <Link to="/" onClick={handleClick()}>
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

StatusAlert.propTypes = {
  appointment: PropTypes.object.isRequired,
};
