import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import { startNewAppointmentFlow } from '../redux/actions';

export default function ScheduleNewAppointment() {
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <>
      <div className="vads-u-margin-bottom--1p5 vaos-hide-for-print">
        Schedule primary or specialty care appointments.
      </div>

      <button
        className="vaos-hide-for-print"
        aria-label="Start scheduling an appointment"
        id="schedule-button"
        type="button"
        onClick={() => {
          recordEvent({
            event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
          });
          dispatch(startNewAppointmentFlow());
          history.push(`/new-appointment`);
        }}
      >
        Start scheduling
      </button>
    </>
  );
}
