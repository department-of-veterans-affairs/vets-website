import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import { startNewAppointmentFlow } from '../redux/actions';
import {
  selectFeatureRequests,
  selectFeatureStatusImprovement,
  selectFeaturePrintList,
  selectFeatureStartSchedulingLink,
} from '../../redux/selectors';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';

function handleClick(
  history,
  dispatch,
  typeOfCare,
  featureStartSchedulingLink = false,
) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    recordEvent({
      event: featureStartSchedulingLink
        ? `${GA_PREFIX}-start-scheduling-link`
        : `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(typeOfCare.url);
  };
}

function ScheduleNewAppointmentButton() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isPrintList = useSelector(state => selectFeaturePrintList(state));
  const { typeOfCare } = useSelector(getNewAppointmentFlow);
  const featureStartSchedulingLink = useSelector(
    selectFeatureStartSchedulingLink,
  );

  return featureStartSchedulingLink ? (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--2p5"
      href="/"
      onClick={handleClick(
        history,
        dispatch,
        typeOfCare,
        featureStartSchedulingLink,
      )}
    >
      Start scheduling
    </a>
  ) : (
    <button
      type="button"
      className={`xsmall-screen:${
        isPrintList ? 'vads-u-margin-bottom--3' : 'vads-u-margin-bottom--2'
      } vaos-hide-for-print vads-u-margin--0 small-screen:vads-u-margin-bottom--4`}
      aria-label="Start scheduling an appointment"
      id="schedule-button"
      onClick={handleClick(history, dispatch, typeOfCare)}
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
  const { typeOfCare } = useSelector(getNewAppointmentFlow);

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
        onClick={handleClick(history, dispatch, typeOfCare)}
      >
        Start scheduling
      </button>
    </>
  );
}
