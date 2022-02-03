import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import PropTypes from 'prop-types';
import { startNewAppointmentFlow } from '../redux/actions';
import { selectFeatureStatusImprovement } from '../../redux/selectors';

function handleClick(history, dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(`/new-appointment`);
  };
}

export default function ScheduleNewAppointment({
  displaySchedulingButton = true,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  if (featureStatusImprovement && !displaySchedulingButton) {
    return null;
  }

  return (
    <>
      {!featureStatusImprovement && (
        <div className="vads-u-margin-bottom--1p5 vaos-hide-for-print">
          Schedule primary or specialty care appointments.
        </div>
      )}

      <button
        className="vaos-hide-for-print"
        aria-label="Start scheduling an appointment"
        id="schedule-button"
        type="button"
        onClick={handleClick(history, dispatch)}
      >
        Start scheduling
      </button>
    </>
  );
}

ScheduleNewAppointment.propTypes = {
  displaySchedulingButton: PropTypes.bool,
};
