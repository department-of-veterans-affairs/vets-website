import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import InfoAlert from '../../../components/InfoAlert';
import {
  APPOINTMENT_STATUS,
  CANCELLATION_REASONS,
  GA_PREFIX,
} from '../../../utils/constants';
import { startNewAppointmentFlow } from '../../redux/actions';

function handleClick(history, dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(`/new-appointment`);
  };
}

export default function StatusAlert({ appointment, facility }) {
  const history = useHistory();
  const dispatch = useDispatch();

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
          <va-link
            text="Review your appointments"
            data-testid="review-appointments-link"
            href="/health-care/schedule-view-va-appointments/appointments/"
            onClick={() =>
              recordEvent({
                event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
              })
            }
          />
        </div>
        <div>
          <va-link
            text="Schedule a new appointment"
            data-testid="schedule-appointment-link"
            onClick={handleClick(history, dispatch)}
          />
        </div>
      </InfoAlert>
    );
  }

  return null;
}

StatusAlert.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
