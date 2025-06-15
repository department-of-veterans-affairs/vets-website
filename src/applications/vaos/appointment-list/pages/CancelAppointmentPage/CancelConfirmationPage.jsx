import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AppointmentCard from '../../../components/AppointmentCard';
import BackLink from '../../../components/BackLink';
import { APPOINTMENT_TYPES, GA_PREFIX } from '../../../utils/constants';
import { startNewAppointmentFlow } from '../../redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../../new-appointment/newAppointmentFlow';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { selectAppointmentType } from '../../redux/selectors';
import { selectFeatureFeSourceOfTruth } from '../../../redux/selectors';

import CancelPageContent from './CancelPageContent';

function handleClick(history, dispatch, url) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(url);
  };
}

export default function CancelConfirmationPage({ appointment, cancelInfo }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const useFeSourceOfTruth = useSelector(state =>
    selectFeatureFeSourceOfTruth(state),
  );
  const { typeOfCare: page } = useSelector(getNewAppointmentFlow);
  const { showCancelModal } = cancelInfo;
  const type = selectAppointmentType(appointment);
  const isRequest = useFeSourceOfTruth
    ? appointment.vaos.isPendingAppointment
    : APPOINTMENT_TYPES.request === type ||
      APPOINTMENT_TYPES.ccRequest === type;

  let heading = 'You have canceled your appointment';
  if (isRequest) heading = 'You have canceled your request';

  useEffect(() => {
    scrollAndFocus();
  }, []);

  if (!showCancelModal) {
    return null;
  }

  return (
    <>
      <BackLink appointment={appointment} />
      <h1 className="vads-u-margin-y--2p5">{heading}</h1>
      <p>
        If you still need an appointment, call us or request a new appointment
        online.
      </p>
      <a
        className="vads-c-action-link--blue vaos-hide-for-print vads-u-margin-bottom--1p5"
        href="/"
        onClick={handleClick(history, dispatch, page.url)}
      >
        Scheduling a new appointment
      </a>
      <AppointmentCard appointment={appointment}>
        <CancelPageContent isRequest={isRequest} />
      </AppointmentCard>
    </>
  );
}
CancelConfirmationPage.propTypes = {
  appointment: PropTypes.object,
  cancelInfo: PropTypes.object,
};
