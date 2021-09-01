import React from 'react';
import moment from '../../../lib/moment-tz';
import { useDispatch } from 'react-redux';
import { startAppointmentCancel } from '../../redux/actions';

function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

export default function CancelLink({ appointment }) {
  const dispatch = useDispatch();
  return (
    <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
      <i
        aria-hidden="true"
        className="fas fa-times vads-u-margin-right--1 vads-u-font-size--lg vads-u-color--link-default"
      />
      <button
        onClick={() => dispatch(startAppointmentCancel(appointment))}
        aria-label={`Cancel appointment on ${formatAppointmentDate(
          moment.parseZone(appointment.start),
        )}`}
        className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
      >
        Cancel appointment
        <span className="sr-only">
          {' '}
          on {formatAppointmentDate(moment.parseZone(appointment.start))}
        </span>
      </button>
    </div>
  );
}
