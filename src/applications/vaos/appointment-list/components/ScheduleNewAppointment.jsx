import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import { startNewAppointmentFlow } from '../redux/actions';
import {
  selectFeatureRequests,
  selectFeatureStatusImprovement,
} from '../../redux/selectors';

function handleClick(history, dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(`/new-appointment`);
  };
}

function ScheduleNewAppointmentButton() {
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className="vaos-hide-for-print"
      aria-label="Start scheduling an appointment"
      id="schedule-button"
      onClick={handleClick(history, dispatch)}
    >
      Start scheduling
    </button>
  );
}

export default function ScheduleNewAppointment() {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const showScheduleButton = useSelector(state => selectFeatureRequests(state));

  if (featureStatusImprovement) {
    // Only display scheduling button on upcoming appointments page
    if (
      location.pathname.endsWith('pending') ||
      location.pathname.endsWith('past')
    ) {
      return null;
    }
    return <ScheduleNewAppointmentButton />;
  }

  return (
    <>
      {!featureStatusImprovement &&
        showScheduleButton && (
          <div className="vads-u-margin-bottom--1p5 vaos-hide-for-print">
            Schedule primary or specialty care appointments.
          </div>
        )}

      <button
        type="button"
        className="vaos-hide-for-print"
        aria-label="Start scheduling an appointment"
        id="schedule-button"
        onClick={handleClick(history, dispatch)}
      >
        Start scheduling
      </button>
    </>
  );
}
