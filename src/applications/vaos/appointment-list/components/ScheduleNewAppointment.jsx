import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import { startNewAppointmentFlow } from '../redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';
import { selectFeatureImmediateCareAlert } from '../../redux/selectors';

function handleClick(history, dispatch, pageKey) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    recordEvent({
      event: `${GA_PREFIX}-start-scheduling-link`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(pageKey.url);
  };
}

function ScheduleNewAppointmentButton() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { typeOfCare } = useSelector(getNewAppointmentFlow);
  const { urgentCareInformation } = useSelector(getNewAppointmentFlow);
  const featureImmediateCareAlert = useSelector(
    selectFeatureImmediateCareAlert,
  );

  if (featureImmediateCareAlert)
    return (
      <a
        className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--2p5"
        href="/"
        onClick={handleClick(history, dispatch, urgentCareInformation)}
      >
        Schedule a new appointment
      </a>
    );

  return (
    <a
      className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--2p5"
      href="/"
      onClick={handleClick(history, dispatch, typeOfCare)}
    >
      Start scheduling an appointment
    </a>
  );
}

export default function ScheduleNewAppointment() {
  const location = useLocation();

  // Only display scheduling button on upcoming appointments page
  if (
    location.pathname.endsWith('pending') ||
    location.pathname.endsWith('past')
  ) {
    return null;
  }
  return <ScheduleNewAppointmentButton />;
}
